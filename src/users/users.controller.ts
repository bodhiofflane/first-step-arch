import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/HttpError.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUsersController } from './users.controller.interace';

import 'reflect-metadata';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(TYPES.ILogger) loggerService: ILogger,
    @inject(TYPES.UsersService) private usersService: IUsersService,
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        function: this.register,
        // В констуктор валидатора, передаем класс который является интерфейсом прибывших данных из body. В dto нужно использовать декораторы для валидации.
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      { path: '/login', method: 'post', function: this.login },
    ]);
  }

  // 1) Dictionary
  // 2) ResBody
  // 3) ReqBody - Тело пришедшее в запросе. Описываем Dto.
  public async login(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    console.log(req.body);
    next(new HTTPError(401, 'Ошибка авторизации', 'login'));
  }

  // Слой контролер отвечает за то что мы получаем и передаём в сервис.
  // Дале за то что мы получаем из сервиса, преобразуем и отправляем клиенту.
  public async register(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // Результат который выдаёт бизнес-правило.
    const result = await this.usersService.createUser(req.body); // body соотвествует UserRegister.dto
    if (!result) {
      return next(new HTTPError(422, 'Такой пользователь уже существует', 'usersController'));
    }
    console.log('anus');
    // Если все ок, то возращаем созданного пользователя. Нужно отпралять без пароля.
    // Здесь же мы должны делать преобразования результата.
    this.ok(res, { email: result.email, name: result.name });
  }
}
