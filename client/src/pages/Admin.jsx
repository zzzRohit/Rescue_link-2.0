import { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200';
const ADMIN_SESSION_KEY = 'rescuelink_admin_session';
const ADMIN_SESSION_MS = 24 * 60 * 60 * 1000;

const readAdminSession = () => {
  localStorage.removeItem('rescuelink_admin_key');
  try {
    const session = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || 'null');
    if (!session?.key || !session?.expiresAt || Date.now() >= session.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return { key: '', unlocked: false };
    }
    return { key: session.key, unlocked: true };
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return { key: '', unlocked: false };
  }
};

export default function Admin() {
  const [initialSession] = useState(readAdminSession);
  const [adminKey, setAdminKey] = useState(initialSession.key);
  const [unlocked, setUnlocked] = useState(initialSession.unlocked);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headers = adminKey ? { 'x-admin-key': adminKey } : {};

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/api/auth/admin/pending-rescuers');
      setPending(data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not load pending rescuers');
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  const unlock = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/admin/session', null, { headers });
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
        key: adminKey,
        expiresAt: Date.now() + ADMIN_SESSION_MS
      }));
      setUnlocked(true);
    } catch (err) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setUnlocked(false);
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not unlock admin actions');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (rescuerId) => {
    setError('');
    if (!unlocked) {
      setError('Unlock admin actions before verifying rescuers.');
      return;
    }
    try {
      await api.post('/api/auth/admin/verify-rescuer', { rescuerId }, { headers });
      setPending((current) => current.filter((rescuer) => rescuer._id !== rescuerId));
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not verify rescuer');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-green-800">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Admin only</span>
          </div>
          <h1 className="mt-2 text-2xl font-medium">Rescuer verification</h1>
        </div>
        <Button type="button" variant="secondary" onClick={load} disabled={loading} className="inline-flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <label className="text-sm font-medium text-gray-700" htmlFor="admin-key">Admin secret key</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="admin-key"
            className={input}
            type="password"
            value={adminKey}
            onChange={(e) => {
              setAdminKey(e.target.value);
              setUnlocked(false);
            }}
            placeholder="Enter ADMIN_SECRET_KEY"
          />
          <Button type="button" onClick={unlock} disabled={loading || !adminKey}>{unlocked ? 'Unlocked' : 'Unlock'}</Button>
        </div>
        <p className="mt-2 text-xs text-gray-500">Pending rescuers are visible to review. Verification stays unlocked for 1 day.</p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {!loading && pending.length === 0 ? (
        <EmptyState title="No pending rescuers" text="New rescuer registrations will appear here for approval." />
      ) : (
        <div className="grid gap-4">
          {pending.map((rescuer) => (
            <article key={rescuer._id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium text-gray-950">{rescuer.name}</h2>
                    <Badge className="bg-yellow-50 text-yellow-700">Pending</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{rescuer.email} - {rescuer.phone}</p>
                  <p className="mt-1 text-sm capitalize text-gray-500">{rescuer.city || 'Location only'} - {rescuer.specialties?.join(', ')}</p>
                  {typeof rescuer.lat === 'number' && typeof rescuer.lng === 'number' && (
                    <p className="mt-1 text-xs text-gray-400">{rescuer.lat.toFixed(5)}, {rescuer.lng.toFixed(5)}</p>
                  )}
                </div>
                <Button type="button" onClick={() => verify(rescuer._id)} disabled={!unlocked} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Verify rescuer
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
