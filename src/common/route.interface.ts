import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export type IRoute = {
  path: string;
  function: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>; // Не могу найти где именно в роутере есть такие типы.
  // Нужно добавить еще массив миддлвееров который должен отработать.
  middlewares?: IMiddleware[];
};
