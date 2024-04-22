// export { default as SocketService } from "./socketService";

import WebSocket, { WebSocketServer } from 'ws';
import WsService from './wsService';

let socketInstance: WebSocket;
let serverInstance: WebSocketServer;

export const start_ws = () => {
  const socketInit = new WsService();
  socketInstance = socketInit.ws;
  serverInstance = socketInit.wss;
};

export { socketInstance, serverInstance };
