# Инструкция для мобильного приложения "GDMN. Склад"

## 1. Подключение

Чтобы запустить приложение, находим его иконку <img src="img/1.Connection/1.IconMain.png" alt="drawing" height="30"/> на рабочем экране мобильного устройства и нажимаем на нее.

При первом запуске приложения откроется стартовый экран, в котором будет предложено выбрать режим подключения:
- Демо режим ( НАЧАТЬ РАБОТУ )
- Подключение к серверу

<img src="img/1.Connection/1.StartScreen2.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.StartScreen.jpg" alt="drawing" height="400"/>


### Демо режим
При нажатии на кнопку демо режима **Начать работу** выполняется автоматический вход в приложение под тестовым пользователем.

В данном режиме можно ознакомиться с функционалом приложения offline (без подключения к базе данных) на демо данных.

Загрузка данных и работа в приложении пояснена далее в пунктах 3-9.

#### Выход из демо режима

Выйти из демо режима можно, открыв боковую панель нажатием на иконку меню " **≡** ", находящуюся в верхнем углу приложения слева, или смахнув пальцем вправо с левого края устройства. А затем перейти на экран **Профиль** и нажать на кнопку **Выйти из демо режима**.

<img src="img/1.Connection/1.OpenDemo.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.ExitDemo.jpg" alt="drawing" height="400"/>

### Подключение к серверу компании

Чтобы подключиться к рабочей базе данных необходимо  выбрать **Подключиться к серверу** для перехода на экран **Настройка подключения** (с помощью иконки <img src="img/1.Connection/1.ConfigIcon.png" alt="drawing" height="30"/> ):

<img src="img/1.Connection/1.StartScreen.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.Login.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.Connection.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.ConnectionSettings.jpg" alt="drawing" height="400"/>

Системный администратор вашего предприятия должен сообщить Вам адрес сервера и номер порта для подключения. Введите его в экране **Настройки подключения** в нижеуказанные поля.

| Параметр | Описание |
| --------------------- | ------------------------------------------ |
| Адрес сервера | Точно введите адрес, переданный вам системным администратором. Адрес должен включать протокол и доменное имя или цифровой IP адрес сервера. Пример: http://localhost |
| Порт          | Порт сервера. Пример: 3678 |

При нажатии на кнопку **Сохранить** переходим к окну для подключения к серверу:

<img src="img/1.Connection/1.Connection.jpg" alt="drawing" height="400"/>

Нажимаем кнопку **Подключиться**.

После успешного подключения к серверу появится экран **Активация устройства**.

<img src="img/1.Connection/1.Activation.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.ActivationCode.jpg" alt="drawing" height="400"/>

В данном экране необходимо ввести код активации, который пользователь должен получить от администратора системы, и нажать **Отправить**.

При последующих запусках приложения будет происходить автоматический вход в учетную запись пользователя, если в разделе **Профиль** бокового меню " **≡** " будет выставлен параметр **"Не выходить из профиля"**.

<img src="img/9.Profile/9.ProfileDemo.jpg" alt="drawing" height="400"/>

Если активация устройства прошла успешно, появится экран для входа пользователя.

В соответствующие поля необходимо ввести **Имя пользователя** и **Пароль** и нажать на кнопку **Войти**.

<img src="img/1.Connection/1.Login.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.LoginUser.jpg" alt="drawing" height="400"/>

При успешной аутентификации пользователя откроется экран **Документы**. 

<img src="img/1.Connection/1.Docs.jpg" alt="drawing" height="400"/>

Далее необходимо: 
- зайти в **Настройки** и установить необходимые для работы параметры. Например, установить параметр **Запрашивать справочники**, выставить удобный для работы период синхронизации и так далее;
- загрузить данные, необходимые для работы пользователя с приложением, через ручную синхронизацию с помощью кнопки <img src="img/1.Connection/1.Sync.jpg" alt="drawing" height="27"/>;
- получить справочники. 

Всю информацию по этим действиям можно найти в нижеследующих разделах.

Также в окне "Настройка подключения" (в это окно можно попасть следуя инструкциям в разделе **Подключение к серверу компании**) есть кнопка "Сбросить настройки", по нажатию на которую вызовется диалоговое окно, где можно указать следующие действия:

- Установить настройки по умолчанию. Подставятся данные нашего сервера, например, адрес: https://server.gdmn.app, и порт: 3654.
- Удалить данные об устройстве. Номер устройства, который необходим для аутентификации, очистится. Повторно номер устройства можно получить по новому коду активации от администратора системы. 

<img src="img/1.Connection/1.ConnectionSettings.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.ConnectionSettingsReset.jpg" alt="drawing" height="400"/>

## 2. Настройки

Экран **Настройки** содержит информацию о параметрах связи с сервером и настройки приложения.

Синхронизация дает возможность работе с сервером идти параллельно работе в приложении. 

Процесс синхронизации можно просматривать в специальном окне, которое появляется по нажатию на кнопку **Синхронизировать** (нижняя левая кнопка <img src="img/1.Connection/1.Sync.jpg" alt="drawing" height="22"/> в боковом меню **" ≡ "**).

Если же необходимо продолжить работу в приложении, не дожидаясь окончания синхронизации, можно выбрать кнопку "Продолжить работу в приложении". Окно закроется, но в правом нижнем углу будет отрисован компонент, напоминающий, что процесс синхронизации еще идет. Если на на него нажать, окно синхронизации появится снова.

<img src="img/8.Settings/8.BaseSettings3.jpg" alt="drawing" height="400"/> <img src="img/8.Settings/8.BaseSettings4.jpg" alt="drawing" height="400"/> <img src="img/8.Settings/8.SettingsSynchronization.jpg" alt="drawing" height="400"/> <img src="img/8.Settings/8.Settings1.jpg" alt="drawing" height="400"/>

Настройки приложения:

| Параметр | Описание |
| ------------ | -------- |
|Синхронизация  | Параметр **Автоматическая синхронизация**, по умолчанию, не установлен.<br> _Если установить_, то синхронизация будет выполняться автоматически каждые N минут, указанные в признаке "Автосинхронизации, мин". И **Автоматическая синхронизация** по протяжённости периода должна быть больше периода синхронизации на сервере|
|Запрашивать справочники|_Если указан_, то при при каждой синхронизации, на сервер будет отправляться запрос на справочники, который будет обрабатываться сервером и возвращаться в ответ c запрашиваемыми справочниками. <br> _Если не указан_, то запрос генерироваться не будет. Справочники будут выгружаться из сервера автоматически при каких-либо очередных изменениях на сервере|
|Использовать сканер|_Если указан_, то для сканирования штрихкода будет использован сканер терминала сбора данных.<br> _Если не указан_, то сканировать штрихкоды необходимо при помощи камеры устройства|
|Время хранения документов в архиве| Количество дней хранения обработанных документов в приложении, отсчитываемое от даты документа|
|Экранная клавиатура | Включать или выключать экранную клавиатуру можно при условии,что используется именно терминал сбора данных, а не мобильное устройство. <br>_Если параметр указан_, то в окне позиции документа будет отображена экранная клавиатура-калькулятор. <br>_Если параметр не указан_, то экранной клавиатуры в окне не будет, а ввод количества будет возможен при помощи клавиатуры ТСД  |
|Заполнять количество   | *Если указан*, то во время создания документа, при сканировании штрихкода, программа автоматически подставит "**1**" в графу **Количество**. <br> _Если не указан_, то в графе **Количество** будет стоять "**0**", и нужные цифры необходимо будет подставить вручную |
|Нулевые остатки в склад. документах| *Если указан*, то будут отображаться позиции товаров с остатком равным нулю при выборе в окне "Выбор из остатков" и будут определяться товары по штрих-коду с нулевым остатком при сканировании |
|Типы штрихкодов| Можно ограничивать типы сканируемых штрих-кодов при работе в мобильном устройстве        |

Настройки весового товара:

| Параметр | Описание |
| ------------ | -------- |
Идентификатор весового товара| Число (обычно это 22 или 23), которое означает, что штрихкод, начинающийся на это число, относится к весовому товару |
|Количество символов для кода товара| Число, которое определяет идентификатор товара в штрихкоде для поиска в справочнике |
|Количество символов для веса (в гр.)| Число, задающее количество символов в штрихкоде для определения веса товара|

По нажатию на иконку меню " **⁝** ", расположенную в правом верхнем углу, можно вернуться к начальным настройкам, выбрав пункт **Установить настройки по умолчанию**.

<img src="img/8.Settings/8.SettingsMenu.jpg" alt="drawing" height="400"/>

## 3. Загрузка данных

Чтобы загрузить данные, предназначенные для пользователя, следует нажать на кнопку синхронизации данных <img src="img/1.Connection/1.Sync.jpg" alt="drawing" height="22"/> в нижней части бокового меню.

Открыть боковое меню можно нажатием на иконку меню " **≡** ", находящуюся в верхнем углу приложения слева, или смахнув пальцем вправо с левого края устройства.

<img src="img/1.Connection/1.Docs.jpg" alt="drawing" height="400"/> <img src="img/10.Scanner/10.ScanSync.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.SyncSuccess.jpg" alt="drawing" height="400"/>

После загрузки данных в приложении должны появится справочники и все необходимые документы.

Если синхронизация прошла, но данных не появилось, то необходимо повторить синхронизацию через некоторое время.

На кнопке **Синхронизировать** отобразится дата и время последней синхронизации.

<img src="img/1.Connection/1.NewSyncDate.jpg" alt="drawing" height="400"/>

## 4. Справочники

На экране **Справочники** можно просмотреть данные, загруженные в приложение для работы.

<img src="img/2.References/2.References.jpg" alt="drawing" height="400"/> <img src="img/2.References/2.Goods.jpg" alt="drawing" height="400"/> <img src="img/2.References/2.GoodPosition.jpg" alt="drawing" height="400"/>

Пример справочника контактов:

<img src="img/2.References/2.Contacts.jpg" alt="drawing" height="400"/> <img src="img/2.References/2.ContactPosition.jpg" alt="drawing" height="400"/>

Чтобы найти справочник по наименованию можно воспользоваться строкой поиска, нажав на иконку **Поиск** <img src="img/1.Connection/1.IconSearch.jpg" alt="drawing" height="22"/> в правом верхнем углу экрана.

От получения справочников можно отказаться - через установление параметра **"Запрашивать справочники"** в отрицательное положение, (Общие настройки в пункте бокового меню Настройки).

<img src="img/8.Settings/8.BaseSettings4.jpg" alt="drawing" height="400"/>

Или же, наоборот, в любой необходимый момент отправить запрос на получение справочников - через нажатие на иконку меню " ⁝ ", расположенную в правом верхнем углу, выбрав пункт **Отправить запрос на получение справочников**.

<img src="img/8.Settings/8.NewSettings.jpg" alt="drawing" height="400"/> 


## 5. Остатки

**Остатки** представляют собой список товаров с ценами и количеством остатка в разрезе подразделения/организации/сотрудника на текущую дату.

При добавлении позиции в документ, который работает с остатками, список товаров будет ограничен только теми товарами, по которым осуществлялось складское движение по конкретному подразделению/организации/сотруднику.

Выберем подразделение.
На экране отображены остатки товаров для данного подразделения. По нажатию на конкретный товар можно просмотреть его цены и остаток.

<img src="img/7.Remains/7.Contacts.jpg" alt="drawing" height="400"/> <img src="img/7.Remains/7.Goods.jpg" alt="drawing" height="400"/>
<img src="img/7.Remains/7.Position.jpg" alt="drawing" height="400"/>

Чтобы найти найти необходимую информацию по наименованию можно воспользоваться строкой поиска, нажав на иконку **Поиск** <img src="img/1.Connection/1.IconSearch.jpg" alt="drawing" height="22"/> в правом верхнем углу экрана.

Так же можно воспользоваться фильтром <img src="img/7.Remains/7.IconFiltr.jpg" alt="drawing" height="20"/>, который сортирует товары по двум категриям "Все" и "Ненулевые".

<img src="img/7.Remains/7.Goods.jpg" alt="drawing" height="400"/> <img src="img/7.Remains/7.GoodsFiltr.jpg" alt="drawing" height="300"/>

## 6. Документы

### Cоздание документа

Выбрав пункт бокового меню **Документы**, переходим на экран просмотра списка документов.

<img src="img/1.Connection/1.MenuDocs.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.Docs.jpg" alt="drawing" height="400"/>

По нажатию на иконку " ✚ ", в верхнем правом углу, переходим на экран добавления документа.

Обязательные поля для заполнения: **Номер**, **Дата**, **Тип** и поля в зависимости от типа документа.

Например, 
- для документа **прихода** это поля **Откуда**, **Куда**.

- для документа **инвентаризации** - поле **Место**.

<img src="img/3.Docs/3.DocTypes1.jpg" alt="drawing" height="400"/>  <img src="img/3.Docs/3.AddDocTypes.jpg" alt="drawing" height="400"/>  <img src="img/3.Docs/3.InventoryAdd1.jpg" alt="drawing" height="400"/>

**Поля контактов** (Откуда и Куда) могут быть 3-х типов, которые при необходимости можно менять:
- Подразделение
- Организация
- Сотрудник

<img src="img/3.Docs/3.DocTypes.jpg" alt="drawing" height="400"/>  <img src="img/3.Docs/3.DocTypesOpen.jpg" alt="drawing" height="400"/>  <img src="img/3.Docs/3.To.jpg" alt="drawing" height="400"/>

После заполнения данных документ сохраняем, нажав на иконку " **✓** " в правом верхнем углу.

### Редактирование документа

Отредактировать введенные данные можно двумя способами:
 - нажав на значок <img src="img/1.Connection/1.IconEdit.jpg" alt="drawing" height="22"/> **Редактирование документа** на шапке документа 

<img src="img/3.Docs/3.PrihodView.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodEditDraft.jpg" alt="drawing" height="400"/> 

- или используя пункт меню " **⁝** " **Редактировать данные**.

<img src="img/3.Docs/3.MenuDelDoc.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodEditDraft.jpg" alt="drawing" height="400"/>

Но есть исключения:
- Нельзя выбрать дату меньше текущей, если выбранный тип документа работает только с остатками (например, документ инвентаризации)
- Нельзя изменить тип документа, если в документ уже добавлены товары
- Нельзя изменить тип и значение контакта, по которому выбираются остатки, если в документ уже добавлены товары

<img src="img/3.Docs/3.ErrorDate.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.ErrorDocType.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.ErrorTo.jpg" alt="drawing" height="400"/>

Также, необходимо подчеркнуть, что редакция документа двумя способами возможна, когда документ находится в статусе Черновик (значок <img src="img/1.Connection/1.IconDraft.jpg" alt="drawing" height="22"/> или боковая полоса шапки документа красного цвета).

При статусе **Готов к отправке** (значок <img src="img/1.Connection/1.IconReadyToGo.jpg" alt="drawing" height="22"/> или боковая полоса шапки документа зелёного цвета) это можно сделать, только нажав на значок <img src="img/1.Connection/1.IconEdit.jpg" alt="drawing" height="22"/> **Редактирование документа** на шапке документа.

### Добавление товара

Добавить новую позицию можно двумя способами:
- сканирование штрихкода
- добавление вручную из списка товаров

#### _Сканирование штрихкода_

Уточнение: _если Вы производите сканирование штрихкодов исключительно с помощью камеры устройства, то в настройках приложения необходимо перевести параметр **Использовать сканер** в отрицательное положение._

<img src="img/8.Settings/8.SettingNotScan.jpg" alt="drawing" height="400"/>

Нажимаем на иконку штрихкода <img src="img/10.Scanner/10.IconScanner.jpg" alt="drawing" height="22"/>  в верхнем правом углу и переходим на экран сканирования товара. 

<img src="img/3.Docs/3.PrihodView.jpg" alt="drawing" height="400"/>

Экран сканирования на ТСД:

<img src="img/3.Docs/3.ScanReader.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.ScanReaderOne.png" alt="drawing" height="400"/>

Экран сканирования на мобильном устройстве:

<img src="img/3.Docs/3.Scan.jpg" alt="drawing" height="400"/>

Сканируем штрихкод и переходим на экран позиции документа для ввода количества товара:

<img src="img/3.Docs/3.PrihodGoodLineFour.jpg" alt="drawing" height="400"/>


Кроме количества в позиции документа можно заполнить поле EID, которое используется для хранения DataMatrix кода прослеживаемого товара.

Для этого необходимо нажать на кнопку сканирования <img src="img/10.Scanner/10.IconScanner.jpg" alt="drawing" height="22"> напротив EID и просканировать сам ***DataMatrix код***. Поле заполнится автоматически.

После ввода всех необходимых данных, сохраняем позицию, нажав на иконку " **✓** ".

Если отсканированный штрихкод не найден в справочнике, и если документ работает не только с остатками товаров (например, документ прихода), то в позицию подставится "Неизвестный товар".
При первом добавлении возможно отредактировать его название. При нажатии на иконку <img src="img/1.Connection/1.IconEditUnknown.jpg" alt="drawing" height="20"/> рядом с компонентом имени товара "Неизвестный товар" отрисуется диалоговое окно для ввода. После сохранения и отправки на сервер, этот товар будет приходить как обычный.

<img src="img/3.Docs/3.PrihodGoodLineUnknownZero.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodGoodLineUnknownZeroOne.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodGoodLineUnknownZeroTwo.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodGoodLineUnknownZeroFour.jpg" alt="drawing" height="400"/>

Так выглядит отредактированный "Неизвестный товар" в документе и в списках товаров:

<img src="img/3.Docs/3.PrihodViewUnknow.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodRemainsUnknown.jpg" alt="drawing" height="400"/>

Но если документ работает только с остатками (например, документ инвентаризации), то товар с неизвестным штрихкодом добавить в документ нельзя.

<img src="img/3.Docs/3.ScanNotFound1.jpg" alt="drawing" height="400"/>

#### _Добавление товара вручную_

В меню документа " **⁝** ", расположенном в правом верхнем углу, нажимаем на пункт **Добавить товар**.
Выбираем товар из списка, воспользовавшись строкой поиска<img src="img/1.Connection/1.IconSearch.jpg" alt="drawing" height="22"/>(по названию или штрихкоду) . Далее вводим количество и сохраняем позицию " **✓** ".

<img src="img/3.Docs/3.MenuDelDoc.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodRemains.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodRemainsSearch.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodGoodLineFour.jpg" alt="drawing" height="400"/>

Кроме количества в позиции документа можно заполнить поле EID, которое используется для хранения DataMatrix кода прослеживаемого товара.

Для этого необходимо нажать на кнопку сканирования <img src="img/10.Scanner/10.IconScanner.jpg" alt="drawing" height="22"> напротив EID и просканировать ***DataMatrix код***.

<img src="img/3.Docs/3.PrihodGoodLineFour.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.ScanEID.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.ScanDataMatrix.jpg" alt="drawing" height="400"/>

#### Удаление позиции

Если в экране просмотра документа нажать и удерживать позицию товара, то появится зеленая галочка. Далее необходимо нажать на иконку  <img src="img/1.Connection/1.IconTrash.jpg" alt="drawing" height="22"/> **Мусорная корзина**, и подтвердить желание удалить данную позицию или позиции документа. 

Позиция или позиции будут удалены.

<img src="img/3.Docs/3.PrihodViewGoods.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.DelPositDocTrash.jpg" alt="drawing" height="400"/>

Отменить удаление позиций документа можно:
- нажав на иконку " **×** ", в левом верхнем углу. При этом способе исчезнут все зеленые галочки с выбранных позиций, экран вернется к изначальному состоянию.
- нажав иконку <img src="img/1.Connection/1.IconTrash.jpg" alt="drawing" height="22"/> **Мусорная корзина** и выбрав кнопку **Отмена** в появившемся окне "Уверены, что хотите удалить позиции документа?". При этом способе все зеленые галочки на выбранных позициях останутся на месте, можно продолжить редактировать удаление позиций документа.

<img src="img/3.Docs/3.DelPositDoc3.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.DelPositDocTrash3.jpg" alt="drawing" height="400"/>

### Статус документа

Цвет иконки или боковой полосы шапки документа означает его статус. При смене статуса меняется и цвет.
Имеется 4 основных статуса:

| Статус | Цвет     | Значок| Описание     |
|:--------| -------- |:-------:|------------- |
|Черновик| Красный |<img src="img/1.Connection/1.IconDraft.jpg" alt="drawing" height="22"/>| Новый документ, который можно редактировать|
|Готов к отправке| Зеленый |<img src="img/1.Connection/1.IconReadyToGo.jpg" alt="drawing" height="22"/>| Документ, который можно отправлять на обработку вручную или который, будет отправлен автоматически при включённой автосинхронизации. Нельзя редактировать, но можно вернуть в состояние **Черновик** и отредактировать |
|Отправлен| Желтый|<img src="img/1.Connection/1.IconSent.jpg" alt="drawing" height="22"/>| Документ отправлен, ожидается подтверждение от сервера |
|Обработан успешно| Синий|<img src="img/1.Connection/1.IconProcesSucces.jpg" alt="drawing" height="22"/>| Документ получил подтверждение об успешной обработке на сервере (в случае, если документ обработан с ошибкой, статус меняется вновь на **Черновик** с уточняющей фразой о причине ошибки)  |


### Порядок работы

Вернемся на экран просмотра списка документов, выбрав пункт бокового меню " **≡** " **Документы**.

Чтобы найти документ по наименованию можно воспользоваться строкой поиска, нажав на иконку <img src="img/1.Connection/1.IconSearch.jpg" alt="drawing" height="22"/> **Поиск** в правом верхнем углу экрана.

<img src="img/1.Connection/1.MenuDocs.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.DocsList.jpg" alt="drawing" height="400"/>

При создании документ имеет статус **Черновик** <img src="img/1.Connection/1.IconDraft.jpg" alt="drawing" height="22"/> (красный цвет иконки или боковой полосы шапки документа).

<img src="img/3.Docs/3.DocsListOne.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodRedView.jpg" alt="drawing" height="400"/>

После ввода необходимых данных, чтобы отправить документ на обработку, необходимо поменять признак **Черновик** на признак **Готов к отправке** <img src="img/1.Connection/1.IconReadyToGo.jpg" alt="drawing" height="22"/> (с помощью иконки <img src="img/1.Connection/1.IconAutoTransl.jpg" alt="drawing" height="22"/> или вручную, нажав на значок <img src="img/1.Connection/1.IconEdit.jpg" alt="drawing" height="22"/> на шапке документа)

<img src="img/3.Docs/3.DocsListEnter.jpg" alt="drawing" height="400"/> или <img src="img/3.Docs/3.DocsLisEdit.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.DocTypesOpenNew.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodEditReadyNew.jpg" alt="drawing" height="400"/>

Есть два способа отправки документа на сервер:
- отправить на сервер ОДИН документ, для этого нажать на иконку <img src="img/1.Connection/1.IconSend.jpg" alt="drawing" height="22"/> **Отправка документа**, находящуюся над шапкой документа.
- оставить документ в состоянии **Готов к отправке** <img src="img/1.Connection/1.IconReadyToGo.jpg" alt="drawing" height="22"/> (переведенный в это состояние с помощью иконки <img src="img/1.Connection/1.IconAutoTransl.jpg" alt="drawing" height="22"/> или вручную, с помощью <img src="img/1.Connection/1.IconEdit.jpg" alt="drawing" height="22"/> на шапке документа) и перейти к работе с другими документами, а данный будет отправлен на сервер при ручной или автоматической синхронизации.

Когда документ перейдет в состояние **Готов к отправке** <img src="img/1.Connection/1.IconReadyToGo.jpg" alt="drawing" height="22"/> (зеленый цвет иконки или боковой полосы шапки документа) - его данные редактировать уже нельзя. Но, пока документ не отправлен, его можно вернуть из статуса **Готов к отправке** в статус **Черновик** и отредактировать данные.

<img src="img/3.Docs/3.DocsReady.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.DocPrihod.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.PrihodEditReadyNew.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.DocsDraft.jpg" alt="drawing" height="400"/> 

Чтобы отправить ВСЕ документы со статусом **Готов к отправке** на сервер из экрана **Документы**, необходимо нажать на кнопку  <img src="img/1.Connection/1.Sync.jpg" alt="drawing" height="22"/> **Синхронизировать** в боковом меню (открыть боковое меню можно нажатием на иконку меню " **≡** ", находящуюся в верхнем углу приложения слева, или смахнув пальцем вправо с левого края устройства). Или дождаться выполнения автосинхронизации и автоматической отправки всех документов со статусом **Готов к отправке**.

После отправки документ перейдет в статус **Отправлен** <img src="img/1.Connection/1.IconSent.jpg" alt="drawing" height="22"/>(желтый цвет иконки или боковой полосы шапки документа).

<img src="img/3.Docs/3.DocsSent.jpg" alt="drawing" height="400"/>

После автоматической или ручной синхронизации документ получит подтверждение об успешной обработке на сервере и вернётся, а цвет иконки станет синим <img src="img/1.Connection/1.IconProcesSucces.jpg" alt="drawing" height="22"/> . В случае, если документ обработан с ошибкой, его статус возвращается в **Черновик** с уточняющей фразой о причине ошибки (например, у компании задолженность более 30 дней).

<img src="img/3.Docs/3.DocsProcessed3.jpg" alt="drawing" height="400"/>

### Удаление документа

Для удаления нужно нажать на необходимый документ и удерживать его, на выбранной позиции появится зеленая галочка, которая выделит данный документ среди прочих. Далее необходимо нажать иконку **Мусорная корзина** и подтвердить намерение удалить документ. Документ удаляется. 

<img src="img/3.Docs/3.DelDoc.jpg" alt="drawing" height="400"/>

Так же, когда документ находится в статусе **Черновик**, его можно удалить используя пункты меню " **⁝** " .

<img src="img/3.Docs/3.MenuDelDoc.jpg" alt="drawing" height="400"/>

Используя пункты меню " **⁝** ", расположенную в правом верхнем углу экрана **Документ** возможно: 
- перейти на редактирование шапки документа (если статус **Черновик**)
- удалить документ (если статус **Черновик**)
- добавить товар

Отменить удаление документа можно:
- нажав на иконку " **×** ", в левом верхнем углу. Исчезнут все зеленые галочки с выбранных позиций, экран **Документы** вернется к изначальному состоянию.
- нажав иконку **Мусорная корзина** выбрать кнопку **Отмена** в появившемся окне "Уверены, что хотите удалить позиции документа?". При этом все зеленые галочки на выбранных позициях останутся на месте, можно продолжить удаление необходимых документов.

### Фильтры

Для удобства просмотра на экране документов можно использовать фильтры и сортировку:
- фильтр по типу документа
- фильтр по статусу документа
- сортировка по дате

<img src="img/3.Docs/3.SortDocTypes.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.SortStatus.jpg" alt="drawing" height="400"/> <img src="img/3.Docs/3.SortDate.jpg" alt="drawing" height="400"/>

| Фильтр по статусу | Описание                                                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Все             | Все документы                                                                                                                                    |
| Активные        | Все документы, кроме тех, которые уже обработаны на сервере (со статусом **Черновик**, **Готов к отправке**, **Отправлен**).                                                                |
| Черновик           | Документы со статусом **Черновик**|
| Готово           | Документы со статусом **Готов к отправке**|
| Отправлено           | Документы со статусом **Отправлен**|
| Обработано           | Документы со статусом **Обработан успешно**|

## 7. Профиль

Экран **Профиль** содержит информацию о пользователе и об устройстве. 

При выходе из демо режима, кнопка **Выйти из демо режима** меняется на **Сменить пользователя**. 

<img src="img/9.Profile/9.ProfileDemo.jpg" alt="drawing" height="400"/>

Также здесь можно выйти из учетной записи пользователя, нажав на кнопку **Сменить пользователя**.

<img src="img/9.Profile/9.Profile.jpg" alt="drawing" height="400"/> 

Этот экран позволяет: 

|  Параметр   |  Описание |
| :------- | :-------- |
| **Выйти и удалить все данные** | Удаление учетной записи пользователя, всех документов, справочников и настроек из мобильного устройства |
| **Удалить все справочники и документы**  | Удаление всех документов, справочников из мобильного устройства   |
| **Удалить настройки пользователя**   | Удаление настроек пользователя, которые могут приходить из ERP системы |


Для этого необходимо нажать на иконку меню " **⁝** ", расположенную в правом верхнем углу, и выбрать пункт, соответственно необходимости.

 <img src="img/9.Profile/9.ClearData.jpg" alt="drawing" height="400"/> 

Если параметр "Не выходить из профиля" отключен, то при каждом новом открытии приложения необходимо будет вновь вводить данные пользователя.

<img src="img/9.Profile/9.ProfileNotUser.jpg" alt="drawing" height="400"/> <img src="img/1.Connection/1.Login.jpg" alt="drawing" height="400"/>

## 8. Сканирование

Уточнение: **если вы производите сканирование штрихкодов исключительно с помощью камеры мобильного устройства, то в настройках приложения необходимо перевести параметр ***Использовать сканер*** в отрицательное положение.**

С помощью сканера можно распознавать и линейные штрихккоды, и двухмерные.

Вернемся на экран списка документов сканирования, выбрав пункт бокового меню **Сканирование** (открыть боковое меню можно нажатием на иконку меню " **≡** ", находящуюся в верхнем углу приложения слева, или смахнув пальцем вправо с левого края устройства).

<img src="img/10.Scanner/10.MenuScan.jpg" alt="drawing" height="400"/> <img src="img/10.Scanner/10.Scan.jpg" alt="drawing" height="400"/>

Чтобы найти документ по наименованию можно воспользоваться строкой поиска, нажав на иконку <img src="img/1.Connection/1.IconSearch.jpg" alt="drawing" height="22"/>  **Поиск** в правом верхнем углу экрана.

По нажатию иконки " ✚ ", в верхнем правом углу, переходим на экран добавления документа. При создании документ имеет статус Черновик. Заполняем необходимые поля - **Номер, Дата, Подразделение** (Комментарий - поле, не обязательное для заполнения) и сохраняем документ, нажав на иконку 
**✓**.

<img src="img/10.Scanner/10.ScanCreateDoc.jpg" alt="drawing" height="400"/>

Отредактировать введенные данные можно, нажав на шапку документа <img src="img/1.Connection/1.IconEdit.jpg" alt="drawing" height="22"/> или используя пункт меню " **⁝** " **Редактировать данные**.

<img src="img/10.Scanner/10.ScanDoc.jpg" alt="drawing" height="400"/> <img src="img/10.Scanner/10.ScanEditDoc.jpg" alt="drawing" height="400"/>

Нажимаем на иконку штрихкода <img src="img/10.Scanner/10.IconScanner.jpg" alt="drawing" height="22"/> в верхнем правом углу и переходим на экран сканирования товара.


Для удобства работы во время сканирования можно использовать кнопки **Вспышка** <img src="img/1.Connection/1.IconFlash.jpg" alt="drawing" height="22"/>  или **Вибрация**  <img src="img/1.Connection/1.IconVibr.jpg" alt="drawing" height="22"/>.


<img src="img/10.Scanner/10.ScanDoc.jpg" alt="drawing" height="400"/> <img src="img/10.Scanner/10.ScreenScan.jpg" alt="drawing" height="400"/>

Возможно ввести вручную штрихкод, нажав на иконку <img src="img/1.Connection/1.IconScreenCod.jpg" alt="drawing" height="22"/> сверху справа.

 <img src="img/10.Scanner/10.ScanCod.jpg" alt="drawing" height="400"/>
 
 Сканируем штрихкод, нажимаем на нужную кнопку (**Пересканировать** или **Штрихкод**) и продолжаем сканирование необходимое число раз. 

<img src="img/10.Scanner/10.ScanBattons.jpg" alt="drawing" height="400"/> <img src="img/10.Scanner/10.DocWithScans.jpg" alt="drawing" height="400"/> 

Редактирование введенного штрихкода возможно только ввиде удаления, и только последнего скана. Сделать это можно через меню документа " **⁝** ", расположенном в правом верхнем углу, нажав на пункт **Отменить последнее сканирование**. 

<img src="img/10.Scanner/10.ScanEditDoc.jpg" alt="drawing" height="400"/>

После ввода необходимых данных, этот документ можно отправить на обработку тремя способами:

* в документе необходимо вручную поменять признак **Черновик**  на признак **Готов к отправке** с помощью значка <img src="img/1.Connection/1.IconEdit.jpg" alt="drawing" height="22"/> в шапке документа. Шапка документа изменит цвет с красного <img src="img/1.Connection/1.IconDraft.jpg" alt="drawing" height="22"/> на зелёный <img src="img/1.Connection/1.IconReadyToGo.jpg" alt="drawing" height="22"/>. Далее нажать на значок <img src="img/1.Connection/1.IconSend.jpg" alt="drawing" height="22"/> и документ отправится на сервер. Шапка документа изменит цвет на жёлтый <img src="img/1.Connection/1.IconSent.jpg" alt="drawing" height="22"/> (статус **Отправлен**).

* Нажать на значок <img src="img/1.Connection/1.IconAutoTransl.jpg" alt="drawing" height="22"/>. Иконка документа изменится с красной <img src="img/1.Connection/1.IconDraft.jpg" alt="drawing" height="22"/> на зелёную <img src="img/1.Connection/1.IconReadyToGo.jpg" alt="drawing" height="22"/>. Далее или дождаться выполнения автосинхронизации и автоматической отправки всех документов со статусом **Готов к отправке**, или нажать на значок <img src="img/1.Connection/1.IconSend.jpg" alt="drawing" height="22"/> и документ отправится на сервер. Иконка документа изменит цвет на жёлтый <img src="img/1.Connection/1.IconSent.jpg" alt="drawing" height="22"/>.

* нажать на значок <img src="img/1.Connection/1.IconSend.jpg" alt="drawing" height="22"/>, находящийся над шапкой документа, который автоматически переведёт признак с **Черновик** <img src="img/1.Connection/1.IconDraft.jpg" alt="drawing" height="22"/> на **Готов к отправке** и отправит документ на обработку <img src="img/1.Connection/1.IconSent.jpg" alt="drawing" height="22"/>.

## 9. О программе
### Документация
На экране **О программе** можно узнать информацию о приложении и о контактных данных разработчика, а перейдя по ссылке **Документация** ознакомиться с полным функционалом приложения. 

<img src="img/11.About/11.About.jpg" alt="drawing" height="400"/> <img src="img/11.About/11.Documentation.jpg" alt="drawing" height="400"/>

### Журнал ошибок

Если во время синхронизации программы и сервера произошли ошибки, то программа выдаст окно с надписью **"Закончено с ошибками"**. Чтобы их просмотреть, необходимо нажать на кнопку **Просмотреть ошибки**, а чтобы вернуться обратно в список выполненных действий, необходимо нажать на кнопку **Просмотреть операции**. Все ошибки будут сохраняться в **Журнале ошибок**, который можно просмотреть, и будут передаваться на сервер для анализа. 

<img src="img/11.About/11.EddWithError.jpg" alt="drawing" height="400"/> <img src="img/11.About/11.EddWithErrorTwo.jpg" alt="drawing" height="400"/> <img src="img/11.About/11.LogError.jpg" alt="drawing" height="400"/> 

Очистить **Журнал ошибок** можно через меню документа " **⁝** ", расположенное в правом верхнем углу, нажав на пункт **Удалить историю ошибок**.

<img src="img/11.About/11.DelLogError.jpg" alt="drawing" height="400"/>


## 10. Значение иконок

| Иконка | Описание      |
| :---------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|<img src="img/1.Connection/1.IconDraft.jpg" alt="drawing" height="22"/>| _статус **Черновик**_, новый документ, который можно редактировать|
|<img src="img/1.Connection/1.IconReadyToGo.jpg" alt="drawing" height="22"/>   | _статус **Готов к отправке**_, документ нельзя редактировать, но можно вернуть в статус **Черновик**   |
|<img src="img/1.Connection/1.IconSent.jpg" alt="drawing" height="22"/>    | _статус **Отправлен**_, документ отправлен, ожидается подтверждение     |
|<img src="img/1.Connection/1.IconProcesSucces.jpg" alt="drawing" height="22"/>    | _статус **Обработан успешно**_, документ получил подтверждение об успешной обработке на сервере   |
|<img src="img/1.Connection/1.IconAutoTransl.jpg" alt="drawing" height="22"/> | перевод документа из статуса **Черновик** в статус **Готов к отправке** |
| <img src="img/1.Connection/1.IconSend.jpg" alt="drawing" height="22"/>            | отправка документа   |
| <img src="img/1.Connection/1.IconEdit.jpg" alt="drawing" height="22"/>  | редактирование документа   |
| <img src="img/1.Connection/1.IconSearch.jpg" alt="drawing" height="22"/> | поиск|
|<img src="img/1.Connection/1.IconScreenCod.jpg" alt="drawing" height="22"/>| поиск товара в остатках|
| <img src="img/10.Scanner/10.IconScanner.jpg" alt="drawing" height="22">  | сканирование штрихкода|
| <img src="img/1.Connection/1.Sync.jpg" alt="drawing" height="22"/>       | синхронизация|
| <img src="img/1.Connection/1.ConfigIcon.png" alt="drawing" height="22"/> | переход на экран настроек|
| <img src="img/1.Connection/1.IconTrash.jpg" alt="drawing" height="22"/>  | удаление документа|
|<img src="img/7.Remains/7.IconFiltr.jpg" alt="drawing" height="20"/>      | фильтр 
| <img src="img/1.Connection/1.IconFlash.jpg" alt="drawing" height="22">   | вспышка выключена|
| <img src="img/1.Connection/1.IconVibr.jpg" alt="drawing" height="22"/>   | вибрация выключена|
|<img src="img/1.Connection/1.IconEditUnknown.jpg" alt="drawing" height="20"/>|pедактированиe названия неизвестного товара    |
| **✓**     | сохранить|
| **≡**     | меню документа |
| ✚         | добавление нового документа|
| **⁝**      | меню документа|


