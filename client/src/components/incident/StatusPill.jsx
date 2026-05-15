const classes = {
  pending: 'bg-gray-100 text-gray-500',
  accepted: 'bg-blue-50 text-blue-600',
  on_the_way: 'bg-amber-50 text-amber-600',
  rescued: 'bg-green-50 text-green-600',
  closed: 'bg-green-50 text-green-800'
};

export const StatusPill = ({ status }) => (
  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${classes[status] || classes.pending}`}>
    {String(status || 'pending').replaceAll('_', ' ')}
  </span>
);
