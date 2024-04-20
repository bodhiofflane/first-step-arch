import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entiny';
import { IUsersService } from './users.service.interface';

// Должен быть injectable иначе будет ошибка. Аннотация обязательна для компонентов в которые инджектят и которые инджектят.
// Этот сервис мы будем инджектить в UsersController. Не забыть добавить в контейнер модуль.
@injectable()
export class UsersService implements IUsersService {
  // В сервисе у нас только бизнес логика. То есть работа с бизнес сущностями.
  // Слюда будет передоваться именно объект dto.
  async createUser({ email, name, password }: UserRegisterDto): Promise<UserEntity | null> {
    const user = new UserEntity(email, name);
    await user.setPassword(password);
    // Проверка. Если существует то возвращаем null, если нет, то UserEntity.
    // Это типа бизнез правило... пользователи не должны иметь одинковый email.
    return user;
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
