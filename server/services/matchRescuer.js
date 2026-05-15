import Rescuer from '../models/Rescuer.js';

const animalSpecialty = (animalType = '') => {
  const lower = animalType.toLowerCase();
  if (['snake', 'monitor lizard'].some((x) => lower.includes(x))) return 'reptiles';
  if (['pigeon', 'crow', 'owl'].some((x) => lower.includes(x))) return 'birds';
  return 'mammals';
};

const distanceKm = (aLat, aLng, bLat, bLng) => {
  if ([aLat, aLng, bLat, bLng].some((v) => typeof v !== 'number')) return Number.POSITIVE_INFINITY;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earth = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.asin(Math.sqrt(h));
};

export const findNearestRescuer = async (incident) => {
  const city = incident.location?.city;
  if (!city) return null;
  const specialty = animalSpecialty(incident.animalType);
  const rescuers = await Rescuer.find({
    type: 'platform',
    city,
    available: true,
    verified: true,
    $or: [{ specialties: specialty }, { specialties: 'all' }]
  }).select('-password');

  return rescuers
    .map((rescuer) => ({
      rescuer,
      distance: distanceKm(incident.location?.lat, incident.location?.lng, rescuer.lat, rescuer.lng)
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.rescuer || null;
};
