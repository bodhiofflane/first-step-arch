import 'reflect-metadata';
import express, { Express } from 'express';
import { injectable, inject } from 'inversify';

import { UsersController } from './users/users.controller';

import { Server } from 'node:http';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';

import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { IMiddleware } from './common/middleware.interface';

@injectable()
export class App {
  public app: Express;
  public port: number;
  public server: Server;

  constructor(
    @inject(TYPES.ConfigService) public configService: IConfigService,
    @inject(TYPES.PrismaService) public prismaService: PrismaService,
    @inject(TYPES.ILogger) public logger: ILogger,
    @inject(TYPES.UsersController) public usersController: UsersController,
    @inject(TYPES.ExeptionFilter) public exeptionFilter: IExeptionFilter,
    @inject(TYPES.AuthMiddleware) private authMiddleware: IMiddleware,
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
    const authMiddleware = this.authMiddleware;
    this.app.use(authMiddleware.exicute.bind(authMiddleware));
  }

  public async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionsFilter();
    // 2) Конектимся к db.
    await this.prismaService.connection();
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
  }
}
