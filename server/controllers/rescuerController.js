import Rescuer from '../models/Rescuer.js';
import { normalizeCity, serviceAreaCities } from '../utils/city.js';

export const getRescuers = async (req, res) => {
  try {
    const { city, specialty } = req.query;
    const query = { verified: true };

    if (city) query.city = { $in: serviceAreaCities(city) };
    if (specialty && specialty !== 'all') query.specialties = { $in: [specialty, 'all'] };

    const rescuers = await Rescuer.find(query)
      .select('name phone whatsapp specialties available24hr address lat lng city')
      .sort({ available24hr: -1, name: 1 });

    res.json(rescuers.map((rescuer) => {
      const item = rescuer.toObject();
      return { ...item, address: item.address || item.city || 'Local rescuer' };
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCities = async (_req, res, next) => {
  try {
    const cities = await Rescuer.distinct('city', { verified: true });
    res.json([...new Set(cities.filter(Boolean).map(normalizeCity))]);
  } catch (err) {
    next(err);
  }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const rescuer = await Rescuer.findById(req.user._id || req.user.id);
    if (!rescuer) return res.status(404).json({ error: 'Rescuer not found' });
    rescuer.available = Boolean(req.body.available);
    await rescuer.save();
    res.json({ available: rescuer.available });
  } catch (err) {
    next(err);
  }
};
