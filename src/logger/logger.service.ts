import { Logger, ILogObj } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';

import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
  logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger();
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }
  error(...args: unknown[]): void {
    this.logger.error(...args);
  }
  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
