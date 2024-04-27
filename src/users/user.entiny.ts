export class UserEntity {
  constructor(
    private readonly _email: string,
    private readonly _name: string,
    private readonly _password: string,
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
}
