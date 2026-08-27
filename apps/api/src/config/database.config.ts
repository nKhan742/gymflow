export const databaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gymflow_erp',
  debug: process.env.MONGODB_DEBUG === 'true',
  options: {
    autoIndex: true,
    maxPoolSize: 50,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};
