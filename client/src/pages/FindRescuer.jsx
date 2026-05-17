import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, MapPin, Phone, Search } from 'lucide-react';
import { api } from '../services/api';

const cities = ['bangalore', 'mysore', 'hubli', 'mangalore', 'bellary', 'davangere', 'shimoga'];
const filters = ['all', 'animal rescuer', 'ngo volunteer', 'veterinary support', 'wildlife specialist', 'emergency responder', '24hr only'];
const nationalHelplines = [
  { name: 'Animal rescue helpline', phone: '112' },
  { name: 'Wildlife SOS specialized rescue', phone: '1800-200-9453' },
  { name: 'Authorized wildlife support', phone: '1800-425-9911' },
  { name: 'PETA India', phone: '1800-103-7382' }
];

const normalizeCity = (city = '') => {
  const value = city.toLowerCase().trim();
  const aliases = {
    bengaluru: 'bangalore',
    mysuru: 'mysore',
    mangaluru: 'mangalore',
    shivamogga: 'shimoga',
    hubballi: 'hubli',
    ballari: 'bellary'
  };
  return aliases[value] || value;
};

const pin = (available24hr) => L.divIcon({
  className: '',
  html: `<span style="display:block;width:16px;height:16px;border-radius:999px;background:${available24hr ? '#16a34a' : '#9ca3af'};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.22)"></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function FitMap({ rescuers }) {
  const map = useMap();
  useEffect(() => {
    if (!rescuers.length) return;
    const bounds = L.latLngBounds(rescuers.map((rescuer) => [rescuer.lat, rescuer.lng]));
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
  }, [map, rescuers]);
  return null;
}

export default function FindRescuer() {
  const [city, setCity] = useState('');
  const [detectedText, setDetectedText] = useState('Detecting your location...');
  const [locationDenied, setLocationDenied] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [rescuers, setRescuers] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      setDetectedText('Select your city to find nearby rescuers.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        const address = data.address || {};
        const detectedCity = normalizeCity(address.city || address.town || address.suburb || address.village || '');
        if (detectedCity) {
          setCity(detectedCity);
          setDetectedText(`Showing rescuers near ${detectedCity}, Karnataka`);
        } else {
          setLocationDenied(true);
          setDetectedText('Select your city to find nearby rescuers.');
        }
      } catch {
        setLocationDenied(true);
        setDetectedText('Select your city to find nearby rescuers.');
      }
    }, () => {
      setLocationDenied(true);
      setDetectedText('Location access denied. Select your city to continue.');
    }, { enableHighAccuracy: false, timeout: 8000 });
  }, []);

  useEffect(() => {
    if (!city) return;
    const specialtyMap = {
      'animal rescuer': 'mammals',
      'ngo volunteer': 'all',
      'veterinary support': 'mammals',
      'wildlife specialist': 'reptiles',
      'emergency responder': 'all'
    };
    const specialty = specialtyMap[activeFilter] || activeFilter;
    const params = { city };
    if (!['all', '24hr only'].includes(specialty)) params.specialty = specialty;
    api.get('/api/rescuers', { params })
      .then((res) => setRescuers(res.data))
      .catch(() => setRescuers([]));
  }, [city, activeFilter]);

  const visibleRescuers = useMemo(() => {
    const list = activeFilter === '24hr only'
      ? rescuers.filter((rescuer) => rescuer.available24hr)
      : rescuers;
    return [...list].sort((a, b) => Number(b.available24hr) - Number(a.available24hr) || a.name.localeCompare(b.name));
  }, [rescuers, activeFilter]);

  const center = visibleRescuers[0] ? [visibleRescuers[0].lat, visibleRescuers[0].lng] : [12.9716, 77.5946];

  return (
    <div className="mx-auto max-w-5xl">
      <section className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-950">Find animal rescue support</h1>
            <p className="mt-1 text-sm text-gray-500">{detectedText}</p>
          </div>
          {(locationDenied || !city) && (
            <select className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select city</option>
              {cities.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          )}
        </div>
      </section>

      <section className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {city ? (
          <MapContainer center={center} zoom={12} className="h-[200px] w-full md:h-[260px]" scrollWheelZoom={false}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitMap rescuers={visibleRescuers} />
            {visibleRescuers.map((rescuer) => (
              <Marker key={rescuer._id} position={[rescuer.lat, rescuer.lng]} icon={pin(rescuer.available24hr)} eventHandlers={{ click: () => setSelectedId(rescuer._id) }}>
                <Popup>{rescuer.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center bg-[#F9FAF7] text-center md:h-[260px]">
            <MapPin className="mb-2 h-8 w-8 text-green-600" />
            <p className="text-sm font-medium text-gray-700">Allow location or select your city above</p>
          </div>
        )}
      </section>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs capitalize transition ${activeFilter === filter ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-200 bg-white text-gray-600 hover:bg-green-50'}`}>
            {filter}
          </button>
        ))}
      </div>

      {city && visibleRescuers.length === 0 && (
        <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
          No local rescue contacts found for this filter. Use the helplines below or try another category.
        </div>
      )}

      <div className="grid gap-3">
        {visibleRescuers.map((rescuer) => (
          <article key={rescuer._id} className={`rounded-2xl border bg-white p-4 shadow-sm transition ${selectedId === rescuer._id ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-medium text-gray-950">{rescuer.name}</h2>
                  {rescuer.available24hr && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">24hr</span>}
                </div>
                <p className="mt-1 text-xs text-gray-400">{rescuer.address} · {rescuer.available24hr ? 'Open 24 hours' : 'Day hours'}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {rescuer.specialties?.map((specialty) => <span key={specialty} className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">{specialty}</span>)}
                </div>
              </div>
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${rescuer.available24hr ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${rescuer.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white">
                <Phone className="h-4 w-4" /> Call now
              </a>
              {rescuer.whatsapp && <a href={`https://wa.me/${rescuer.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600">WhatsApp</a>}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-medium text-gray-900">Animal rescue helplines</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {nationalHelplines.map((helpline) => (
            <a key={helpline.phone} href={`tel:${helpline.phone}`} className="rounded-xl border border-gray-100 p-3 text-sm hover:border-green-200 hover:bg-green-50">
              <p className="font-medium text-gray-800">{helpline.name}</p>
              <p className="mt-1 text-xs text-green-700">{helpline.phone}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <Search className="h-3.5 w-3.5" />
        Local contacts are shown for Karnataka coverage cities only.
      </div>
    </div>
  );
}
