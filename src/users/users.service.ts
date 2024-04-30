import { injectable, inject } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entiny';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';
import { IHashService } from '../common/hash.service.interface';

@injectable()
export class UsersService implements IUsersService {
  // 1) Инджектим инстанс для работы с конфигом.
  constructor(
    @inject(TYPES.UsersRepository) public usersRepository: IUsersRepository,
    @inject(TYPES.HashService) public hashService: IHashService,
  ) {}

  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    // Разгружаю UserEntity, убирая хеширование из класса.
    const newUser = new UserEntity(email, name, await this.hashService.hashString(password));

    const existedUser = await this.usersRepository.find(newUser.email);
    if (existedUser) {
      return null;
    }

    return this.usersRepository.create(newUser);
  }

  async validateUser({ email, password }: UserLoginDto): Promise<UserModel | null> {
    const existedUser = await this.usersRepository.find(email);
    if (!existedUser) {
      return null;
    }
    const isValidPassword = await this.hashService.compareString(password, existedUser.password);
    if (!isValidPassword) {
      return null;
    }
    return existedUser;
  }

  async getUser(email: string): Promise<UserModel | null> {
    const user = await this.usersRepository.find(email);
    if (!user) return null;
    return user;
  }
}
