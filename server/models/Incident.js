import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema({
  severity: { type: String, enum: ['critical', 'moderate', 'low'] },
  rescuePriority: { type: String, enum: ['immediate', 'within_2hrs', 'non_urgent'] },
  dangerWarnings: [String],
  firstAidSteps: [String],
  rawResponse: String
}, { _id: false });

const authorityContactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  type: { type: String, enum: ['government', 'ngo', 'emergency'] },
  coverage: String
}, { _id: false });

const incidentSchema = new mongoose.Schema({
  animalType: { type: String, required: true, trim: true },
  emergencyCategory: {
    type: String,
    required: true,
    enum: ['injured', 'trapped', 'orphaned', 'road_accident', 'bleeding', 'abandoned', 'dangerous_sighting']
  },
  description: { type: String, required: true, minlength: 20 },
  images: [String],
  location: {
    address: String,
    city: { type: String, lowercase: true, trim: true },
    lat: Number,
    lng: Number
  },
  reportedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    phone: String
  },
  aiAnalysis: aiAnalysisSchema,
  assignedRescuer: { type: mongoose.Schema.Types.ObjectId, ref: 'Rescuer' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'on_the_way', 'rescued', 'closed'],
    default: 'pending'
  },
  rescueProofImage: String,
  rescuerNotes: String,
  routingType: { type: String, enum: ['local', 'authority'], default: 'local' },
  authorityContacts: [authorityContactSchema],
  source: { type: String, enum: ['full_report', 'quick_report'], default: 'full_report' }
}, { timestamps: true });

export default mongoose.model('Incident', incidentSchema);
