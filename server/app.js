import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import incidentRoutes from './routes/incidents.js';
import rescuerRoutes from './routes/rescuers.js';
import uploadRoutes from './routes/uploads.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '12mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/rescuers', rescuerRoutes);
app.use('/api/uploads', uploadRoutes);
app.use(errorHandler);

export default app;
