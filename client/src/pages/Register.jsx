import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { rescueSpecialties } from '../constants/rescueSpecialties';

const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200';
const blankForm = {
  role: 'citizen',
  name: '',
  email: '',
  password: '',
  phone: '',
  city: '',
  specialties: ['all']
};

export default function Register() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    navigate(user.role === 'rescuer' ? '/rescuer/dashboard' : '/citizen/incidents', { replace: true });
  }, [loading, navigate, user]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const setRole = (role) => {
    setError('');
    setForm({ ...blankForm, role });
  };

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

  const toggleSpecialty = (specialty) => {
    setForm((current) => {
      if (specialty === 'all') return { ...current, specialties: ['all'] };
      const withoutAll = current.specialties.filter((item) => item !== 'all');
      const next = withoutAll.includes(specialty)
        ? withoutAll.filter((item) => item !== specialty)
        : [...withoutAll, specialty];
      return { ...current, specialties: next.length ? next : ['all'] };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        city: form.city ? form.city.toLowerCase().trim() : undefined
      };
      const nextUser = await register(payload);
      if (payload.role === 'rescuer') {
        navigate('/rescuer/pending-verification', { state: { rescuerId: nextUser?._id } });
        return;
      }
      navigate('/citizen/incidents');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (loading || user) return null;

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-medium">Register</h1>
      <div className="mt-5 space-y-3">
        <div className="flex gap-2">
          {['citizen', 'rescuer'].map((role) => (
            <Button key={role} type="button" variant={form.role === role ? 'primary' : 'secondary'} onClick={() => setRole(role)}>
              {role}
            </Button>
          ))}
        </div>
        <input className={input} placeholder="Name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        <input className={input} placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        <input className={input} type="password" placeholder="Password" value={form.password} onChange={(e) => set('password', e.target.value)} required />
        <input className={input} placeholder="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
        {form.role === 'rescuer' && (
          <>
            <input className={input} placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={useLocation} disabled={locating} className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {locating ? 'Reading location...' : 'Use my location'}
              </Button>
              {typeof form.lat === 'number' && typeof form.lng === 'number' && (
                <span className="text-xs text-gray-500">Location added</span>
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">What do you rescue?</p>
              <div className="flex flex-wrap gap-2">
              {rescueSpecialties.map((specialty) => (
                <button
                  type="button"
                  key={specialty.id}
                  onClick={() => toggleSpecialty(specialty.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${form.specialties.includes(specialty.id) ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-200 text-gray-600'}`}
                >
                  {specialty.label}
                </button>
              ))}
              </div>
            </div>
          </>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <Button className="mt-5 w-full">Create account</Button>
      <p className="mt-4 text-center text-sm text-gray-500">Already have an account? <Link className="text-green-800" to="/login">Login</Link></p>
    </form>
  );
}
