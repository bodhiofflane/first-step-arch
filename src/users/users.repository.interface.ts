// 1) Импорт возвращаемого типа должен быть из @prisma/client.
import { UserModel } from '@prisma/client';
import { UserEntity } from './user.entiny';

// 2) Это просто интерфейс для реализации юзер репозитория.
export interface IUsersRepository {
  create(user: UserEntity): Promise<UserModel>;
  find(email: string): Promise<UserModel | null>;
}
