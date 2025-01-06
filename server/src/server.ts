import 'dotenv/config';
import http from 'http';
import app from './app';
import { setupWebSocket } from './routes/websocket';

const PORT = process.env.PORT || 3000;

// Create an HTTP server
const server = http.createServer(app);

// Setup WebSocket on /talk
setupWebSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`💬 WebSocket available at ws://localhost:${PORT}/talk`);
});