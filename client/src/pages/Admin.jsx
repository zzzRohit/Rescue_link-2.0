import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Plus, RefreshCw, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { rescueSpecialties } from '../constants/rescueSpecialties';

const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200';
const ADMIN_SESSION_KEY = 'rescuelink_admin_session';

const blankRescuer = {
  name: '',
  email: '',
  password: '',
  phone: '',
  whatsapp: '',
  city: '',
  address: '',
  specialties: ['all'],
  available24hr: false,
  type: 'contact',
  verified: true
};

const clearAdminSession = () => {
  localStorage.removeItem('rescuelink_admin_key');
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [rescuers, setRescuers] = useState([]);
  const [form, setForm] = useState(blankRescuer);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = useMemo(() => (adminKey ? { 'x-admin-key': adminKey } : {}), [adminKey]);
  const pending = rescuers.filter((rescuer) => rescuer.type === 'platform' && !rescuer.verified);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const load = async () => {
    if (!unlocked) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/api/auth/admin/rescuers', { headers });
      setRescuers(data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not load rescuers');
      setRescuers([]);
    } finally {
      setLoading(false);
    }
  };

  const unlock = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/admin/session', null, { headers });
      clearAdminSession();
      setUnlocked(true);
    } catch (err) {
      clearAdminSession();
      setUnlocked(false);
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not unlock admin actions');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (rescuerId) => {
    setError('');
    try {
      await api.post('/api/auth/admin/verify-rescuer', { rescuerId }, { headers });
      setRescuers((current) => current.map((rescuer) => (
        rescuer._id === rescuerId ? { ...rescuer, verified: true } : rescuer
      )));
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not verify rescuer');
    }
  };

  const addRescuer = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        city: form.city.toLowerCase().trim(),
        email: form.email.trim() || undefined,
        password: form.password || undefined,
        whatsapp: form.whatsapp.trim() || undefined
      };
      const { data } = await api.post('/api/auth/admin/rescuers', payload, { headers });
      setRescuers((current) => [data, ...current]);
      setForm(blankRescuer);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not add rescuer');
    } finally {
      setSaving(false);
    }
  };

  const toggleSpecialty = (specialty) => {
    setForm((current) => {
      if (specialty === 'all') return { ...current, specialties: ['all'] };
      const withoutAll = current.specialties.filter((item) => item !== 'all');
      const specialties = withoutAll.includes(specialty)
        ? withoutAll.filter((item) => item !== specialty)
        : [...withoutAll, specialty];
      return { ...current, specialties: specialties.length ? specialties : ['all'] };
    });
  };

  useEffect(() => {
    clearAdminSession();
  }, []);

  useEffect(() => {
    if (unlocked) load();
  }, [unlocked]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-green-800">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Admin only</span>
          </div>
          <h1 className="mt-2 text-2xl font-medium">Rescuer dashboard</h1>
        </div>
        {unlocked && (
          <Button type="button" variant="secondary" onClick={load} disabled={loading} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>

      {!unlocked ? (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <label className="text-sm font-medium text-gray-700" htmlFor="admin-key">Admin secret key</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="admin-key"
              className={input}
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter ADMIN_SECRET_KEY"
            />
            <Button type="button" onClick={unlock} disabled={loading || !adminKey}>Unlock</Button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total rescuers</p>
              <p className="mt-1 text-2xl font-medium text-gray-950">{rescuers.length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Verified</p>
              <p className="mt-1 text-2xl font-medium text-gray-950">{rescuers.filter((rescuer) => rescuer.verified).length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Pending verification</p>
              <p className="mt-1 text-2xl font-medium text-gray-950">{pending.length}</p>
            </div>
          </div>

          <form onSubmit={addRescuer} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-700" />
              <h2 className="font-medium text-gray-950">Add rescuer manually</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className={input} placeholder="Name" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
              <input className={input} placeholder="Phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} required />
              <input className={input} placeholder="City" value={form.city} onChange={(e) => setField('city', e.target.value)} required />
              <input className={input} placeholder="Address" value={form.address} onChange={(e) => setField('address', e.target.value)} />
              <input className={input} placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setField('whatsapp', e.target.value)} />
              <select className={input} value={form.type} onChange={(e) => setField('type', e.target.value)}>
                <option value="contact">Directory contact</option>
                <option value="platform">Login-enabled rescuer</option>
              </select>
              {form.type === 'platform' && (
                <>
                  <input className={input} placeholder="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} required />
                  <input className={input} type="password" placeholder="Password" value={form.password} onChange={(e) => setField('password', e.target.value)} required />
                </>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
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
              <label className="ml-0 flex items-center gap-2 text-sm text-gray-600 sm:ml-3">
                <input type="checkbox" checked={form.available24hr} onChange={(e) => setField('available24hr', e.target.checked)} />
                24hr
              </label>
            </div>
            <Button className="mt-4" disabled={saving}>{saving ? 'Adding...' : 'Add rescuer'}</Button>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </form>

          {loading ? null : rescuers.length === 0 ? (
            <EmptyState title="No rescuers yet" text="Add a rescuer manually or wait for rescuer registrations." />
          ) : (
            <div className="grid gap-4">
              {rescuers.map((rescuer) => (
                <article key={rescuer._id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-medium text-gray-950">{rescuer.name}</h2>
                        <Badge className={rescuer.verified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
                          {rescuer.verified ? 'Verified' : 'Pending'}
                        </Badge>
                        <Badge className="bg-gray-50 text-gray-600">{rescuer.type}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{rescuer.email || 'No login email'} - {rescuer.phone}</p>
                      <p className="mt-1 text-sm capitalize text-gray-500">{rescuer.city || 'Location only'} - {rescuer.specialties?.join(', ')}</p>
                      {rescuer.address && <p className="mt-1 text-xs text-gray-400">{rescuer.address}</p>}
                    </div>
                    {!rescuer.verified && (
                      <Button type="button" onClick={() => verify(rescuer._id)} className="inline-flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Verify rescuer
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
