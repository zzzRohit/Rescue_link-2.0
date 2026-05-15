import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './socket/socketHandler.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
].filter(Boolean);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true }
});

initSocket(io);
app.set('io', io);

connectDB().then(() => {
  server.listen(port, () => console.log(`RescueLink API running on ${port}`));
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Set PORT to another value or stop the process using that port.`);
    process.exit(1);
  }
  throw error;
});
