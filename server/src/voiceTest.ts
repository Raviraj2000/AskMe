import WebSocket from 'ws';

// ✅ Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:3000/talk');
const mic = require('mic');

// ✅ Handle WebSocket connection
ws.on('open', () => {
  console.log('✅ Connected to WebSocket at /talk');

  // Start Microphone Capture
  const micInstance = mic({
    rate: '16000', // Audio sample rate
    channels: '1', // Single channel (Mono)
    debug: true,
    exitOnSilence: 6,
  });

  const micInputStream = micInstance.getAudioStream();

  // Send audio data via WebSocket
  micInputStream.on('data', (data: Buffer) => {
    console.log('🎙️ Sending audio data chunk to server:', data.length);

    ws.send(
      JSON.stringify({
        type: 'voice_input',
        data: data.toString('base64'), // Convert audio to base64
      })
    );
  });

  // Handle mic errors
  micInputStream.on('error', (err: Error) => {
    console.error('⚠️ Microphone error:', err);
  });

  // Start microphone
  micInstance.start();
  console.log('🎙️ Microphone started, sending audio data...');
});

// ✅ Handle incoming WebSocket messages
ws.on('message', (message: string) => {
  console.log('📩 Server Response:', message);
});

// ✅ Handle WebSocket errors
ws.on('error', (error) => {
  console.error('⚠️ WebSocket error:', error);
});

// ✅ Handle WebSocket close
ws.on('close', () => {
  console.log('❌ Connection closed');
  process.exit();
});

// ✅ Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
  console.log('🛑 Stopping microphone and closing WebSocket connection...');
  ws.close();
  process.exit();
});
