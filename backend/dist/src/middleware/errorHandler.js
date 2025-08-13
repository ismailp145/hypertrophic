// src/middleware/errorHandler.js
import { logger } from '../utils/logger';
export const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    // Don't expose stack trace in production
    const response = Object.assign({ success: false, message }, (process.env.NODE_ENV === 'development' && { stack: err.stack }));
    res.status(statusCode).json(response);
};
// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
