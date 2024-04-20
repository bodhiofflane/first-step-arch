import 'reflect-metadata';
import express, { Express } from 'express';
import { injectable, inject } from 'inversify';

import { UsersController } from './users/users.controller';

import { Server } from 'node:http';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';

import { TYPES } from './types';

// 1) В Ангуляре декоратор Injectable указывает что класс можем использовать другие сущности из контейнера.
// 2) Декоратор гарантирует что механизм внедрения звисимостей сможет создать объект этого класса и передать в него в качестве зависимсотей другой объект.
// 3) Условно говоря, мы помечаем класс как "Инъецируемый", тот в который будет производится инъекция.
@injectable()
export class App {
  public app: Express;
  public port: number;
  public server: Server;

  // 1) Декоратор Inject, берет инстанс класса из контейнерного модуля и внедряет в качестве зависимости в этот класс.
  // 2) В итоге, нам не нужно прокидывать сюда зависимости из Composition Root вручную.
  // 3) Из этого следует что каждый созданный инстанс от этого класса уже будет имень в себе свойства: logger, userController и exeptionFilter.
  constructor(
    @inject(TYPES.ILogger) public logger: ILogger,
    @inject(TYPES.UsersController) public usersController: UsersController,
    @inject(TYPES.ExeptionFilter) public exeptionFilter: IExeptionFilter,
  ) {
    this.app = express();
    this.port = 8000;
  }

  // 1) Полученный контроллер пользователей мы записываем в роутинг, по пути '/users'
  // 2) В классе BaseController реализован метод bindRoutes и геттре router.
  // 3) Первый метод записывает вся полученные роуты в роутер а второй возврщает.
  // 4) Метод будет вызван в методе init.
  public useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  // 1) В глобальный роутинг приложения записывается метод catch из инстанса exeptionFilter который поподает сюда через конструктор.
  // 2) Метод с биндом ссылающимся нам сам инстанс класса exeptionFilter.
  // 3) Обработчик исключений должен быть всего последним в app.use.
  public useExeptionsFilter(): void {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public useMiddleware(): void {
    this.app.use(express.json());
  }

  // 1) Вызываем сначала запись всех полученных роутеров в глобальный роутинг app.
  // 2) Вызываем запись фильтра исключенний в глобальный роутинг. Должен быть последним в app.use.
  // 3) Запускаем сервер и вернувшийся объект записываем в свойство server. Хз зачем, ведь далее оно не используется.
  // 4) Логируке запуск.
  public init(): void {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionsFilter();
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
  }
}
