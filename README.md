# gdmn-mob

![Схема платформы](docs\gdmn-mobile\img\platform_scheme_small.png "Схема платформы")

## Установка

1. Установить [Node.js](https://nodejs.org/en/download/). Проверено с версией Node 16.13.1 LTS
2. Установить [Yarn 1 (он же Yarn Classic)](https://classic.yarnpkg.com/lang/en/)
3. Установить **Python 3.x**
4. Для Windows: установить **Microsoft Visual Studio 2017 Build Tools**. Например, из командной строки командой `choco install visualstudio2017buildtools`. Зайти в программу конфигурации/инстоляции **Microsoft Visual Studio Build Tools** и установить **Visual C++ Build Tools Workload**
5. Для Linux/Ubuntu выполнить: `apt install build-essential`
6. Клонировать репозиторий командой `git clone https://github.com/stasgm/gdmn-mob`
7. Перейти в папку `gdmn-mob` и выполнить команду `yarn` для установки зависимостей
8. Настроить конфигурацию сервера:
   1. перейти в папку `apps/server/config`
   2. сделать две копии файла конфигурации `dev.ts.sample` в эту же папку
   3. переименовать одну копию в `prod.ts`, а вторую -- в `dev.ts`
   4. в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные
   5. вернуться в папку `gdmn-mob`
9. Настроить конфигурацию модуля `web-admin`:
    1. перейти в папку `apps/web-admin/config`
    2. сделать копию файла конфигурации `dev.json.sample` в эту же папку
    3. переименовать копию в `dev.json`
    4. в созданом файле конфигурации (`dev.json`) указать cвои данные
    5. вернуться  в папку `gdmn-mob`
10. Настроить конфигурацию библиотеки `@lib/client-config`:
    1. перейти в папку `packages/client-config/src`
    2. сделать две копии файла конфигурации `dev.ts.sample` в эту же папку
    3. переименовать одну копию в `prod.ts`, а вторую -- в `dev.ts`
    4. в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные
    5. вернуться в папку `gdmn-mob`
11. Выполнить команды `yarn build:lib`, `yarn build:server`, `yarn build:web-admin`
12. Настроить переменные приложений (если необходимо):
    1. в корневой папке конкретного приложения сделать копию файла `.sample.env` в эту же папку
    2. переименовать копию в `.env`
    3. указать в файле `.env` свои данные
<!-- 9. Настроить конфигурацию модуля `app-trade-agents`:
   1. сделать две копии файла конфигурации (`apps/app-trade-agents/src/config/dev.ts.sample`) в эту же папку
   2. переименовать одну копию в `prod.ts`, а вторую -- в `dev.ts`
   3. в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные
10. Настроить конфигурацию модуля `back-trade-agents`:
    1. сделать две копии файла конфигурации (`apps/back-trade-agents/src/config/environments/dev.ts.sample`) в эту же папку
    2. переименовать одну копию в `prod.ts`, а вторую -- в `dev.ts`
    3. в созданных файлах конфигурации (`prod.ts`, `dev.ts`) указать cвои данные -->
## Запуск сервера

   ```bash
   yarn app:server
   ```
## Инструкции к приложениям:

1. [Инструкция по Web-admin](https://github.com/stasgm/gdmn-mob/blob/dev/docs/web-admin/docs/README.md)
2. [Инструкция по GDMN Отдел снабжения](https://github.com/stasgm/gdmn-mob/blob/dev/docs/gdmn-appl-request/docs/README.md)
3. [Инструкция по GDMN Торговые агенты](https://github.com/stasgm/gdmn-mob/blob/dev/docs/gdmn-app-trade-agents/docs/README.md)
4. [Инструкция по GDMN Склад](https://github.com/stasgm/gdmn-mob/blob/dev/docs/gdmn-gd-movement/docs/README.md)
