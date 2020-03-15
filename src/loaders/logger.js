/* eslint-disable object-curly-newline */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
import winston from 'winston';
import moment from 'moment';
import { logger } from '../config';

const transports = [];

// For development in prod need to check for dev env
transports.push(new winston.transports.Console());

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
