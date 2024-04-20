import { hash } from 'bcryptjs';

// Этот класс предназначен для работы с бизнес сущносями.
// Эта сущность должна быть максимально отделена и изолированна от системы и сорежать наботы методов что бы удобно работать с полями.
// В нашем случае мы используем класс для создания объекта на основе req.body.

// Этот класс для создания и работы с бизнес-сущностью.
// Он должен быть максимально изолирован он системы и содержать удобные методы для работы с полями.
// Класс принимает в себя деструктурированный req.body, который dto.
export class UserEntity {
  private _password: string;
  constructor(
    private readonly _email: string,
    private readonly _name: string,
  ) {}

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  // setter не может быть ассинхронным, по этому метод
  public async setPassword(pass: string): Promise<void> {
    // Сюда мы будем передовать salt, который хранится в конфигурации приватно.
    this._password = await hash(pass, 10);
  }
}
