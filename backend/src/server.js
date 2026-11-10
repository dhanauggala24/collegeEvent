const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` College Event Portal Backend is running!`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Server URL:  http://localhost:${PORT}`);
      console.log(` Health:      http://localhost:${PORT}/api/health`);
      console.log(` Events API:  http://localhost:${PORT}/api/events`);
      console.log(`===============================================`);
    });

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      console.log(`\n[${signal}] Received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        await disconnectDB();
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('[Server] Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
