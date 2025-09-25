import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';

let ioInstance: Server;

export const initSockets = (server: HttpServer) => {
  ioInstance = new Server(server, {
    cors: { origin: config.frontendUrl || '*' }
  });

  ioInstance.on('connection', (socket: Socket) => {
    // optional auth: clients can send token for room joining
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const payload: any = jwt.verify(token, config.jwtSecret);
        const userId = payload.id;
        socket.join(`user:${userId}`); // each user gets a room
      } catch (err) {
        // ignore
      }
    }

    socket.on('joinTeam', (teamId) => {
      socket.join(`team:${teamId}`);
    });

    socket.on('disconnect', () => {});
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) throw new Error('Socket.io not initialized');
  return ioInstance;
};

// export for service imports (used above)
export const io = {
  to: (room: string) => ({ emit: (event: string, payload: any) => { if (ioInstance) ioInstance.to(room).emit(event, payload); } }),
  emit: (event: string, payload: any) => { if (ioInstance) ioInstance.emit(event, payload); }
} as any;
