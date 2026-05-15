import { IncidentForm } from '../components/incident/IncidentForm';

export default function ReportIncident() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-medium">Report an animal emergency</h1>
      <p className="mb-6 text-gray-600">Share what you can. Anonymous reports are accepted.</p>
      <IncidentForm />
    </div>
  );
}
