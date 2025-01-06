// src/services/websocket.service.ts
import { WebSocket } from 'ws';
import { processVoiceInput } from './transcribe.service';
// import { handleIntent } from './intent.service';

interface Message {
  type: string;
  data?: any;
}

const activeConnections = new Set<WebSocket>();

export function handleWebSocketConnection(ws: WebSocket) {
  console.log('🔗 New WebSocket connection established');
  activeConnections.add(ws);

  ws.on('message', async (message: string) => {
    try {
      const parsed: Message = JSON.parse(message);
      await handleIncomingMessage(ws, parsed);
    } catch (error) {
      console.error('⚠️ Error processing message:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('❌ WebSocket connection closed');
    activeConnections.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('⚠️ WebSocket Error:', error);
    activeConnections.delete(ws);
  });
}

async function handleIncomingMessage(ws: WebSocket, message: Message) {
  switch (message.type) {
    case 'voice_input':
      const transcription = await processVoiceInput(message.data);
      ws.send(JSON.stringify({ type: 'transcription', data: transcription }));
      break;

    case 'ping':
      ws.send(JSON.stringify({ type: 'pong' }));
      break;

    default:
      ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
  }
}
