import { Response, Router } from 'express';
import { IRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

import 'reflect-metadata';

@injectable()
export abstract class BaseController {
  protected logger: ILogger;
  private readonly _router: Router;

  constructor(logger: ILogger) {
    this.logger = logger;
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T): void {
    res.status(code);
    res.type('application/json').json(message);
  }
  public ok<T>(res: Response, message: T): void {
    return this.send<T>(res, 200, message);
  }
  public created(res: Response): Response<any, Record<string, any>> {
    return res.sendStatus(201);
  }

  public bindRoutes(routes: IRoute[]): void {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);

      const middleware = route.middlewares?.map((middleware) => {
        return middleware.exicute.bind(middleware);
      });

      const handler = route.function.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;

      this.router[route.method](route.path, pipeline);
    }
  }
}
