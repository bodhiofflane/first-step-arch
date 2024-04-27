import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IHashService } from './hash.service.interface';

@injectable()
export class HashService implements IHashService {
  constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}
  async hashString(str: string): Promise<string> {
    return await hash(str, parseInt(this.configService.get('SALT')));
  }
  async compareString(str: string, hash: string): Promise<boolean> {
    return await compare(str, hash);
  }
}
