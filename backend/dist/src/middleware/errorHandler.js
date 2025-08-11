"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
// src/middleware/errorHandler.js
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(err.stack);
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    // Don't expose stack trace in production
    const response = Object.assign({ success: false, message }, (process.env.NODE_ENV === 'development' && { stack: err.stack }));
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
