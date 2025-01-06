// src/routes/websocket.ts
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { handleWebSocketConnection } from '../services/websocket.service';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  // Listen for new connections
  wss.on('connection', (ws: WebSocket) => {
    console.log('🔗 Client connected to WebSocket');
    handleWebSocketConnection(ws); // Delegate to service for message handling
  });

  // Handle HTTP Upgrade to WebSocket
  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/talk') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  console.log('✅ WebSocket server attached to /talk');
}