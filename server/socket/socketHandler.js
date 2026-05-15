import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Rescuer from '../models/Rescuer.js';

export const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'rescuer') {
        const rescuer = await Rescuer.findById(decoded.id).select('-password');
        socket.user = rescuer ? { ...rescuer.toObject(), role: 'rescuer' } : null;
      } else {
        socket.user = await User.findById(decoded.id).select('-password');
      }
      next();
    } catch {
      next();
    }
  });

  io.on('connection', (socket) => {
    if (socket.user?.role === 'rescuer' && socket.user.city) socket.join(socket.user.city);
    if (socket.user?._id) socket.join(`user:${socket.user._id}`);
  });
};
