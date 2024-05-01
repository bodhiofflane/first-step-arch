import 'reflect-metadata';
import { Container } from 'inversify';
import { IUsersRepository } from './users.repository.interface';
import { IHashService } from '../common/hash.service.interface';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { UsersService } from './users.service';
import { UserEntity } from './user.entiny';
import { UserModel } from '@prisma/client';

// 9) Пользуемся библиотекой jest и задаем нашим методам значения из jest.
// 10) Зависимости UsersServer'а мы теперь можем подменить на макеты. В проекте мы ичпользуем интерфейтс а не реализацию.
const HashServiceMock: IHashService = {
  // 9.1) Говорим что это просто jest-функции с которыми мы можем мокать. В телории может быть указанно все что угодно.
  hashString: jest.fn(),
  compareString: jest.fn(),
};
const UsersRepositoryMoch: IUsersRepository = {
  create: jest.fn(),
  find: jest.fn(),
};

// 5) Далее нужно собрать контейнер, также как мы делали в main.ts. Используем сразу класс Contaier, так как набор зависимостей ограничен.
const container = new Container();

// 6) Объявляем зависимости зарание.
let userServise: IUsersService;
let userRepository: IUsersRepository;
let hashService: IHashService;

// 1) Нужно частично собрать наш сервис не запуская всего приложения. Воспользуемся специальных хуком beforeAll.
// 2) beforeAll - хук-функция которая будут выполнятся перед всеми тестими. Есть хук beforeEach, которая будет выполнятся перед каждый тестом.
// 3) Также есть хук afterAll, который авполняется после всех тестов. Обыно используют для отключения коннектов (нам не пригодится).

// 7) Создаем такой же паганный контейнер как и в main.ts. Вообщем делаем тоже самое.
beforeAll(() => {
  // 8) Мы не можем в UserService заижекнить его зависимости, т.к. придется поднимать UserRepository, а для него PrismaService. По-этому мокаем.
  container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
  // 11) Биндим кнстанту вместо класса. У inversify есть такая возможность.
  container.bind<IHashService>(TYPES.HashService).toConstantValue(HashServiceMock);
  container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMoch);

  // 12) Достаем наши ненастоящие объекты из контейнера. Забиндили туда все необходимые зависимоти для того что-бы потом переопределять их методы.
  userServise = container.get<IUsersService>(TYPES.UsersService);
  userRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
  hashService = container.get<IHashService>(TYPES.HashService);
});

// 3) describe описывает что мы тестирует. Он обрамляет группу тестируемых функций-методов.
describe('UserService', () => {
  // 4) it - это определение отдельных тестов. В нашем слечае она асинхронна что-бы внутри вызывапть await.
  it('createUser', async () => {
    // 14) Ебанный свинский пидор. Пошел ты нахуй.
    hashService.hashString = jest.fn().mockReturnValueOnce('1234');
    // 15) Ебанный свинский пидор мокает имплементацию.
    userRepository.create = jest.fn().mockImplementationOnce((user: UserEntity): UserModel => {
      return {
        name: user.name,
        email: user.email,
        password: user.password,
        id: 1,
      };
    });

    // 13) Мы не получим результат, т.к. в рамках создания пользователя, дважды вызывается запрос к UserRepository: find и create.
    const createdUser = await userServise.createUser({
      email: 'a@a.com',
      name: 'Vasya',
      password: '1',
    });

    expect(createdUser?.id).toEqual(1);
    expect(createdUser?.password).not.toEqual('1');
  });
});
