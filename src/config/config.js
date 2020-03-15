// Config via env variables
import dotenv from 'dotenv';
import Logger from '../loaders/logger';

// Check if env exists
const envFound = dotenv.config();
if (!envFound) {
  // This error should crash the whole process
  Logger.error("⚠️  Couldn't find .env file  ⚠️");
}

// API server
export const server = {
  port: process.env.PORT,
  prefix: process.env.API_URL,
};

// GitHub
export const gitHub = {
  baseUrl: process.env.GITHUB_URL,
  token: process.env.GITHUB_TOKEN,
};

// Logger
export const logger = {
  level: process.env.LOG_LEVEL,
};
