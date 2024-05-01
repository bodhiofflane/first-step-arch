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
// ! - переделать.
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';
import { IMiddleware } from '../common/middleware.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(TYPES.ILogger) loggerService: ILogger,
    @inject(TYPES.UsersService) private usersService: IUsersService,
    @inject(TYPES.ConfigService) private configservice: IConfigService,
    @inject(TYPES.AuthGuard) private authGuard: IMiddleware,
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
      {
        path: '/info',
        method: 'get',
        function: this.info,
        middlewares: [this.authGuard],
      },
    ]);
  }
  public async register(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.createUser(req.body);
    if (!result) {
      return next(new HTTPError(422, 'Такой пользователь уже существует', 'usersController'));
    }
    // 2) Если пользователь успешно создан, то отсылаем его клиенту.
    this.ok(res, { id: result.id, email: result.email, name: result.name });
  }

  public async login(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.validateUser(req.body);
    if (!result) {
      return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
    }
    const jwt = await this.signJWT(result.email, this.configservice.get('SECRET'));
    this.ok(res, { id: result.id, email: result.email, name: result.name, jwt: jwt });
  }

  // ! - ts-node не поддтягивает доп. файлы типов. Нужно внести модицикации. Нужен флаг --files для считывания костомных типовых файлов.
  async info(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await this.usersService.getUser(req.user);
    if (!user) {
      return next(new HTTPError(404, 'Нет такого пользователя', 'info'));
    }
    this.ok(res, { id: user.id, email: user.email });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((res, rej) => {
      sign(
        {
          email: email,
          // 1) Шифруем дату кодирования токена.
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        { algorithm: 'HS256' },
        (error, token) => {
          if (error) {
            rej(error);
          }
          res(token as string);
        },
      );
    });
  }
}
