// 1) Тут будет лежать сервис который позволит конектится к нашей базе данных.
// 2) Очень важно! Теперь отсюда мы можем взять UserModel которую описали в scheme.prisma;
// 3) Генирируем типы script: prisma generate и PrismaClient получает все наши модельки.
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
  client: PrismaClient;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    // 4) Получаем инстанс PrismaClient, из которого будем вызывать connect.
    this.client = new PrismaClient();
  }

  async connection(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log('[PrismaService] Успешно подключились к базе данных');
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error('[PrismaService] Ошибка подключения к базе данных' + e.message);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}

// 5) Вообщем когда мы используем generate, у нас генирируется содержисое для @prisma/client, куда входят в том числе и типы.
