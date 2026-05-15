import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: 'citizen', specialties: [] });
  const [error, setError] = useState('');
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form);
      if (form.role === 'rescuer') {
        navigate('/rescuer/pending-verification', { state: { rescuerId: user._id } });
        return;
      }
      navigate(user.role === 'rescuer' ? '/rescuer/dashboard' : '/citizen/incidents');
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
        <div className="flex gap-2">{['citizen', 'rescuer'].map((role) => <Button key={role} type="button" variant={form.role === role ? 'primary' : 'secondary'} onClick={() => set('role', role)}>{role}</Button>)}</div>
        {form.role === 'rescuer' && (
          <>
            <input className={input} placeholder="Phone" onChange={(e) => set('phone', e.target.value)} />
            <input className={input} placeholder="City" onChange={(e) => set('city', e.target.value.toLowerCase())} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={input} type="number" step="any" placeholder="Latitude" onChange={(e) => set('lat', Number(e.target.value))} />
              <input className={input} type="number" step="any" placeholder="Longitude" onChange={(e) => set('lng', Number(e.target.value))} />
            </div>
            <div className="flex flex-wrap gap-2">{['mammals', 'birds', 'reptiles', 'all'].map((item) => <button type="button" key={item} onClick={() => set('specialties', form.specialties.includes(item) ? form.specialties.filter((x) => x !== item) : [...form.specialties, item])} className={`rounded-full border px-3 py-1.5 text-sm ${form.specialties.includes(item) ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>{item}</button>)}</div>
          </>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <Button className="mt-5 w-full">Create account</Button>
    </form>
  );
}
