import { NextFunction, Request, Response } from 'express';

export interface IMiddleware {
  exicute(req: Request, res: Response, next: NextFunction): void;
}
