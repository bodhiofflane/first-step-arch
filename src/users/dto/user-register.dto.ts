// Этот класс работает как интерфейс описывающий пришедшие данные в Request<_, _, req.body>
// Пока он выступает как интерфейс для req.body и интерфейс для параметров в user.service createUser.
// Вроде бы позже мы сможем еще для чего-то использовать этот класс. В противном случае мы могли использовать обычный интерфейс.

import { IsEmail, IsString } from 'class-validator';

// Возможно может использоваться для тестов.
export class UserRegisterDto {
  //
  @IsEmail({}, { message: 'Неверно указан email' })
  email: string;

  @IsString({ message: 'Не укзан пароль' })
  password: string;

  @IsString({ message: 'Не указано имя' })
  name: string;
}
