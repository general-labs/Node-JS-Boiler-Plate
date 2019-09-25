/**
 * SkyLab Error Handler
 */

export default function errorHandler(err, req, res, next) {
  res.status(500).json({ status: 500, message: `${err}` });
  // next();
}
