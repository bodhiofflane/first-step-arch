import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entiny';
import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
  async createUser({ email, name, password }: UserRegisterDto): Promise<UserEntity | null> {
    const user = new UserEntity(email, name);
    await user.setPassword(password);
    return user;
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
