import { Link } from 'react-router-dom';
import { SeverityBadge } from './SeverityBadge';
import { StatusPill } from './StatusPill';
import { timeAgo } from '../../utils/formatDate';

export const IncidentCard = ({ incident, action }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="font-medium">{incident.animalType}</h3>
        <p className="mt-1 text-sm capitalize text-gray-500">{incident.emergencyCategory?.replaceAll('_', ' ')}</p>
      </div>
      <div className="flex gap-2"><SeverityBadge severity={incident.aiAnalysis?.severity} /><StatusPill status={incident.status} /></div>
    </div>
    <p className="mt-3 line-clamp-2 text-sm text-gray-600">{incident.description}</p>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
      <span>{incident.location?.address || incident.location?.city || 'Location pending'} · {timeAgo(incident.createdAt)}</span>
      {action || <Link className="font-medium text-green-800" to={`/incident/${incident._id}`}>View details</Link>}
    </div>
  </div>
);
