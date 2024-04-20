import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

// Валидировать будем с помощью class-validator и class-transform. (Используются в nestjs)
// Работа осуществляюется с помощью декораторов.
export class ValidateMiddleware implements IMiddleware {
  constructor(private classToValidate: ClassConstructor<object>) {}

  // Берем тело запроса - преобразовываем в объект класса который мы передали в констуктор.
  // Спомощью функции validate, проверям на наличие ошибок валидации.
  // Если ошибки есть, то отправляем их.
  // Если ошибок нет, то запускаем следующую функцию в конвеере.
  exicute(req: Request, res: Response, next: NextFunction): void {
    // Функция создает инстанс класса спомощью данных которые отправленны в body. Че бля...
    // Может переданый сюда класс сохранится как пропс, а вызвав этот метод мы создадим и нстанс класса и в его конструктор передадим body?
    const instance = plainToClass(this.classToValidate, req.body);
    validate(instance).then((errors) => {
      if (errors.length) {
        // На клиент улетает сырой объект ошибки. Сами ошибки находятся в constraints
        res.status(422).send(errors);
      } else {
        next();
      }
    });
  }
}

// В результате мы можем валидировать любые объекты любой сложности, используя декораторы.
// При этом передавая любой dto класс.
