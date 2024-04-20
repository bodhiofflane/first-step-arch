import { Logger, ILogObj } from 'tslog';

// Выступает как контракт. Класс Logger будет имплементировать функционал этого интерфейса.
export interface ILogger {
  logger: unknown; // Logger<ILogObj>; Почему здесь unknown?
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
}
