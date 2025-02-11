import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { JwtPayload, verify } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class AuthMiddleware implements IMiddleware {
  constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}
  exicute(req: Request, _: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      verify(
        req.headers.authorization.split(' ')[1],
        this.configService.get('SECRET'),
        (err, payload) => {
          if (err) {
            next();
          } else if (payload) {
            const email = (payload as JwtPayload).email;
            req.user = email as string;
            next();
          }
        },
      );
    } else {
      next();
    }
  }
}
