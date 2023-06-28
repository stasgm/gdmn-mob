# Создание образа
Для работы бэк-сервера и веб-админки из файла docker-compose.yaml запускается два сервиса\контейнера: server и web-admin.
Для сборки образов созданы соответствующие файлы Dockerfile, каждый из которых описывает 2 стадии:
1. сборка - копирование файлов, установка зависимостей, компилирование
2. выпуск - копирование скомпилированных файлов в окончательный образ

Для сборки образа сервера необходимо:
- настроить параметры по умолчанию в папке gdmn-mob/apps/server/config
- скопировать SSL сертификаты в корневую папку ssl, которая далее будет примонтирована к контейнеру

Для сборки веб-админки необходимо:
- в корне проекта в .env файле указать значения google ключей для капчи, которые будут переданы при сборке в переменные среды через аргументы. А  также указать TAG для образа веб-админки, по умолчанию - latest.
- настроить параметры подключения к серверу в библиотеке gdmn-mob/packages/client-config

Важно, порт HTTPS_PORT в сервисе server должен совпадать с портом, указанным в библиотеке client-config.

## Порядок действий
1. Клонируем репозиторий в папку workspace (предварительно выполнить команду sudo -s и после дать права на папку chown -R $USER gdmn-mob):
```
sudo -s
git clone https://github.com/stasgm/gdmn-mob.git
chown -R $USER gdmn-mob
```

2. Заходим в папку gdmn-mob/apps/server/config, создаем файлы dev.ts и prod.ts, копируя dev.ts.sample.
В этих файлах установлены параметры для работы сервера в зависимости от режима. PORT, HTTPS_PORT и FILES_PATH будут переопределены в docker-compose через переменные среды.

3. В папку gdmn-mob/ssl переносим 3 файла сертификатов.

4. Заходим в папку gdmn-mob/packages/client-config/src, создаем файлы dev.ts и prod.ts, копируя dev.ts.sample.
В этих файлах указаны настройки соединения с сервером для API запросов.

5. В папке gdmn-mob создаем файл .env и прописываем значения ключей для капчи:
REACT_APP_SECRET_KEY
REACT_APP_SITE_KEY

6. Если надо, копируем старую базу в том db из папки с файлами:
```
cp -a . /var/snap/docker/common/var-lib-docker/volumes/gdmn-mob_db/_data
```

7. Из папки gdmn-mob выполняем команду:
```
docker-compose build
```

Если надо сбилдить конкретный образ, то в конце команды прописать имя сервиса:
```
docker-compose build web-admin
```

8. Для проверки запустим контейнеры:
```
docker-compose up
```

В браузере открываем админку: https://server.gdmn.app:3656

Проверка http cервера: http://server.gdmn.app:3654/api/v1/test

Проверка https сервера: https://server.gdmn.app:3655/api/v1/test


# Загрузка образа в Docker hub
```
docker login --username 'userName' --password 'userPassword'
docker-compose push
```

# Запуск контейнера из образа
Чтобы запустить контейнер из образа на Docker Hub, выполните следующие шаги:

1. Установите Docker на вашу виртуальную машину Linux или локальный компьютер, если вы работаете на нём.
2. Скопируйте файл docker-compose.yaml.
3. Рядом с docker-compose.yaml, создайте папку ssl и скопируйте туда SSL сертификаты.
4. Рядом с docker-compose.yaml, создайте файл .env и укажите там значение переменной TAG.
Значение TAG зависит от переменной в разделе сервиса server. Если порт сервера HTTPS_PORT=3655, то TAG=latest, иначе, с таким портом должен быть сформирован образ админки и помечен определенным тэгом, который и надо будет указать в .env файле.
5. Если надо, копируем старую базу в том db:
```
cp -a . /var/snap/docker/common/var-lib-docker/volumes/gdmn-mob_db/_data
```
Чтобы Docker Compose загрузил образы из Docker Hub и создал соответствующие контейнеры, выполните следующую команду из директории, содержащей файл docker-compose.yml:
```
docker-compose up
```
Проверьте, что контейнеры успешно запущены, используя команду docker ps. Вы должны увидеть сервисы с именем "server" и "web-admin" со статусом "Up".
```
docker ps
```
