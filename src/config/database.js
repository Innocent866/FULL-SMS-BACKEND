import mongoose from 'mongoose';
import config from './index.js';
import logger from '../utils/logger.js';

const connectDatabase = async () => {
  const mongoUri = config.mongoUri;
  try {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error({ err: error, mongoUri }, 'Failed to connect to MongoDB');
    throw error;
  }
};

export default connectDatabase;
