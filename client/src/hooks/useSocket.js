import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (handlers = {}) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('rescuelink_token');
    const nextSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { auth: { token } });
    setSocket(nextSocket);
    if (handlers.newIncident) nextSocket.on('new_incident', handlers.newIncident);
    if (handlers.statusUpdated) nextSocket.on('status_updated', handlers.statusUpdated);
    return () => nextSocket.disconnect();
  }, []);

  return socket;
};
