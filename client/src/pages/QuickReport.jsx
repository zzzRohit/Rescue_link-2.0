import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Baby,
  Camera,
  Check,
  Copy,
  MapPin,
  Route,
  ShieldAlert,
  X,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { animals } from "../constants/animals";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";
import { api } from "../services/api";
import { getAnimalRoutingCopy } from "../utils/animalRouting";

const categories = [
  ["injured", "Injured", ShieldAlert],
  ["trapped", "Trapped", Route],
  ["orphaned", "Baby alone", Baby],
  ["road_accident", "Road", MapPin],
  ["dangerous_sighting", "High risk", ShieldAlert],
  ["abandoned", "Just saw it", Check],
];

const normalizeCity = (city = "") => {
  const value = city.toLowerCase().trim();
  const aliases = {
    bengaluru: "bangalore",
    mysuru: "mysore",
    mangaluru: "mangalore",
    shivamogga: "shimoga",
    hubballi: "hubli",
  };
  return aliases[value] || value;
};

export default function QuickReport() {
  const { upload, uploading } = useCloudinaryUpload();
  const [form, setForm] = useState({
    animalType: "",
    emergencyCategory: "",
    location: {},
    imageUrl: "",
    phone: "",
  });
  const [manualLocation, setManualLocation] = useState(false);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const routingCopy = getAnimalRoutingCopy(form.animalType);

  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const locate = () => {
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );
          const data = await res.json();
          const address = data.address || {};
          const city = normalizeCity(
            address.city ||
              address.town ||
              address.suburb ||
              address.village ||
              "",
          );
          set("location", {
            lat,
            lng,
            city,
            address: data.display_name || `${lat}, ${lng}`,
          });
        } catch {
          set("location", { lat, lng, city: "", address: `${lat}, ${lng}` });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Location access failed. Type the location instead.");
        setManualLocation(true);
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const [url] = await upload([file]);
      if (url) set("imageUrl", url);
    } catch {
      setError("Photo upload failed. You can still submit without it.");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.animalType || !form.emergencyCategory || !form.location.address) {
      setError("Animal, situation, and location are required.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/incidents/quick", form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    const authority = result.routingType === "authority";
    const copyIncidentId = () =>
      navigator.clipboard?.writeText(result.incidentId);
    return (
      <div className="mx-auto max-w-[480px]">
        <div
          className={`rounded-xl border p-8 text-center ${authority ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}
        >
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white ${authority ? "text-amber-700" : "text-green-700"}`}
          >
            <Check className="h-6 w-6" />
          </div>
          <h1
            className={`text-lg font-medium ${authority ? "text-amber-950" : "text-green-950"}`}
          >
            {authority ? "Information forwarded" : "Report sent"}
          </h1>
          <p
            className={`mt-3 text-sm ${authority ? "text-amber-800" : "text-green-800"}`}
          >
            {result.routingMessage}
          </p>

          {!authority && (
            <div
              className={`mt-4 rounded-lg border bg-white p-3 text-left ${authority ? "border-amber-100" : "border-green-100"}`}
            >
              <p className="text-xs font-medium uppercase text-gray-400">
                Incident ID
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="break-all text-sm font-medium text-gray-950">
                  {result.incidentId}
                </span>
                <button
                  type="button"
                  onClick={copyIncidentId}
                  className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                  aria-label="Copy incident ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                If you are not signed in, please copy this ID to track this
                incident later.
              </p>
            </div>
          )}

          {authority && result.authorityContacts?.length > 0 && (
            <div className="mt-5 space-y-2 text-left">
              <p className="text-xs font-medium uppercase text-amber-700 mb-3">
                Authorized contacts to reach out
              </p>
              {result.authorityContacts.map((contact) => (
                <a
                  key={`${contact.name}-${contact.phone}`}
                  href={`tel:${contact.phone}`}
                  className="block rounded-lg border border-amber-100 bg-white p-3 text-sm hover:bg-amber-50"
                >
                  <span className="font-medium text-gray-950">
                    {contact.name}
                  </span>
                  <span className="mt-1 block text-xs text-gray-600">
                    {contact.phone}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {contact.coverage}
                  </span>
                </a>
              ))}
            </div>
          )}

          <div className="mt-6 grid gap-2">
            {!authority && (
              <Link to={`/incident/${result.incidentId}`}>
                <Button className="w-full">Track this report</Button>
              </Link>
            )}
            <Button
              type="button"
              variant={authority ? "primary" : "secondary"}
              className="w-full"
              onClick={() => {
                setResult(null);
                setForm({
                  animalType: "",
                  emergencyCategory: "",
                  location: {},
                  imageUrl: "",
                  phone: "",
                });
              }}
            >
              Report another
            </Button>
            <Link to="/">
              <Button type="button" variant="secondary" className="w-full">
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[480px]">
      <Link to="/" className="text-sm text-green-700">
        Back to home
      </Link>
      <header className="mt-4">
        <h1 className="text-3xl font-medium text-gray-950">Quick report</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Spotted something? Log it in under 2 minutes. RescueLink will route it
          to the right response.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <section>
          <label className="text-sm font-medium">Animal type</label>
          <input
            className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Type animal, e.g. dog, cat, snake"
            value={form.animalType}
            onChange={(e) => set("animalType", e.target.value)}
          />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {animals.map((animal) => (
              <button
                key={animal}
                type="button"
                onClick={() => set("animalType", animal)}
                className={`shrink-0 rounded-full border px-3 py-2 text-sm ${form.animalType === animal ? "border-green-300 bg-green-50 text-green-800" : "border-gray-200 bg-white text-gray-600"}`}
              >
                {animal}
              </button>
            ))}
          </div>
          {routingCopy && (
            <div
              className={`mt-3 rounded-lg border p-3 text-sm ${routingCopy.tone === "amber" ? "border-amber-100 bg-amber-50 text-amber-800" : "border-green-100 bg-green-50 text-green-800"}`}
            >
              <p className="font-medium">{routingCopy.title}</p>
              <p className="mt-1">{routingCopy.text}</p>
            </div>
          )}
        </section>

        <section>
          <label className="text-sm font-medium">What is happening?</label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {categories.map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => set("emergencyCategory", id)}
                className={`rounded-xl border p-4 text-left text-sm ${form.emergencyCategory === id ? "border-green-400 bg-green-50 text-green-900" : "border-gray-200 bg-white text-gray-700"}`}
              >
                <Icon className="mb-2 h-5 w-5 text-green-600" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-sm font-medium">Location</label>
          <button
            type="button"
            onClick={locate}
            disabled={locating}
            className="mt-3 w-full rounded-xl bg-green-600 py-3 text-sm font-medium text-white"
          >
            {locating ? "Detecting location..." : "Use my location"}
          </button>
          {form.location.address && (
            <p className="mt-3 rounded-full bg-green-50 px-3 py-2 text-xs text-green-800">
              {form.location.city || "Location"} · Karnataka
            </p>
          )}
          <button
            type="button"
            onClick={() => setManualLocation(true)}
            className="mt-2 text-xs text-gray-500 underline"
          >
            Type location instead
          </button>
          {manualLocation && (
            <input
              className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Area, city"
              value={form.location.address || ""}
              onChange={(e) =>
                set("location", {
                  ...form.location,
                  address: e.target.value,
                  city: normalizeCity(
                    e.target.value.split(",").pop() || e.target.value,
                  ),
                })
              }
            />
          )}
        </section>

        <section>
          <label className="text-sm font-medium">
            Photo <span className="text-gray-400">(optional)</span>
          </label>
          {form.imageUrl ? (
            <div className="relative mt-3 overflow-hidden rounded-xl border border-gray-100">
              <img
                src={form.imageUrl}
                alt="Report preview"
                className="h-44 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => set("imageUrl", "")}
                className="absolute right-3 top-3 rounded-full bg-white p-1.5 shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
              <Camera className="mb-2 h-6 w-6 text-green-600" />
              {uploading ? "Uploading..." : "Add a photo (optional)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadImage}
              />
            </label>
          )}
        </section>

        <section>
          <label className="text-sm font-medium">
            Your number <span className="text-gray-400">(optional)</span>
          </label>
          <input
            className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-400">
            We will not share this publicly.
          </p>
        </section>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          disabled={submitting || uploading}
          className="w-full rounded-xl bg-green-600 py-4 text-base font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Report now →"}
        </button>
      </form>
    </div>
  );
}
