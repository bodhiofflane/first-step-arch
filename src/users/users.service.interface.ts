import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entiny';

export interface IUsersService {
  // До попадания в сервис мы работаем с dto.
  createUser(dto: UserRegisterDto): Promise<UserEntity | null>;
  // Проверка креденшионалов. Валидация.
  validateUser(dto: UserLoginDto): Promise<boolean>;
}
