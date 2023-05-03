import { Request, Response, NextFunction, RequestHandler } from 'express';

// eslint-disable-next-line max-len
export function requestWrap(handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
