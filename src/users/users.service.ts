import { injectable, inject } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entiny';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UsersService implements IUsersService {
  // 1) Инджектим инстанс для работы с конфигом.
  constructor(@inject(TYPES.ConfigService) public configService: IConfigService) {}

  async createUser({ email, name, password }: UserRegisterDto): Promise<UserEntity | null> {
    const user = new UserEntity(email, name);

    // 2) В момент создания юзера получаем СОЛЬ из глобального конфига.
    const salt = this.configService.get('SALT');
    console.log(salt);

    // 3) Так как из .env мы можем получть только string - явно кастуем к числу, что бы приложение не упало в runtime.
    await user.setPassword(password, parseInt(salt));

    return user;
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
