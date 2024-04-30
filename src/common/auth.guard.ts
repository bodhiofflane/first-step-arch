import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { HTTPError } from '../errors/HttpError.class';

export class AuthGuard implements IMiddleware {
  async exicute(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      // Опять забыл вернкть next-функцию.
      return next(new HTTPError(401, 'Необходима авторизация', 'AuthGuard'));
    }
    next();
  }
}
