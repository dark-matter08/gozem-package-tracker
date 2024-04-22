import WebSocket, { WebSocketServer } from 'ws';
import { APPCONFIGS } from '../../configs';

export default class WsService {
  public wss: WebSocketServer;
  public ws: WebSocket;
  private activeTunnel: {};
  constructor() {
    this.activeTunnel = {};
    this.wss = new WebSocketServer({
      port: APPCONFIGS.WS_PORT,
    });
    console.log(
      '[🚀 ] - WS Socket Server Started on port:',
      APPCONFIGS.WS_PORT
    );
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('=============+> A user connected <+=');
      this.ws = ws;
      this.startSocketListeners();
    });
  }

  private startSocketListeners() {
    // Join room
    this.ws?.on('joinTunnel', (data) => {
      this.activeTunnel[data.tunnelId] = [
        ...(this.activeTunnel?.[data.tunnelId] || []),
        this.ws?.id,
      ];

      this.ws?.join(data.tunnelId);
      this.ws?.emit('connected', data);
    });

    // Handle disconnection
    this.ws?.on('disconnect', () => {
      // Loop through active rooms
      for (const roomId in this.activeTunnel) {
        if (Object.prototype.hasOwnProperty.call(this.activeTunnel, roomId)) {
          // Remove disconnected socket from activeRooms for each room
          this.activeTunnel[roomId] = this.activeTunnel[roomId].filter(
            (socketId) => socketId !== this.ws?.id
          );
        }
      }
    });

    this.ws?.on('location_changed', (data) => {
      const { tunnelId, location } = data;
      this.ws.send();
    });

    this.ws?.on('status_changed', (data) => {
      this.ws.emit('status_changed', { data });
    });

    this.ws?.on('delivery_updated', (data) => {
      this.ws.emit('delivery_updated', { data });
    });

    this.ws?.on('sendMessage-singleBroadcast', (data) => {
      const { roomId, message } = data;
      const roomSockets = this.activeTunnel[roomId] || [];

      // Iterate over each socket ID in the room and send the message individually
      roomSockets.forEach((socketId) => {
        this.ws.to(socketId).emit('newMessage', { roomId, message });
      });
    });
  }
}
