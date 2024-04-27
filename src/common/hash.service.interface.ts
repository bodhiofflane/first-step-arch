export interface IHashService {
  hashString(str: string): Promise<string>;
  compareString(str: string, hash: string): Promise<boolean>;
}
