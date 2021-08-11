import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Constants from 'expo-constants';
import { useSelector } from '@lib/store';

interface ICutsomProps {
  onSync?: () => void;
  syncing?: boolean;
}

type Props = DrawerContentComponentProps<DrawerContentOptions> & ICutsomProps;

export function DrawerContent({ onSync, syncing, ...props }: Props) {
  const { colors } = useTheme();
  const { loading, errorList } = useSelector((state) => state.app);
  const { user, company } = useSelector((state) => state.auth);

  // const handleUpdate = async () => {
  //   const isLoading = useSync({ systemName: 'gdmn-appl-request', consumer: { id: 'gdmn', name: 'gdmn' }, onSync });

  //   setLoading(isLoading);
  // };

  //const { list: documents } = useSelector((state) => state.documents);

  // const refDispatch = useRefThunkDispatch();
  // const docDispatch = useDocThunkDispatch();

  // const [isLoading, setLoading] = useState(false);

  // const processMessage = useCallback(async (msg: IMessage) => {
  //   if (!msg) {
  //     return;
  //   }

  //   switch (msg.body.type as BodyType) {
  //     case 'CMD':
  //       //TODO: обработка
  //       break;

  //     case 'REFS': {
  //       //TODO: проверка данных, приведение к типу
  //       const clearRefResponse = await refDispatch(referenceActions.clearReferences());

  //       if (clearRefResponse.type === 'REFERENCES/CLEAR_REFERENCES_FAILURE') {
  //         break;
  //       }

  //       const setRefResponse = await refDispatch(referenceActions.setReferences(msg.body.payload as IReferences));

  //       //Если удачно сохранились справочники, удаляем сообщение в json
  //       if (setRefResponse.type === 'REFERENCES/SET_ALL_SUCCESS') {
  //         await api.message.removeMessage(msg.id);
  //       }
  //       //dispatch(messageActions.updateStatusMessage({ id: msg.id, status: 'PROCESSED' }));
  //       break;
  //     }

  //     case 'DOCS': {
  //       const setDocResponse = await docDispatch(documentActions.setDocuments(msg.body.payload as IDocument[]));

  //       //Если удачно сохранились документы, удаляем сообщение в json
  //       if (setDocResponse.type === 'DOCUMENTS/SET_ALL_SUCCESS') {
  //         await api.message.removeMessage(msg.id);
  //       }
  //       //dispatch(messageActions.updateStatusMessage({ id: msg.id, status: 'PROCESSED' }));
  //       break;
  //     }

  //     default:
  //       Alert.alert('Предупреждение!', 'Неизвестный тип сообщения', [{ text: 'Закрыть' }]);
  //       break;
  //   }
  // }, []);

  // const processMessages = async (arr: IMessage[]) => {
  //   arr?.forEach((message) => {
  //     processMessage(message);
  //   });
  // };

  // const handleUpdate = async () => {
  //   if (!company || !user) {
  //     return;
  //   }

  //   // Загрузка данных
  //   if (onSync) {
  //     // Если передан внешний обработчик то вызываем
  //     return onSync();
  //   }

  //   /*
  //     Поддержка платформы:
  //     - загрузка сообщений
  //     - обработка сообщение
  //   */
  //   setLoading(true);

  //   const docForSending = documents.filter((doc) => doc.status === 'READY');

  //   if (docForSending.length) {
  //     //Формируем сообщение с документами со статусом 'READY'
  //     const messageSendDoc: IMessage['body'] = {
  //       type: 'DOCS',
  //       payload: docForSending,
  //     };

  //     //1. Отправляем документы
  //     const sendDocMessage = await api.message.sendMessages(
  //       'gdmn-appl-request',
  //       { id: company.id, name: company.name },
  //       { id: '1425a8c0-f142-11eb-8521-edeb717198b0', name: 'gdmn' },
  //       messageSendDoc,
  //     );

  //     //Если документы отправлены успешно, то меняем статус документов на 'SENT'
  //     if (sendDocMessage.type === 'SEND_MESSAGE') {
  //       await docDispatch(
  //         documentActions.setDocuments(documents.map((d) => (d.status === 'READY' ? { ...d, status: 'SENT' } : d))),
  //       );
  //     }
  //   }

  //   //2. Получаем все сообщения для мобильного
  //   const getMessagesResponse = await api.message.getMessages({
  //     systemName: 'gdmn-appl-request',
  //     companyId: company.id,
  //   });

  //   //Если сообщения получены, то
  //   //  справочники: очищаем старые и записываем в хранилище новые данные
  //   //  документы: добавляем новые, а старые заменеям только если был статус 'DRAFT'
  //   if (getMessagesResponse.type === 'GET_MESSAGES') {
  //     await processMessages(getMessagesResponse.messageList);
  //   } else if (getMessagesResponse.type === 'ERROR') {
  //     Alert.alert('Ошибка!', getMessagesResponse.message, [{ text: 'Закрыть' }]);
  //     return;
  //   }

  //   //Формируем запрос на получение справочников для следующего раза
  //   const messageGetRef: IMessage['body'] = {
  //     type: 'CMD',
  //     payload: {
  //       name: 'GET_REF',
  //     },
  //   };

  //   //Формируем запрос на получение документов для следующего раза
  //   const messageGetDoc: IMessage['body'] = {
  //     type: 'CMD',
  //     payload: {
  //       name: 'GET_DOCUMENTS',
  //     },
  //   };

  //   //3. Отправляем запрос на получение справочников
  //   await api.message.sendMessages(
  //     'gdmn-appl-request',
  //     { id: company.id, name: company.name },
  //     { id: '1425a8c0-f142-11eb-8521-edeb717198b0', name: 'gdmn' },
  //     messageGetRef,
  //   );

  //   //4. Отправляем запрос на получение документов
  //   await api.message.sendMessages(
  //     'gdmn-appl-request',
  //     { id: company.id, name: company.name },
  //     { id: '1425a8c0-f142-11eb-8521-edeb717198b0', name: 'gdmn' },
  //     messageGetDoc,
  //   );

  //   setLoading(false);
  // };

  const translateX = Animated.interpolateNode(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <>
      <View style={styles.userProfile}>
        <View style={styles.userInfoSection}>
          <TouchableOpacity onPress={props.navigation.toggleDrawer}>
            <Avatar.Icon size={50} icon="badge-account-horizontal-outline" />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Title style={styles.title}>{user?.firstName}</Title>
            <Title style={styles.title}>{user?.lastName}</Title>
          </View>
        </View>
        <Caption style={styles.caption}>{company?.name || ''}</Caption>
      </View>
      <Divider />
      <DrawerContentScrollView {...props}>
        <Animated.View
          style={[
            styles.drawerContent,
            {
              backgroundColor: colors.surface,
              transform: [{ translateX }],
            },
          ]}
          pointerEvents={loading ? 'none' : 'auto'}
        >
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItemList {...props} />
          </Drawer.Section>
          {/*  <Drawer.Section title="Preferences">
            <TouchableRipple
              onPress={() => {
                // toggleTheme();
              }}
            >
              <View style={styles.preference}>
                <Text style={styles.text}>Тёмная тема</Text>
                <View pointerEvents="none">
                  <Switch value={theme === 'dark'} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section> */}
        </Animated.View>
      </DrawerContentScrollView>
      {/* <Divider /> */}
      <View style={styles.systemInfo}>
        <TouchableOpacity disabled={loading} onPress={onSync}>
          <Avatar.Icon size={50} icon="cloud-refresh" />
        </TouchableOpacity>
        <View style={styles.updateSection}>
          <Caption style={styles.caption}>{loading ? 'Синхронизация данных...' : ''}</Caption>
          <Caption style={styles.caption}>
            Версия программы: {Constants.manifest?.extra?.appVesion}-{Constants.manifest?.extra?.buildVersion || 0}
          </Caption>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfile: {
    marginTop: 15,
    flexDirection: 'column',
  },
  profileInfo: {
    paddingLeft: 10,
    paddingTop: 0,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  text: {
    padding: 2,
  },
  caption: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 14,
  },
  updateSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingBottom: 5,
  },
  systemInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  drawerSection: {
    marginTop: 0,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

// // Документы Appl
// export const applDocuments = [
//   {
//     id: '172846156',
//     number: '104',
//     documentDate: '2021-06-07',
//     documentType: {
//       id: '168063006',
//       name: 'Заявки на закупку ТМЦ',
//     },
//     status: 'DRAFT',
//     head: {
//       applStatus: {
//         id: '168062979',
//         name: 'Согласован инженерной службой',
//       },
//       purchaseType: {
//         id: '168353581',
//         name: 'Механизация',
//       },
//       dept: {
//         id: '169853581',
//         name: 'СХЦ Новополесский-Агро',
//       },
//       purpose: {
//         id: '168353581',
//         name: 'Механизация',
//       },
//       justification: 'Текущий ремонт зерноуборочных комбайнов',
//       sysApplicant: {
//         id: '169967847',
//         name: 'Андрухович Александр Михайлович',
//       },
//       applicant: {
//         id: '169967847',
//         name: 'Андрухович Александр Михайлович',
//       },
//       specPreAgree: {
//         id: '151211855',
//         name: 'Самусевич Александр Николаевич',
//       },
//       specAgreeEngin: {
//         id: '149876722',
//         name: 'Реут Валерий Валентинович',
//       },
//       verificationDate: '2021-06-21',
//       faGood: {
//         id: '170039555',
//         name: '"Комбаин з/у КЗС-1218 -03 """"Палессе"""""',
//       },
//       faGoodNumber: '13316',
//       cancelReason: 'Текущий ремонт ЧЕГО????',
//     },
//     lines: [
//       {
//         id: '172846487',
//         orderNum: 1,
//         goodName: '30.01.2199 Амортизатор маховика',
//         quantity: 200,
//         value: {
//           id: '3000001',
//           name: 'шт.',
//         },
//       },
//     ],
//   },
//   {
//     id: '174360229',
//     number: '473',
//     documentDate: '2021-06-07',
//     documentType: {
//       id: '168063006',
//       name: 'Заявки на закупку ТМЦ',
//     },
//     status: 'DRAFT',
//     head: {
//       applStatus: {
//         id: '168062979',
//         name: 'Согласован инженерной службой',
//       },
//       purchaseType: {
//         id: '168353581',
//         name: 'Механизация',
//       },
//       dept: {
//         id: '147095763',
//         name: 'СХЦ "Величковичи"',
//       },
//       purpose: {
//         id: '168353581',
//         name: 'Механизация',
//       },
//       justification:
//         'Просим Вас закупить данный компрессор на трактор который задействован на внесении минеральных удобрений.',
//       sysApplicant: {
//         id: '153741215',
//         name: 'Игнашевич Сергей  Васильевич',
//       },
//       applicant: {
//         id: '153741215',
//         name: 'Игнашевич Сергей  Васильевич',
//       },
//       specPreAgree: {
//         id: '151211855',
//         name: 'Самусевич Александр Николаевич',
//       },
//       specAgreeEngin: {
//         id: '149876722',
//         name: 'Реут Валерий Валентинович',
//       },
//       verificationDate: '2021-06-21',
//       faGood: {
//         id: '151911169',
//         name: 'ТРАКТОР БЕЛАРУС-1221.2',
//       },
//       faGoodNumber: '701442',
//     },
//     lines: [
//       {
//         id: '174361484',
//         orderNum: 1,
//         goodName: 'Компрессор Д-260 А29.05.000 БЗА',
//         quantity: 1,
//         value: {
//           id: '3000001',
//           name: 'шт.',
//         },
//       },
//     ],
//   },
// ];
