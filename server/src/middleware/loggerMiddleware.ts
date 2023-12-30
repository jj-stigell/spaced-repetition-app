import { RequestHandler } from 'express';
import morgan from 'morgan';

import logger from '../configs/winston';

/**
 * Middleware for logging HTTP requests and responses.
 *
 * Uses the 'morgan' HTTP request logger configured to log
 * detailed information about each incoming request and its corresponding response.
 * The format includes the HTTP method, request path, response status, content length,
 * and response time in milliseconds.
 *
 * The logged messages are then passed to the Winston logger, which is configured
 * separately in '../configs/winston'. This allows for a consistent logging
 * format and behavior across the application, and the flexibility to log to
 * various transports (e.g., console, files, external services).
 */
const loggerMiddleware: RequestHandler = morgan(
  // eslint-disable-next-line max-len
  'Method: :method Path: :url Status: :status Content-length: :res[content-length] - response time: :response-time ms',
  {
    stream: {
      write: (message: string) => logger.http(message.trim())
    }
  }
);

export default loggerMiddleware;
