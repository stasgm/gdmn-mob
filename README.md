# gdmn-mob

## Установка

1. Установить [Node.js](https://nodejs.org/en/download/). Проверено с версией Node 17.1
2. Установить [Yarn 1 (он же Yarn Classic)](https://classic.yarnpkg.com/lang/en/)
3. Установить **Microsoft Visual Studio 2017 Build Tools**. Например, командой `choco install visualstudio2017buildtools`
4. Зайти в программу конфигурации/инстоляции **Microsoft Visual Studio Build Tools** и установить **Visual C++ Build Tools Workload**
5. Клонировать репозиторий командой `git clone https://github.com/stasgm/gdmn-mob`
6. Перейти в папку `gdmn-mob` и выполнить команду `yarn` для установки зависимостей
7. Настроить конфигурацию сервера:
   1. сделать две копии файла конфигурации (`apps/server/config/dev.sample`) в эту же папку
   2. переименовать одну копию в `prod.ts`, а вторую -- в `dev.ts`
   3. в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные
   4. сделать копию файла конфигурации (`/apps/server/config/databases/templates.config.json.sample`) в эту же папку
   5. переименовать копию в `templates.config.json`
   6. при использовании одной базы данных в созданном файле конфигурации оставить только `[]`
8. Настроить конфигурацию модуля `app-trade-agents`:
   1. сделать две копии файла конфигурации (`apps/app-trade-agents/src/config/dev.ts.sample`) в эту же папку
   2. переименовать одну копию в `prod.ts`, а вторую -- в `dev.ts`
   3. в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные
9. Настроить конфигурацию модуля `back-trade=agents`:
   1. сделать две копии файла конфигурации (`apps/back-trade-agents/src/config/environments/dev.ts.sample`) в эту же папку
   2. переименовать одну копию в `prod.ts`, а вторую -- в `dev.ts`
   3. в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные
10. Настроить конфигурацию модуля `web-admin`:
    1. сделать копию файла конфигурации (`apps/web-admin/configs/dev.json.sample`) в эту же папку
    2. переименовать копию в `dev.json`
    3. в созданом файле конфигурации (`dev.json`) указать cвои данные
11. Настроить конфигурацию библиотеки `@lib/client-config`:
    1. сделать две копии файла конфигурации (`packages/client-config/src/config.sample`) в эту же папку
    2. переименовать одну копию в `prod.ts`, а вторую -- в `dev.ts`
    3. в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные
12. Выполнить команду `yarn build:lib`
13. Настроить переменные приложений:
    1. в корневой папке конкретного приложения сделать копию файла `.sample.env` в эту же папку
    2. переименовать копию в `.env`
    3. указать в файле `.env` свои данные

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

## Инструкции к приложениям:

1. [Инструкция по web-admin](https://github.com/stasgm/gdmn-mob/blob/dev/apps/web-admin/docs/README.md)
