/**
 * SkyLab Logger
 */
import { createLogger, Logger, transports } from 'winston';

const logPath = process.env.log_file_name || 'log.log';
// tslint:disable-next-line no-console
console.log('Log Path:', logPath);

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: logPath }),
  ],
});

export default logger;
