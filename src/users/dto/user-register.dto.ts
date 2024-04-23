import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
  //
  @IsEmail({}, { message: 'Неверно указан email' })
  email: string;

  @IsString({ message: 'Не укзан пароль' })
  password: string;

  @IsString({ message: 'Не указано имя' })
  name: string;
}
