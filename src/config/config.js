// Config via env variables
// Here general config of the API based on the ENV
// and tools, 3rd parties or etc which requires env var
import dotenv from 'dotenv';

// Check if env exists
const envFound = dotenv.config();

class ValidationError extends Error {
  constructor(message) {
    super(message);
    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

if (envFound.error) {
  // Crash the entire app to notify of missing .env file

  // We cant use logger here because in the first place, process.env.LOG_LEVEL
  // is not defined since we don't have a .env at this point
  // Logger.error("⚠️  Couldn't find .env file  ⚠️");
  process.on('uncaughtException', (err) => {
    throw new Error(err);
  });
  throw new ValidationError("⚠️  Couldn't find .env file  ⚠️");
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

// Google API
export const googleApi = {
  key: process.env.API_KEY,
};

// JWT Password
export const jwtKey = {
  secretKey: process.env.TOKEN_PASSWORD,
};
