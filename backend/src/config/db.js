const mongoose = require('mongoose');

/**
 * Connect to MongoDB with resilient options and event handlers
 */
const connectDB = async (customUri = null) => {
  const uri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_events';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      // In production/dev, exit process on initial connection failure
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Disconnect from MongoDB (useful for tests and graceful shutdown)
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed.');
  } catch (error) {
    console.error(`[MongoDB] Error closing connection: ${error.message}`);
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('[MongoDB] Disconnected from server');
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to server');
});

module.exports = { connectDB, disconnectDB };
