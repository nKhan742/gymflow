const LIVE_ATLAS_URI = 'mongodb+srv://nkhan742_db_user:neCCpZlBpsPABKF7@gymflow-cluster.ujl4tza.mongodb.net/gymflow_erp?retryWrites=true&w=majority';

export const databaseConfig = {
  uri: process.env.MONGODB_URI || LIVE_ATLAS_URI,
  debug: process.env.MONGODB_DEBUG === 'true',
  options: {
    autoIndex: true,
    maxPoolSize: 50,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  },
};
