/* eslint-disable object-curly-newline */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
// Logger
// This logger is used to show error/info messages about the status of the API
import winston from 'winston';
import moment from 'moment';
import { logger, NODE_ENV } from '../config';

const transports = [];

// For development in prod need to check for dev env
// in dev we want more info error tracking
// in prod essential info error message
if (NODE_ENV.env !== 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
} else {
  transports.push(new winston.transports.Console());
}

// Parse meta keys
const parser = string => {
  if (!string) {
    return '';
  }
  if (typeof string === 'string') {
    return string;
  }
  return Object.keys(string).length ? JSON.stringify(string, undefined, 2) : '';
};

// Logger instance
const LoggerInstance = winston.createLogger({
  level: logger.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(info => {
      const { timestamp, level, message, meta } = info;
      const ts = moment(timestamp)
        .local()
        .format('YYYY-MM-DD HH:MM:ss');
      const metaMsg = meta ? `: ${parser(meta)}` : '';
      return `${ts} [${level}] ${parser(message)} ${metaMsg}`;
    })
  ),
  transports,
});

export default LoggerInstance;
