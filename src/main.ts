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

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
  bind<IUsersController>(TYPES.UsersController).to(UsersController);
  bind<IUsersService>(TYPES.UsersService).to(UsersService);
  bind<App>(TYPES.Application).to(App);
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
