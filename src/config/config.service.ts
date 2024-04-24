import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config.service.interface';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    // 1) config всегда возвращает DotenvConfigOutput, который содержит error: Error, либо parsed: DotenvParseOutput.
    // 2) Из за косяка с типами, они друг друга не исключают и в итоге нужно будет явно кастовать.
    const result: DotenvConfigOutput = config();
    // 3) Если есть ошибка при загрузке .env то логирует.
    if (result.error) {
      this.logger.error('[ConfigService] Не удалось прочитать файл .env или он отсутствует.');
    } else {
      // 4) Еслиа ошибки нет, то записываем распаршенный .env в свойство config.
      this.logger.log('[ConfigService] Конфигурация .env загруженна.');
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  // 5) Вытаскиваем из конфига нужное значение по ключу.
  get(key: string): string {
    return this.config[key];
  }
}

// 6) Очень важно! Когда мы инжектим класс из ContainerModule в класс потребитель, то для каждого класса потребителя создается отдельный инстанс.
// 7) Нам это не нужно, потому идем в контейнер модуль и исправляем это.
