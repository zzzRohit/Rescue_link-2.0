import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IncidentDetail } from '../components/incident/IncidentDetail';
import { RescueStatusStepper } from '../components/rescuer/RescueStatusStepper';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const nextStatus = { pending: 'accepted', accepted: 'on_the_way', on_the_way: 'rescued', rescued: 'closed' };

export default function IncidentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [notes, setNotes] = useState('');
  useEffect(() => { api.get(`/api/incidents/${id}`).then((res) => setIncident(res.data.incident || res.data)); }, [id]);
  if (!incident) return null;
  const canUpdate = user?.role === 'rescuer' && (!incident.assignedRescuer || incident.assignedRescuer._id === user._id);
  const move = async () => {
    const { data } = await api.patch(`/api/incidents/${id}/status`, { status: nextStatus[incident.status], rescuerNotes: notes });
    setIncident(data);
  };
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <IncidentDetail incident={incident} />
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <RescueStatusStepper status={incident.status} />
        {canUpdate && nextStatus[incident.status] && (
          <div className="mt-5 space-y-3">
            <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" rows="3" placeholder="Rescue notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Button onClick={move}>Mark {nextStatus[incident.status].replaceAll('_', ' ')}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
