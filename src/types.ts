// Делаем символы для всех компонентов которые мы будем связывать.
export const TYPES = {
  Application: Symbol.for('Application'),
  ILogger: Symbol.for('ILogger'),
  UsersController: Symbol.for('UsersController'),
  UsersService: Symbol.for('UsersService'),
  ExeptionFilter: Symbol.for('ExeptionFilter'),
};

// Перейдем к контейнеру. main.ts
