### 1) Введение:
Благодаря призме мы получаем тайпсейфти и удобные простые запросы.
Сложные запросы к бд мы сделать не сможем.

TypeOrm давно не обновляется, секвалайз отстает в типа-безопасности.

### 2) Установка:
```bash
npm install -D prisma
```

Основной движек призмы ставится как дев зависимость.
Из него вызываетс инициализайия, генерация прочее.

```bash
npm install @prisma/client
```

Клиент нужен в runtime. С помощью него мы будем конектися, также в нем будут ледать типы.

```bash
npm install pg
```

Драйвер для работы с Postgresql. Вроде как нужен. Не проверял.

### Prisma init:

```bash
npx prisma init
```

Исполняем указанный пакет с помощью npx и получаем пустой конфиг `schema.prisma`.

`schema.prisma` - схема бд описанная в синтаксисе призмы.

### 3) Создаем модель:
```prisma
model UserModel {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  name     String
}
```

Пишем модель.

```bash
npx prisma migrate dev 
```

Эта команда собирает из модели в scheme.prisma файл migration.sql с sql командами для создания таблицы.

```bash
npx prisma generate
```

Генерирует типы из scheme.prisma в @prisma/client. В итоге к ним можно обратится.

### 4) Далее:
Создаем сервис PrismaService и помещаем его метод connect в App init.
