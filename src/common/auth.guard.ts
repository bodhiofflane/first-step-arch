import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { HTTPError } from '../errors/HttpError.class';
import { injectable } from 'inversify';

@injectable()
export class AuthGuard implements IMiddleware {
  async exicute(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      return next(new HTTPError(401, 'Необходима авторизация', 'AuthGuard'));
    }
    next();
  }
}
