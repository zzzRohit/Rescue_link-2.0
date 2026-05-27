import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function TrackIncident() {
  const navigate = useNavigate();
  const [incidentId, setIncidentId] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const cleanId = incidentId.trim().replace(/^#/, '');
    if (!cleanId) {
      setError('Enter the incident ID from your report confirmation.');
      return;
    }
    if (!/^[a-fA-F0-9]{24}$/.test(cleanId)) {
      setError('Paste the full 24-character incident ID.');
      return;
    }
    navigate(`/incident/${cleanId}`);
  };

  return (
    <div className="mx-auto max-w-xl">
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
            <Search className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-medium text-gray-950">Track an incident</h1>
            <p className="mt-1 text-sm text-gray-500">No account is required. Use the incident ID shown after submitting a report.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="text-sm font-medium text-gray-700" htmlFor="incident-id">Incident ID</label>
          <input
            id="incident-id"
            className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Paste incident ID"
            value={incidentId}
            onChange={(e) => {
              setError('');
              setIncidentId(e.target.value);
            }}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="inline-flex w-full items-center justify-center gap-2">
            <Search className="h-4 w-4" />
            Track report
          </Button>
        </form>
      </section>
    </div>
  );
}
