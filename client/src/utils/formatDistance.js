export const formatDistance = (meters) => {
  if (!Number.isFinite(meters)) return 'Distance unknown';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};
