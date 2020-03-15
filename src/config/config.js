// Config via env variables
// Here general config of the API based on the ENV
// and tools, 3rd parties or etc which requires env var
import dotenv from 'dotenv';
import Logger from '../loaders/logger';

// Check if env exists
const envFound = dotenv.config();
if (!envFound) {
  // This error should crash the whole process
  Logger.error("⚠️  Couldn't find .env file  ⚠️");
}

// Env for Dev/Prod
export const NODE_ENV = {
  env: process.env.NODE_ENV,
};

// API server
export const server = {
  port: process.env.PORT,
  prefix: process.env.API_URL,
};

// Logger
export const logger = {
  level: process.env.LOG_LEVEL,
};

// MongoDB
export const mongoUrl = {
  url: process.env.MONGO_URL,
};
