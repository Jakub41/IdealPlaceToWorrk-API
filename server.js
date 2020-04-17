import express from 'express';
import rookout from 'rookout';
import Logger from './src/loaders/logger';
import Loaders from './src/loaders';
import { rookOutToken } from './src/config';

// Starting the server from loaders
async function startServer() {
  // Init RookOut
  rookout.start({
    token: rookOutToken.token,
  });

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
