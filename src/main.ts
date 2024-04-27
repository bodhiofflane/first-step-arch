import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { IUsersService } from './users/users.service.interface';

import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';

import { TYPES } from './types';
import { IUsersController } from './users/users.controller.interace';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
  bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();
  bind<IUsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
  // 1) Мы чаще будем использовать репозиторий, а сервис нам понадобится только для подключения.
  // 2) Тем не мение - нам нужен единый инстанс PrismaService.
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<App>(TYPES.Application).to(App).inSingletonScope();
  // 1) Нам нужен UserRepository в едином экземпляре.
  bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
});

function bootstrap(): IBootstrapReturn {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();
  return { appContainer, app };
}

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}
export const { app, appContainer } = bootstrap();

process.on('SIGINT', () => {
  process.exit(0);
});
