import { Server, Socket } from 'socket.io';
import http from 'http';
import { DeliveryService } from '../../services';
import { APPCONFIGS } from '../../configs';

export default class SocketService {
  public socket: Socket | null;
  private activeTunnels: {};
  public io: Server;
  public server: http.Server;
  private deliveryService: DeliveryService;
  constructor(app: Express.Application) {
    this.deliveryService = new DeliveryService();
    this.server = http.createServer(app);
    this.io = new Server(this.server, { cors: { origin: '*' } });
    this.socket = null;
    this.activeTunnels = {};
    console.log('[🚀 ] - Socket Server Started on port:', APPCONFIGS.PORT);

    this.io.on('connection', (socket: Socket) => {
      console.log('=============+> A user connected ==> normal socket <+=');
      this.socket = socket;
      this.startSocketListeners();
    });
  }

  private startSocketListeners() {
    // Join room
    this.socket?.on('joinTunnel', (data) => {
      this.activeTunnels[data.tunnelId] = [
        ...(this.activeTunnels?.[data.tunnelId] || []),
        this.socket?.id,
      ];

      this.socket?.join(data.tunnelId);
      this.socket?.emit('connected', data);
      console.log('========== [Tunnel Joined] ==============');
      console.log(this.activeTunnels);
    });

    // Handle disconnection
    this.socket?.on('disconnect', () => {
      // Loop through active tunnels
      for (const tunnelId in this.activeTunnels) {
        if (
          Object.prototype.hasOwnProperty.call(this.activeTunnels, tunnelId)
        ) {
          // Remove disconnected socket from activeTunnels for each room
          this.activeTunnels[tunnelId] = this.activeTunnels[tunnelId].filter(
            (socketId: string) => socketId !== this.socket?.id
          );
        }
      }
    });

    this.socket?.on('delivery_updated', (data) => {
      const { tunnelId, location, status } = data;
      console.log('======> getting new delivery data: ', data);

      const tunnelSockets = this.activeTunnels[tunnelId] || [];

      console.log('=======> Broadcasting to Sockets: ', tunnelSockets);
      tunnelSockets.forEach(async (socketId: string) => {
        if (location) {
          await this.deliveryService.updateDelivery(tunnelId, { location });
          this.io.to(socketId).emit('location_changed', { tunnelId, location });
        }
        if (status) {
          const updatedDelivery = await this.deliveryService.updateDelivery(
            tunnelId,
            { status }
          );

          this.io.to(socketId).emit('status_changed', {
            tunnelId,
            status,
            delivery: updatedDelivery.data,
          });
        }
      });
    });
  }
}
