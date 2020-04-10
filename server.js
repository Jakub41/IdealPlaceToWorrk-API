import express from 'express';
import Logger from './src/loaders/logger';
import Loaders from './src/loaders';

// Starting the server from loaders
async function startServer() {
  const app = express();
  try {
    // Await the loaders init the API
    await Loaders({ expressApp: app });
  } catch (err) {
    Logger.error(err);
  }
}

// Starting the server because i said so
startServer();
