import Incident from '../models/Incident.js';
import Rescuer from '../models/Rescuer.js';
import { analyzeIncident } from '../services/aiService.js';
import { findNearestRescuer } from '../services/matchRescuer.js';

const statusOrder = ['pending', 'accepted', 'on_the_way', 'rescued', 'closed'];
const validCloudinaryUrls = (urls = []) => urls.every((url) => /^https:\/\/res\.cloudinary\.com\//.test(url));

export const createIncident = async (req, res, next) => {
  try {
    const { animalType, emergencyCategory, description, images = [], location = {}, reportedBy = {} } = req.body;
    if (!validCloudinaryUrls(images)) return res.status(400).json({ message: 'Invalid image URL' });

    const incident = await Incident.create({
      animalType,
      emergencyCategory,
      description,
      images,
      location: { ...location, city: location.city?.toLowerCase() },
      reportedBy: { ...reportedBy, userId: req.user?._id }
    });

    try {
      incident.aiAnalysis = await analyzeIncident({ animalType, emergencyCategory, description, imageUrls: images });
    } catch {
      incident.aiAnalysis = undefined;
    }

    const rescuer = await findNearestRescuer(incident);
    if (rescuer) incident.assignedRescuer = rescuer._id;
    await incident.save();
    await incident.populate('assignedRescuer', 'name phone specialties city');

    req.app.get('io')?.to(incident.location?.city || '').emit('new_incident', {
      incidentId: incident._id,
      animalType: incident.animalType,
      emergencyCategory: incident.emergencyCategory,
      severity: incident.aiAnalysis?.severity || 'moderate',
      address: incident.location?.address,
      assignedRescuerId: incident.assignedRescuer?._id
    });

    res.status(201).json(incident);
  } catch (err) {
    next(err);
  }
};

export const createQuickIncident = async (req, res, next) => {
  try {
    const { animalType, emergencyCategory, location = {}, imageUrl, phone } = req.body;

    const incident = await Incident.create({
      animalType,
      emergencyCategory,
      description: 'Quick report - no additional details provided',
      images: imageUrl ? [imageUrl] : [],
      location: { ...location, city: location.city?.toLowerCase() },
      reportedBy: { phone, userId: req.user?._id },
      source: 'quick_report'
    });

    const rescuer = await findNearestRescuer(incident);
    if (rescuer) incident.assignedRescuer = rescuer._id;
    await incident.save();

    req.app.get('io')?.to(incident.location?.city || '').emit('new_incident', {
      incidentId: incident._id,
      animalType: incident.animalType,
      emergencyCategory: incident.emergencyCategory,
      severity: 'moderate',
      address: incident.location?.address,
      source: 'quick_report',
      assignedRescuerId: incident.assignedRescuer
    });

    res.status(201).json({ incidentId: incident._id, message: 'Report received' });
  } catch (err) {
    next(err);
  }
};

export const getIncidents = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const query = {};
    if (req.user?.role === 'rescuer') query['location.city'] = req.user.city;
    if (req.user?.role === 'citizen') {
      if (req.query.userId && String(req.query.userId) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      query['reportedBy.userId'] = req.user._id;
    }
    const incidents = await Incident.find(query).populate('assignedRescuer', 'name phone specialties city').sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    next(err);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('assignedRescuer', 'name phone specialties city');
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    const nearbyRescuers = incident.location?.city
      ? await Rescuer.find({
        city: incident.location.city,
        type: 'contact',
        verified: true
      }).select('name phone whatsapp specialties available24hr address lat lng').limit(5)
      : [];
    res.json({ incident, nearbyRescuers });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('assignedRescuer', 'name');
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    if (incident.assignedRescuer && String(incident.assignedRescuer._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only assigned rescuer can update status' });
    }
    const nextIndex = statusOrder.indexOf(req.body.status);
    const currentIndex = statusOrder.indexOf(incident.status);
    if (nextIndex !== currentIndex + 1) return res.status(400).json({ message: 'Status must move forward one step' });
    incident.status = req.body.status;
    incident.rescuerNotes = req.body.rescuerNotes ?? incident.rescuerNotes;
    incident.rescueProofImage = req.body.rescueProofImage ?? incident.rescueProofImage;
    if (!incident.assignedRescuer) incident.assignedRescuer = req.user._id;
    await incident.save();
    if (incident.reportedBy?.userId) {
      req.app.get('io')?.to(`user:${incident.reportedBy.userId}`).emit('status_updated', {
        incidentId: incident._id,
        status: incident.status,
        rescuerName: req.user.name
      });
    }
    res.json(incident);
  } catch (err) {
    next(err);
  }
};

export const getStats = async (_req, res, next) => {
  try {
    const [total, resolved, active, cities] = await Promise.all([
      Incident.countDocuments(),
      Incident.countDocuments({ status: { $in: ['rescued', 'closed'] } }),
      Incident.countDocuments({ status: { $nin: ['rescued', 'closed'] } }),
      Incident.distinct('location.city')
    ]);
    res.json({ total, resolved, active, cities: cities.filter(Boolean).length });
  } catch (err) {
    next(err);
  }
};
