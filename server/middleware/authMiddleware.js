import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Rescuer from '../models/Rescuer.js';

const findAuthUser = async (decoded) => {
  if (decoded.role === 'rescuer') {
    const rescuer = await Rescuer.findById(decoded.id).select('-password');
    return rescuer ? { ...rescuer.toObject(), role: 'rescuer' } : null;
  }
  const user = await User.findById(decoded.id).select('-password');
  return user ? { ...user.toObject(), role: user.role } : null;
};

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findAuthUser(decoded);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const optionalAuth = async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await findAuthUser(decoded);
  } catch {
    req.user = null;
  }
  next();
};

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) return res.status(403).json({ message: 'Access denied' });
  next();
};

export const requireVerifiedRescuer = async (req, res, next) => {
  try {
    if (req.user?.role !== 'rescuer') return res.status(403).json({ error: 'Not a rescuer account' });

    const rescuer = await Rescuer.findById(req.user._id || req.user.id);
    if (!rescuer) return res.status(404).json({ error: 'Rescuer not found' });
    if (!rescuer.verified) {
      return res.status(403).json({
        error: 'pending_verification',
        message: 'Your account is pending admin verification. You will be notified once approved.'
      });
    }

    req.rescuer = rescuer;
    next();
  } catch (err) {
    next(err);
  }
};
