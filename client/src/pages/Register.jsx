import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: 'rescuer', specialties: [] });
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const useLocation = () => {
    if (!navigator.geolocation) {
      setError('Location is not supported by this browser.');
      return;
    }
    setError('');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({ ...current, lat: coords.latitude, lng: coords.longitude }));
        setLocating(false);
      },
      () => {
        setError('Could not read your location. Enter your city manually.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await register({ ...form, role: 'rescuer' });
      navigate('/rescuer/pending-verification', { state: { rescuerId: user._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };
  return (
    <form onSubmit={submit} className="mx-auto max-w-lg rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-medium">Register</h1>
      <div className="mt-5 space-y-3">
        <input className={input} placeholder="Name" onChange={(e) => set('name', e.target.value)} />
        <input className={input} placeholder="Email" onChange={(e) => set('email', e.target.value)} />
        <input className={input} type="password" placeholder="Password" onChange={(e) => set('password', e.target.value)} />
        <input className={input} placeholder="Phone" onChange={(e) => set('phone', e.target.value)} />
        <input className={input} placeholder="City" onChange={(e) => set('city', e.target.value.toLowerCase())} />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="secondary" onClick={useLocation} disabled={locating} className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {locating ? 'Reading location...' : 'Use my location'}
          </Button>
          {typeof form.lat === 'number' && typeof form.lng === 'number' && (
            <span className="text-xs text-gray-500">Location added</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">{['mammals', 'birds', 'reptiles', 'all'].map((item) => <button type="button" key={item} onClick={() => set('specialties', form.specialties.includes(item) ? form.specialties.filter((x) => x !== item) : [...form.specialties, item])} className={`rounded-full border px-3 py-1.5 text-sm ${form.specialties.includes(item) ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>{item}</button>)}</div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <Button className="mt-5 w-full">Create account</Button>
    </form>
  );
}
