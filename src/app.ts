import 'reflect-metadata';
import express, { Express } from 'express';
import { injectable, inject } from 'inversify';

import { UsersController } from './users/users.controller';

import { Server } from 'node:http';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';

import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';

@injectable()
export class App {
  public app: Express;
  public port: number;
  public server: Server;

  constructor(
    @inject(TYPES.ILogger) public logger: ILogger,
    @inject(TYPES.UsersController) public usersController: UsersController,
    @inject(TYPES.ExeptionFilter) public exeptionFilter: IExeptionFilter,
    @inject(TYPES.ConfigService) public configService: IConfigService,
  ) {
    this.app = express();
    this.port = 8000;
  }

  public useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  public useExeptionsFilter(): void {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public useMiddleware(): void {
    this.app.use(express.json());
  }

  public init(): void {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionsFilter();
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
  }
}
