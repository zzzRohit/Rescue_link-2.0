import Rescuer from '../models/Rescuer.js';
import { serviceAreaCities } from '../utils/city.js';

const animalSpecialty = (animalType = '') => {
  const lower = animalType.toLowerCase();
  if (['dog', 'puppy'].some((x) => lower.includes(x))) return 'dogs';
  if (['cat', 'kitten'].some((x) => lower.includes(x))) return 'cats';
  if (['cow', 'cattle', 'buffalo', 'bull', 'calf', 'goat', 'sheep'].some((x) => lower.includes(x))) return 'cattle';
  if (['rabbit', 'hamster', 'guinea pig'].some((x) => lower.includes(x))) return 'small_pets';
  if (['snake', 'monitor lizard', 'lizard', 'turtle', 'tortoise'].some((x) => lower.includes(x))) return 'reptiles';
  if (['pigeon', 'crow', 'owl', 'bird', 'peacock', 'kite', 'parrot'].some((x) => lower.includes(x))) return 'birds';
  if (['monkey', 'langur'].some((x) => lower.includes(x))) return 'primates';
  if (lower.includes('bat')) return 'bats';
  if (['deer', 'mongoose', 'squirrel'].some((x) => lower.includes(x))) return 'wildlife';
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
  const specialty = animalSpecialty(incident.animalType);
  const broadMammalSpecialties = ['dogs', 'cats', 'cattle', 'small_pets', 'primates', 'bats', 'wildlife', 'mammals'];
  const specialtyQuery = [{ specialties: specialty }, { specialties: 'all' }];
  if (broadMammalSpecialties.includes(specialty)) specialtyQuery.splice(1, 0, { specialties: 'mammals' });
  const query = {
    type: 'platform',
    available: true,
    verified: true,
    $or: specialtyQuery
  };
  if (city) query.city = { $in: serviceAreaCities(city) };
  if (!city && (typeof incident.location?.lat !== 'number' || typeof incident.location?.lng !== 'number')) return null;

  const rescuers = await Rescuer.find(query).select('-password');

  return rescuers
    .map((rescuer) => ({
      rescuer,
      distance: distanceKm(incident.location?.lat, incident.location?.lng, rescuer.lat, rescuer.lng)
    }))
    .filter((item) => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance)[0]?.rescuer || null;
};
