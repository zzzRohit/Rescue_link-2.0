import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Rescuer from '../models/Rescuer.js';

const signToken = (user) => jwt.sign({
  id: user._id,
  role: user.role || 'rescuer',
  city: user.city,
  name: user.name
}, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialties, city, lat, lng } = req.body;

    if (role === 'rescuer') {
      if (!city && (typeof lat !== 'number' || typeof lng !== 'number')) {
        return res.status(400).json({ message: 'Enter a city or use your current location.' });
      }
      const rescuer = await Rescuer.create({
        name,
        email,
        password,
        phone,
        city: city ? String(city).toLowerCase().trim() : undefined,
        specialties: specialties?.length ? specialties : ['all'],
        lat: typeof lat === 'number' ? lat : undefined,
        lng: typeof lng === 'number' ? lng : undefined,
        type: 'platform',
        verified: false
      });

      return res.status(201).json({
        message: 'Your account is pending admin verification. You will be notified once approved.',
        rescuerId: rescuer._id,
        user: { ...rescuer.toJSON(), role: 'rescuer' }
      });
    }

    const user = await User.create({ name, email, password, role: 'citizen', phone });
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    if (err.code === 11000) err.status = 409;
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email).toLowerCase(), role: 'citizen' });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
};

export const rescuerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const rescuer = await Rescuer.findOne({ email: String(email).toLowerCase(), type: 'platform' });
    if (!rescuer || !(await rescuer.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!rescuer.verified) {
      return res.status(403).json({
        error: 'pending_verification',
        message: 'Your account is pending admin verification. You will be notified once approved.',
        rescuerId: rescuer._id
      });
    }

    res.json({ token: signToken({ ...rescuer.toObject(), role: 'rescuer' }), user: { ...rescuer.toJSON(), role: 'rescuer' } });
  } catch (err) {
    next(err);
  }
};

export const getMe = (req, res) => res.json({ user: req.user });

const verifyAdminKey = (req, res) => {
  if (!process.env.ADMIN_SECRET_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_SECRET_KEY) {
    res.status(403).json({ error: 'Invalid admin key' });
    return false;
  }
  return true;
};

export const checkAdminSession = (req, res) => {
  if (!verifyAdminKey(req, res)) return;
  res.json({ ok: true });
};

export const verifyRescuer = async (req, res, next) => {
  try {
    if (!verifyAdminKey(req, res)) return;
    const { rescuerId } = req.body;
    const rescuer = await Rescuer.findOneAndUpdate(
      { _id: rescuerId, type: 'platform' },
      { verified: true },
      { new: true }
    ).select('-password');
    if (!rescuer) return res.status(404).json({ error: 'Rescuer not found' });
    res.json({ message: 'Rescuer verified successfully', rescuer });
  } catch (err) {
    next(err);
  }
};

export const getPendingRescuers = async (req, res, next) => {
  try {
    const rescuers = await Rescuer.find({ type: 'platform', verified: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(rescuers);
  } catch (err) {
    next(err);
  }
};
