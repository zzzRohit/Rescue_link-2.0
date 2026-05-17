import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { Spinner } from '../ui/Spinner';
import { SeverityBadge } from '../incident/SeverityBadge';

export const AIAnalysisPanel = ({ analysis, loading }) => {
  if (loading) return <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><Spinner /></div>;
  if (!analysis) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="font-medium">AI analysis unavailable</h3>
        <p className="mt-2 text-sm text-gray-500">The animal rescue incident was saved and responders can still review it.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium">AI emergency analysis</h3>
        <SeverityBadge severity={analysis.severity} />
      </div>
      <p className="mt-3 text-sm text-gray-600">Priority: <span className="font-medium capitalize">{analysis.rescuePriority?.replaceAll('_', ' ')}</span></p>
      {analysis.dangerWarnings?.length > 0 && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {analysis.dangerWarnings.map((warning) => <p key={warning}>{warning}</p>)}
        </div>
      )}
      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        {analysis.firstAidSteps?.map((step) => <li key={step}>• {step}</li>)}
      </ul>
      <div className="mt-4"><DisclaimerBanner>This is AI analysis. Follow the selected rescue route and contact trained support for urgent cases.</DisclaimerBanner></div>
    </div>
  );
};
