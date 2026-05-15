import { useState } from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { IncidentCard } from '../components/incident/IncidentCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useIncidents } from '../hooks/useIncidents';
import { api } from '../services/api';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { incidents, loading } = useIncidents(Boolean(user));
  const [incidentId, setIncidentId] = useState('');
  const [trackedIncident, setTrackedIncident] = useState(null);
  const [error, setError] = useState('');

  const track = async (e) => {
    e.preventDefault();
    setError('');
    setTrackedIncident(null);
    try {
      const { data } = await api.get(`/api/incidents/${incidentId.trim()}`);
      setTrackedIncident(data.incident || data);
    } catch {
      setError('No incident found for that ID.');
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-medium">Track an incident</h1>
        <form onSubmit={track} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <label className="text-sm font-medium">Enter your Incident ID</label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input className={inputClass} value={incidentId} onChange={(e) => setIncidentId(e.target.value)} placeholder="Incident ID" />
            <Button disabled={!incidentId.trim()}>Track</Button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </form>
        {trackedIncident && <div className="mt-5"><IncidentCard incident={trackedIncident} /></div>}
      </div>
    );
  }

  if (loading) return null;
  return (
    <div>
      <h1 className="mb-6 text-3xl font-medium">Your incidents</h1>
      <div className="grid gap-4">
        {incidents.length ? incidents.map((incident) => <IncidentCard key={incident._id} incident={incident} />) : <EmptyState title="No incidents yet" text="Reports submitted while logged in will appear here." />}
      </div>
    </div>
  );
}
