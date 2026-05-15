import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { SeverityBadge } from '../components/incident/SeverityBadge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export default function IncidentConfirmation() {
  const { id } = useParams();
  const { state } = useLocation();
  const [incident, setIncident] = useState(state?.incident || null);
  const [nearbyRescuers, setNearbyRescuers] = useState(state?.nearbyRescuers || []);

  useEffect(() => {
    api.get(`/api/incidents/${id}`).then((res) => {
      setIncident(res.data.incident || res.data);
      setNearbyRescuers(res.data.nearbyRescuers || []);
    });
  }, [id]);

  if (!incident) return null;
  const aiAnalysis = incident.aiAnalysis;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
            ✓
          </div>
          <h1 className="text-lg font-medium">Your report has been received</h1>
        </div>
        <p className="text-sm text-gray-400">Incident ID: {incident._id}</p>
        <p className="text-sm text-gray-500 mt-2">Save this link to track your report.</p>
      </div>

      {aiAnalysis ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">AI Emergency Analysis</h2>
            <SeverityBadge severity={aiAnalysis.severity} />
          </div>

          <div className="flex gap-2 mb-4">
            <span className="text-xs text-gray-500">Rescue priority:</span>
            <span className="text-xs font-medium text-green-600">{aiAnalysis.rescuePriority?.replace('_', ' ')}</span>
          </div>

          {aiAnalysis.dangerWarnings?.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-red-600 mb-1">Danger warnings</p>
              {aiAnalysis.dangerWarnings.map((warning, i) => <p key={i} className="text-xs text-red-500">{warning}</p>)}
            </div>
          )}

          <div className="mb-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Immediate first-aid steps:</p>
            <ol className="space-y-1">
              {aiAnalysis.firstAidSteps?.map((step, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-green-400 font-medium shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded px-3 py-2">
            This is AI guidance. For serious injuries, please contact a wildlife rescuer immediately.
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-4">
          <p className="text-sm font-medium text-gray-600">AI analysis unavailable</p>
          <p className="text-sm text-gray-400 mt-1">The incident was saved and rescuers can still respond.</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <h2 className="font-medium mb-4">Rescuers near you - call directly</h2>
        {nearbyRescuers.length === 0 ? (
          <p className="text-sm text-gray-400">No local rescuers found. Try a national helpline.</p>
        ) : (
          <div className="space-y-3">
            {nearbyRescuers.map((rescuer) => (
              <div key={rescuer._id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium">{rescuer.name}</p>
                  <p className="text-xs text-gray-400">{rescuer.address} · {rescuer.available24hr ? '24hr' : 'Day hours'}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {rescuer.specialties?.map((specialty) => (
                      <span key={specialty} className="text-xs bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full">{specialty}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4 shrink-0">
                  <a href={`tel:${rescuer.phone}`} className="text-xs bg-green-600 text-green-50 px-3 py-1.5 rounded-lg text-center font-medium">
                    Call
                  </a>
                  {rescuer.whatsapp && (
                    <a href={`https://wa.me/${rescuer.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-center text-gray-600">
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to={`/incident/${incident._id}`}><Button>Track this incident</Button></Link>
        <Link to="/register"><Button variant="secondary">Create an account to track reports</Button></Link>
      </div>
    </div>
  );
}
