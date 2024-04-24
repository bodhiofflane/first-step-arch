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

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  // 1) Желательно инекцировать один экземпляр в классы потребители.
  // 2) Исключением являются случаи когда инекцировать нужно явно разные инстансы класса.
  // 3) Также можно не применять inSingletonScope когда инъекция будет проведена лишь один раз, в один класс.
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
  bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();
  bind<IUsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
  // Здесь нам нужно что-бы у нас шарился один экземпляр конфигураций. В консоле видм лишь одну инициализацию конфига.
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<App>(TYPES.Application).to(App).inSingletonScope();
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
