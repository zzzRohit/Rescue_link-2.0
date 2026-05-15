import { Link } from 'react-router-dom';
import { SeverityBadge } from '../incident/SeverityBadge';

export const NotificationToast = ({ incident, onClose }) => {
  if (!incident) return null;
  return (
    <div className="fixed right-4 top-4 z-40 w-80 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">New incident assigned</p>
          <p className="mt-1 text-sm text-gray-500">{incident.animalType} · {incident.emergencyCategory?.replaceAll('_', ' ')}</p>
        </div>
        <SeverityBadge severity={incident.severity} />
      </div>
      <div className="mt-4 flex justify-between text-sm"><Link className="text-green-800" to={`/incident/${incident.incidentId}`}>View</Link><button onClick={onClose}>Dismiss</button></div>
    </div>
  );
};
