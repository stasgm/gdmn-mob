# gdmn-mob

## Установка

1. Установить [Node.js](https://nodejs.org/en/download/), [Yarn](https://classic.yarnpkg.com/lang/en/).

2. Скачать репозиторий:

   ```bash
   git clone https://github.com/stasgm/gdmn-mob
   ```

3. Настроить конфигурацию сервера:

   - сделать две копии файла конфигурации (`apps/server/config/dev.sample`) в эту же папку
   - переименовать одну копию в `prod.ts`, а вторую в `dev.ts`.
   - в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные

4. Настроить конфигурацию библиотеки @lib/client-config:

   - сделать две копии файла конфигурации (`packages/client-config/src/config.sample`) в эту же папку
   - переименовать одну копию в `prod.ts`, а вторую в `dev.ts`.
   - в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные

5. Выполнить следующие команды:

   ```bash
   yarn
   yarn build:lib
   ```

6. Настроить переменные приложений:

   - в корневой папке конкретного приложения сделать копию файла .sample.env в эту же папку
   - переименовать копию в .env
   - указать в файле .env свои данные

## Запуск приложений

1. Запуск сервера:

   ```bash
   yarn app:server
   ```

2. Запуск web-admin:

   ```bash
   yarn app:web
   ```

3. Запуск тестового мобильного приложения:

   ```bash
   yarn expo:app
   ```
