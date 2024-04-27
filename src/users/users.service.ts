import { injectable, inject } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entiny';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService {
  // 1) Инджектим инстанс для работы с конфигом.
  constructor(
    @inject(TYPES.ConfigService) public configService: IConfigService,
    @inject(TYPES.UsersRepository) public usersRepository: IUsersRepository,
  ) {}

  // ! - Меня очень смущает отсутствие await у методов запроса к db.
  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    // 1) Получили и падготовили user'a с хешированным паролем.
    const newUser = new UserEntity(email, name);
    const salt = this.configService.get('SALT');
    await newUser.setPassword(password, parseInt(salt));

    // 2) Ищим в db user'а с таким же паролем. Если есть возвращаем null.
    const existedUser = await this.usersRepository.find(newUser.email);
    if (existedUser) {
      return null;
    }

    // 2) Если user уникален, то создаем его и возвращаем в controller.
    return this.usersRepository.create(newUser);
  }

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    const existedUser = await this.usersRepository.find(email);
    if (!existedUser) {
      return false;
    }
    const userEntity = new UserEntity(existedUser.email, existedUser.name, existedUser.password);
    return await userEntity.comparePass(password);
  }
}
