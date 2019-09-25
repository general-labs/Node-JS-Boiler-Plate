/**
 * SkyLab Logger
 */

import logger from '../boot/logger';
const logHandler = (req, res, next) => {
  logger.log({
    level: 'info',
    message: `Current Path: ${req.originalUrl}`,
  });
  next();
};

export default logHandler;
