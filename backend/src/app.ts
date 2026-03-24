import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';
import { setupSocketHandlers } from './stream/socketHandler';
import dashboardRoutes from './routes/dashboard';
import reportsRoutes from './routes/reports';
import settingsRoutes from './routes/settings';

// Load environment variables
dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Reports routes
app.use('/api/reports', reportsRoutes);

// Settings routes
app.use('/api/settings', settingsRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Setup Socket.io handlers
setupSocketHandlers(io);

// Helper functions
function getDefaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export { app, httpServer, io };
