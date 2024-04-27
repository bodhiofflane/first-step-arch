import { UserModel } from '@prisma/client';
import { UserEntity } from './user.entiny';
import { IUsersRepository } from './users.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';

// 0) С точки зрения ответственности, UserRepository должен раборать исключительно с UserModel.
@injectable()
export class UsersRepository implements IUsersRepository {
  // 1) Мы получаем инстанс PrismaService для того чтобы воспользоваться свойством client.
  constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
  async create(user: UserEntity): Promise<UserModel> {
    // 2) Вызываем из полученного PrismaServicr client, а из него UserModel.
    // Это возможно благодаря тому что мы использовали prisma generate.
    // 3) Обращаемся к методу create и создаем нового пользователя.
    return this.prismaService.client.userModel.create({
      data: {
        email: user.email,
        password: user.password,
        name: user.name,
      },
    });
  }

  // 4) Это служебный метод для проверки уникальности email.
  // 5) Здесь мы также обращаемся к UserModel.
  async find(email: string): Promise<UserModel | null> {
    return this.prismaService.client.userModel.findFirst({
      where: {
        email: email,
      },
    });
  }
}
