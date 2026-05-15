import { useState } from 'react';

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const upload = async (files) => {
    const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) {
      setError('Cloudinary env vars are missing.');
      return [];
    }
    setUploading(true);
    setError('');
    const urls = [];
    for (let i = 0; i < files.length; i += 1) {
      const form = new FormData();
      form.append('file', files[i]);
      form.append('upload_preset', preset);
      form.append('folder', 'rescuelink');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Image upload failed');
      const data = await res.json();
      urls.push(data.secure_url);
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    setUploading(false);
    return urls;
  };

  return { upload, uploading, progress, error };
};
