import { Server, Socket } from 'socket.io';
import http from 'http';

export default class SocketService {
  public socket: Socket | null;
  private activeTunnel: {};
  public io: Server;
  public server: http.Server;
  constructor(app: Express.Application) {
    this.server = http.createServer(app);
    this.io = new Server(this.server, { cors: { origin: '*' } });
    this.socket = null;
    this.activeTunnel = {};
    console.log('[🚀 ] - Socket Server Started ');

    this.io.on('connection', (socket: Socket) => {
      console.log('=============+> A user connected ==> normal socket <+=');
      this.socket = socket;
      this.startSocketListeners();
    });
  }

  private startSocketListeners() {
    // Join room
    this.socket?.on('joinTunnel', (data) => {
      this.activeTunnel[data.tunnelId] = [
        ...(this.activeTunnel?.[data.tunnelId] || []),
        this.socket?.id,
      ];

      this.socket?.join(data.tunnelId);
      this.socket?.emit('connected', data);
      console.log('========== [Tunnel Joined] ==============');
      console.log(this.activeTunnel);
    });

    // Handle disconnection
    this.socket?.on('disconnect', () => {
      // Loop through active rooms
      for (const roomId in this.activeTunnel) {
        if (Object.prototype.hasOwnProperty.call(this.activeTunnel, roomId)) {
          // Remove disconnected socket from activeRooms for each room
          this.activeTunnel[roomId] = this.activeTunnel[roomId].filter(
            (socketId) => socketId !== this.socket?.id
          );
        }
      }
    });

    this.socket?.on('delivery_updated', (data) => {
      const { tunnelId, location, status } = data;
      console.log('======> getting new location data: ', data);
      const tunnelSockets = this.activeTunnel[tunnelId] || [];
      tunnelSockets.forEach((socketId) => {
        if (location) {
          this.io.to(socketId).emit('location_changed', { tunnelId, location });
        }
        if (status) {
          this.io.to(socketId).emit('status_changed', { tunnelId, status });
        }
      });
    });

    this.socket?.on('status_changed', (data) => {
      this.io.emit('status_changed', { data });
    });

    this.socket?.on('delivery_updated', (data) => {
      this.io.emit('delivery_updated', { data });
    });
  }
}
