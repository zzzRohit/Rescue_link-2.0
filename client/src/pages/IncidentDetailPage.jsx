import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthorityContacts } from '../components/incident/AuthorityContacts';
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
  const [authorityContacts, setAuthorityContacts] = useState([]);
  const [notes, setNotes] = useState('');
  useEffect(() => {
    api.get(`/api/incidents/${id}`).then((res) => {
      setIncident(res.data.incident || res.data);
      setAuthorityContacts(res.data.authorityContacts || res.data.incident?.authorityContacts || []);
    });
  }, [id]);
  if (!incident) return null;
  const isAuthority = incident.routingType === 'authority';
  const canUpdate = !isAuthority && user?.role === 'rescuer' && (!incident.assignedRescuer || incident.assignedRescuer._id === user._id);
  const move = async () => {
    const { data } = await api.patch(`/api/incidents/${id}/status`, { status: nextStatus[incident.status], rescuerNotes: notes });
    setIncident(data);
  };
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <IncidentDetail incident={incident} />
      {isAuthority && <AuthorityContacts contacts={authorityContacts} />}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        {isAuthority ? (
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-medium">Local rescuer controls are disabled</p>
            <p className="mt-1">This incident is routed to specialized animal rescue contacts.</p>
          </div>
        ) : <RescueStatusStepper status={incident.status} />}
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
