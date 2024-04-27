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
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: '/login',
        method: 'post',
        function: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
    ]);
  }

  public async login(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.validateUser(req.body);
    if (!result) {
      // Функцию next обязательно нужно возвращать чтобы прервать работу контроллера.
      return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
    }
    this.ok(res, { message: 'Ok' });
  }

  public async register(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // 1) Из сервиса возвращается либо UserModel, либо null.
    const result = await this.usersService.createUser(req.body);
    if (!result) {
      return next(new HTTPError(422, 'Такой пользователь уже существует', 'usersController'));
    }
    // 2) Если пользователь успешно создан, то отсылаем его клиенту.
    this.ok(res, { id: result.id, email: result.email, name: result.name });
  }
}
