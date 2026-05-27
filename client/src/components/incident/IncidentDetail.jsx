import { StatusPill } from './StatusPill';
import { timeAgo } from '../../utils/formatDate';

export const IncidentDetail = ({ incident }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-green-700">Incident tracking</p>
        <h1 className="mt-2 text-3xl font-medium text-gray-950">{incident.animalType}</h1>
        <p className="mt-1 text-sm capitalize text-gray-500">{incident.emergencyCategory?.replaceAll('_', ' ')}</p>
      </div>
      <StatusPill status={incident.status} />
    </div>

    <div className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_.9fr]">
      <div>
        <h2 className="text-sm font-medium text-gray-900">Report details</h2>
        <p className="mt-2 leading-6 text-gray-700">{incident.description}</p>
        <p className="mt-3 text-sm text-gray-500">{incident.location?.address || incident.location?.city || 'Location pending'}</p>
      </div>
      <div className="rounded-lg bg-gray-50 p-4 text-sm">
        <p className="text-gray-500">Incident ID</p>
        <p className="mt-1 break-all font-medium text-gray-900">{incident._id}</p>
        <p className="mt-4 text-gray-500">Reported</p>
        <p className="mt-1 font-medium text-gray-900">{timeAgo(incident.createdAt)}</p>
      </div>
    </div>

    {incident.images?.length > 0 && (
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {incident.images.map((src) => <img className="h-40 w-full rounded-lg object-cover" key={src} src={src} alt="Incident" />)}
      </div>
    )}
  </div>
);
