import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['citizen', 'rescuer'], required: true },
  phone: String,
  specialties: [{ type: String, enum: ['mammals', 'birds', 'reptiles', 'all'] }],
  city: { type: String, lowercase: true, trim: true },
  available: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },
  lat: Number,
  lng: Number
}, { timestamps: { createdAt: true, updatedAt: false } });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
