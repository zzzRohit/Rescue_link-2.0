import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, UserCheck } from 'lucide-react';
import { AuthorityContacts } from '../components/incident/AuthorityContacts';
import { IncidentDetail } from '../components/incident/IncidentDetail';
import { RescueStatusStepper } from '../components/rescuer/RescueStatusStepper';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const nextStatus = { pending: 'accepted', accepted: 'on_the_way', on_the_way: 'rescued', rescued: 'closed' };
const contactVisibleStatuses = ['accepted', 'on_the_way', 'rescued', 'closed'];

const RescuerContact = ({ incident }) => {
  const rescuer = incident.assignedRescuer;
  const canShowContact = rescuer && contactVisibleStatuses.includes(incident.status);

  if (!canShowContact) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-amber-700">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-medium text-amber-950">Waiting for rescuer acceptance</h2>
            <p className="mt-1 text-sm leading-6 text-amber-800">Once a verified rescuer accepts this report, their name and contact number will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-800">
            <UserCheck className="h-5 w-5" />
            <h2 className="font-medium">Assigned rescuer</h2>
          </div>
          <p className="mt-3 text-xl font-medium text-gray-950">{rescuer.name}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
            {rescuer.city && (
              <span className="inline-flex items-center gap-1 capitalize">
                <MapPin className="h-4 w-4" />
                {rescuer.city}
              </span>
            )}
            {rescuer.specialties?.length > 0 && <span className="capitalize">{rescuer.specialties.join(', ')}</span>}
          </div>
        </div>
        {rescuer.phone && (
          <a href={`tel:${rescuer.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800">
            <Phone className="h-4 w-4" />
            Call {rescuer.phone}
          </a>
        )}
      </div>
    </div>
  );
};

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
      {!isAuthority && <RescuerContact incident={incident} />}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="font-medium text-gray-950">Rescue progress</h2>
          <p className="mt-1 text-sm text-gray-500">This status updates as the assigned rescuer moves through the rescue.</p>
        </div>
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
