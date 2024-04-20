import { Response, Router } from 'express';
import { IRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

import 'reflect-metadata';

// 1) Для того что бы класс стал "Инъецируемым", нужно задать декоратор и его родителю.
// 2) От этого класса наслебуется UserController.
// 1) Это абстрактный клссс, потому здесь можно задать реализацию некоторых методов и объявить свойства.
@injectable()
export abstract class BaseController {
  // 1) Логгер мы получем из класса наследника, прокидывая его через метод super.
  protected logger: ILogger;
  // 1) Роутер мы получаем из импорта.
  private readonly _router: Router;

  // 1) Инициализируем Express Router.
  // 2) Логгер который получаем из метода super задаем как свойтсва этому классу. Он унаследуется наследниками.
  constructor(logger: ILogger) {
    this.logger = logger;
    this._router = Router();
  }

  // 1) Метод возвращающий инстанс роутера.
  get router(): Router {
    return this._router;
  }

  // Три непонятных метода, которые должны облегчить работу.
  public send<T>(res: Response, code: number, message: T): void {
    res.status(code);
    res.type('application/json').json(message);
  }
  public ok<T>(res: Response, message: T): void {
    return this.send<T>(res, 200, message);
  }
  public created(res: Response): Response<any, Record<string, any>> {
    return res.sendStatus(201);
  }

  // 1) Это метод который прнимает массив объектов {path: string, func: (req,res,next): void}.
  // 2) Формировать этот массив мы будем в классах потомках.
  // 3) Мы будем вручную задавать путь, задавать тип http-метода и передавать метод-обработчик запроса.
  // 4) Методы обрабодотчики запроса, это реализованные в к классе наследнике методы.
  // 5) Полученные роуты мы: перебираем, выводим в лог, каждую метод-обработчик биндим на this этого класса. Почему?
  // 6) А далее конструируем запись в инстанс роутера. Этот роутер мы возвращаем гетером router.
  // 7) Возвращенный роутер будет использован в методе useRouter класса App и записан в глобальный app через use, с заданием соответствующего пути.
  public bindRoutes(routes: IRoute[]): void {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);

      // Какая же уебанская реалзицая мидделвееров.
      // Помещаем в переменную массив мидделвеер функцйи, у которых tihs забинжена на себя же. Не помню что бы в них обащались в this. Ебучий урод...
      const middleware = route.middlewares?.map((middleware) => {
        return middleware.exicute.bind(middleware);
      });

      const handler = route.function.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;

      this.router[route.method](route.path, pipeline); // Из за того что роутер может принимать либо функцию, либо массив функций - у нас все работает.
    }
  }
}
