// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/websocket';

const app: Application = express();

// Middleware
app.use(cors());        // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api', routes); // Register all routes under /api

// Root Route (for sanity check)
app.get('/', (req, res) => {
  res.send('Hello from TypeScript + Express!');
});

export default app;
