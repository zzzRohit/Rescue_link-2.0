import { severityClass } from '../../utils/severityColor';

export const SeverityBadge = ({ severity }) => (
  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${severityClass(severity)}`}>{severity || 'unavailable'}</span>
);
