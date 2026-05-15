export const severityClass = (severity = 'low') => ({
  critical: 'bg-red-50 text-red-600 border border-red-200',
  moderate: 'bg-amber-50 text-amber-600 border border-amber-200',
  low: 'bg-green-50 text-green-600 border border-green-200'
}[severity] || 'bg-green-50 text-green-600 border border-green-200');
