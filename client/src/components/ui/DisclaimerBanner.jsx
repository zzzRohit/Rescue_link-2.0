export const DisclaimerBanner = ({ children = 'This is AI analysis. A verified rescuer should make the final decision.' }) => (
  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{children}</div>
);
