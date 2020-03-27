/* eslint-disable object-curly-newline */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
// Logger
// This logger is used to show error/info messages about the status of the API
import winston from 'winston';
import moment from 'moment';
// import logSymbols from 'log-symbols';
import fs from 'fs-extra';
import { logger, NODE_ENV } from '../config';
import { LogColor, LogIcon } from '../helpers';

const transports = [];
const dir = './logs';

// Creating the logs dir if does not exist
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// For development in prod need to check for dev env
// in dev we want more info error tracking
// in prod essential info error message
if (NODE_ENV.env !== 'development') {
  transports.push(
    new winston.transports.Console(),
    new winston.transports.File({
      level: logger.level,
      prettyPrint: true,
      silent: false,
      timestamp: true,
      json: false,
      filename: `${dir}/logs.log`,
    }),
  );
} else {
  transports.push(new winston.transports.Console());
}

// Creates the logs
class Logger {
  constructor(route) {
    this.log_data = null;
    this.route = route;
    const loggerInit = winston.createLogger({
      transports,
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { timestamp } = info;
          const ts = moment(timestamp).local().format('LL dddd HH:MM:ss');
          let message = `${ts} | ${LogColor(info)} | ${LogIcon(info)} ${
            info.message
          } `;
          message = info.obj
            ? `${message}data:${JSON.stringify(info.obj)} | `
            : message;
          message = this.log_data
            ? `${message}log_data:${JSON.stringify(this.log_data)} | `
            : message;
          return message;
        }),
      ),
    });
    this.logger = loggerInit;
  }

  setLogData(logData) {
    this.log_data = logData;
  }

  async info(message, obj) {
    this.logger.log('info', `${message} ${obj || ''}`);
  }

  async debug(message, obj) {
    this.logger.log('debug', `${message} ${obj || ''}`);
  }

  async error(message, obj) {
    this.logger.log('error', `${message} ${obj || ''}`);
  }
}

export default new Logger();
