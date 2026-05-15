import { AIAnalysisPanel } from '../ai/AIAnalysisPanel';
import { StatusPill } from './StatusPill';

export const IncidentDetail = ({ incident }) => (
  <div className="space-y-5">
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">{incident.animalType}</h1>
          <p className="mt-1 text-sm capitalize text-gray-500">{incident.emergencyCategory?.replaceAll('_', ' ')}</p>
        </div>
        <StatusPill status={incident.status} />
      </div>
      <p className="mt-4 text-gray-700">{incident.description}</p>
      <p className="mt-3 text-sm text-gray-500">{incident.location?.address || incident.location?.city}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">{incident.images?.map((src) => <img className="h-40 w-full rounded-lg object-cover" key={src} src={src} alt="Incident" />)}</div>
    </div>
    <AIAnalysisPanel analysis={incident.aiAnalysis} />
  </div>
);
