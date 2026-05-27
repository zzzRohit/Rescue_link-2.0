import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const RescuerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  city: { type: String, lowercase: true, trim: true },
  specialties: {
    type: [String],
    enum: ['dogs', 'cats', 'cattle', 'small_pets', 'birds', 'reptiles', 'wildlife', 'primates', 'bats', 'mammals', 'all'],
    default: ['all']
  },
  available24hr: { type: Boolean, default: false },
  lat: { type: Number },
  lng: { type: Number },
  address: { type: String },
  type: { type: String, enum: ['contact', 'platform'], default: 'contact' },
  verified: { type: Boolean, default: false },

  email: { type: String, lowercase: true, sparse: true },
  password: { type: String },
  available: { type: Boolean, default: true }
}, { timestamps: true });

RescuerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

RescuerSchema.methods.matchPassword = async function matchPassword(entered) {
  return bcrypt.compare(entered, this.password);
};

RescuerSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Rescuer', RescuerSchema);
