# gdmn-mob

## Установка

1. Установить Node.js, yarn.

2. Скачать репозиторий:

   ```bash
   git clone https://github.com/stasgm/gdmn-mob
   ```

3. Настроить конфигурацию сервера:

   - сделать две копии файла конфигурации (`apps/server/config/dev.sample`) в эту же папку
   - переименовать одну копию в `prod.ts`, а вторую в `dev.ts`.
   - в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные

4. Настроить конфигурацию библиотки client-config:

   - сделать две копии файла конфигурации (`packages/client-config/src/config.sample`) в эту же папку
   - переименовать одну копию в `prod.ts`, а вторую в `dev.ts`.
   - в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные

5. Выполнить следующие команды:

   ```bash
   yarn
   yarn build:lib
   ```

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
