import { hash, compare } from 'bcryptjs';

export class UserEntity {
  private _password: string;
  constructor(
    private readonly _email: string,
    private readonly _name: string,
    password?: string,
  ) {
    if (password) {
      this._password = password;
    }
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  public async setPassword(pass: string, salt: number): Promise<void> {
    this._password = await hash(pass, salt);
  }

  public async comparePass(pass: string): Promise<boolean> {
    return await compare(pass, this._password);
  }
}
