import { useState } from "react";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });

const serverUpload = async (files) => {
  const images = await Promise.all(files.map(fileToDataUrl));
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || "https://rescue-link-backend.onrender.com"}/api/uploads/images`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.urls || [];
};

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const upload = async (files) => {
    const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    setUploading(true);
    setError("");
    try {
      if (!cloud || !preset) {
        const urls = await serverUpload(files);
        setProgress(100);
        return urls;
      }

      const urls = [];
      for (let i = 0; i < files.length; i += 1) {
        const form = new FormData();
        form.append("file", files[i]);
        form.append("upload_preset", preset);
        form.append("folder", "rescuelink");
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
          { method: "POST", body: form },
        );
        if (!res.ok) {
          const fallbackUrls = await serverUpload(files.slice(i));
          urls.push(...fallbackUrls);
          setProgress(100);
          return urls;
        }
        const data = await res.json();
        urls.push(data.secure_url);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      return urls;
    } catch (err) {
      setError(err.message || "Image upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error };
};
