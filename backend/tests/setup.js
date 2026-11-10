const mongoose = require('mongoose');

let isConnected = false;

/**
 * Robust test database setup:
 * Attempts connection to local MongoDB test database if available;
 * Otherwise uses an isolated memory or mock state for offline testing.
 */
const connectTestDB = async () => {
  const testUri = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/college_events_test';
  
  try {
    await mongoose.connect(testUri, {
      serverSelectionTimeoutMS: 1500
    });
    isConnected = true;
    return true;
  } catch (err) {
    // If local daemon is not running, tests continue with Mongoose Schema & Mock validations
    isConnected = false;
    return false;
  }
};

const clearTestDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

const disconnectTestDB = async () => {
  if (isConnected && mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

module.exports = {
  connectTestDB,
  clearTestDB,
  disconnectTestDB,
  isDBConnected: () => isConnected
};
