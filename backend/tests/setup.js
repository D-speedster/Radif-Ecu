const mongoose = require('mongoose');

let originalConnection;

// Setup before all tests
beforeAll(async () => {
  // Use test database URL or fallback to memory-style DB name
  const mongoUri = process.env.TEST_MONGODB_URL || process.env.MONGODB_URL?.replace(/\/[^/]*$/, '/test-db') || 'mongodb://localhost:27017/test-db';
  
  // Store original connection to restore later
  originalConnection = mongoose.connection.readyState;
  
  // Disconnect if already connected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  await mongoose.connect(mongoUri);
});

// Cleanup after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
});