/* eslint-disable arrow-parens */
// Express loader
// Here are loaded all the express instances
import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import compression from 'compression';
import passport from 'passport';

import swaggerUi from 'swagger-ui-express';
import routes from '../routes';
import { server } from '../config';
import Logger from './logger';

import swaggerDocument from '../../swagger.json';

// Morgan doesn't work with import do not change to import
// API requests logger
const morgan = require('morgan');

// const app = express();
export default async ({ app }) => {
  // Health Check endpoint
  app.get(`${server.prefix}status`, (req, res) => {
    res.status(200).json('🔥🔥 Server is running 🔥🔥').end();
  });

  app.head(`${server.prefix}status`, (req, res) => {
    res.status(200).end();
  });

  // Swagger Docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json());

  // Logs API requests
  app.use(morgan('dev'));

  // Load API routes
  app.use(server.prefix, routes());

  // Endpoints list
  // eslint-disable-next-line no-console
  console.log(listEndpoints(app));

  // Compression
  app.use(compression());

  // Passport initialization
  app.use(passport.initialize());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // catch 401 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Unauthorized');
    err.status = 401;
    Logger.error('Unauthorized');
    next(err);
  });

  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
    next();
  });

  // Server listen
  app.listen(server.port || 3000, (err) => {
    // If any error before the server loader will show the message
    if (err) {
      Logger.error(err);
      process.exit(1);
    }
    Logger.info(`
  \n
      ################################################
        🛡️ Server listening on port: ${server.port} 🛡️
        ⚔️ Team Alpha  👨🏽‍💻👩‍💻👩🏽‍💻👨‍💻👨🏻‍💻 ⚔️ 
      ################################################
    `);
  });
};
