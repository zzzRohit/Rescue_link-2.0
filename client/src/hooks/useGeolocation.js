import { useState } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const locate = () => {
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || '';
        setLocation({ lat, lng, city: city.toLowerCase(), address: data.display_name || '' });
      } catch {
        setLocation({ lat, lng, city: '', address: '' });
      } finally {
        setLoading(false);
      }
    }, () => {
      setError('Unable to access your location.');
      setLoading(false);
    });
  };

  return { location, loading, error, locate };
};
