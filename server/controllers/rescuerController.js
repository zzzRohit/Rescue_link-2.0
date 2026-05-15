import Rescuer from '../models/Rescuer.js';

const normalizeCity = (city) => {
  const cityNorm = String(city).toLowerCase().trim();
  const cityAliases = {
    bengaluru: 'bangalore',
    bengalore: 'bangalore',
    bombay: 'mumbai',
    'new delhi': 'delhi',
    madras: 'chennai',
    hyderabad: 'hyderabad',
    bengaluru: 'bangalore',
    mysuru: 'mysore',
    mangaluru: 'mangalore',
    shivamogga: 'shimoga',
    hubballi: 'hubli',
    ballari: 'bellary'
  };
  return cityAliases[cityNorm] || cityNorm;
};

export const getRescuers = async (req, res) => {
  try {
    const { city, specialty } = req.query;
    const query = { type: 'contact', verified: true };

    if (city) query.city = normalizeCity(city);
    if (specialty && specialty !== 'all') query.specialties = { $in: [specialty, 'all'] };

    const rescuers = await Rescuer.find(query)
      .select('name phone whatsapp specialties available24hr address lat lng city')
      .sort({ available24hr: -1, name: 1 });

    res.json(rescuers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCities = async (_req, res, next) => {
  try {
    const cities = await Rescuer.distinct('city', { type: 'contact', verified: true });
    res.json(cities);
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
