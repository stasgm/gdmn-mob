import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';

import api from '@lib/client-api';

import Constants from 'expo-constants';

import { useDispatch, useSelector, documentActions, referenceActions, messageActions } from '@lib/store';

import { BodyType, IDocument, IMessage, IReferences } from '@lib/types';
import { useRefThunkDispatch } from '@lib/store/src/references/actions.async';
import { useDocThunkDispatch } from '@lib/store/src/documents/actions.async';

interface ICutsomProps {
  onSync?: () => void;
  syncing?: boolean;
}

type Props = DrawerContentComponentProps<DrawerContentOptions> & ICutsomProps;

export function DrawerContent({ onSync, syncing, ...props }: Props) {
  const { colors } = useTheme();

  const { user, company } = useSelector((state) => state.auth);
  const refDispatch = useRefThunkDispatch();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);

  const handleProccess = useCallback(async (msg: IMessage) => {
    if (!msg) {
      return;
    }

    switch (msg.body.type as BodyType) {
      case 'CMD':
        //TODO: обработка
        break;

      case 'REFS':
        //TODO: проверка данных, приведение к типу
        dispatch(referenceActions.updateList(msg.body.payload as IReferences));
        dispatch(messageActions.updateStatusMessage({ id: msg.id, status: 'PROCESSED' }));
        break;

      case 'DOCS':
        //TODO: проверка данных, приведение к типу
        dispatch(documentActions.setDocuments(msg.body.payload as IDocument[]));
        dispatch(messageActions.updateStatusMessage({ id: msg.id, status: 'PROCESSED' }));
        break;

      default:
        Alert.alert('Предупреждение!', 'Неизвестный тип сообщения', [{ text: 'Закрыть' }]);
        break;
    }
  }, []);

  const handleUpdate = async () => {
    if (!company || !user) {
      return;
    }

    // Загрузка данных
    if (onSync) {
      // Если передан внешний обработчик то вызываем
      return onSync();
    }

    /*
      Поддержка платформы:
      - загрузка сообщений
      - обработка сообщение
    */
    setLoading(true);

    console.log('111');

    const messageSendDoc: IMessage['body'] = {
      type: 'DOCS',
      payload: applDocuments,
    };

    await api.message.sendMessages(
      'gdmn-appl-request',
      { id: company.id, name: company.name },
      { id: '1425a8c0-f142-11eb-8521-edeb717198b0', name: 'gdmn' },
      messageSendDoc,
    );

    const mes = await api.message.getMessages({ systemName: 'gdmn-appl-request', companyId: company.id });

    console.log('222');

    if (mes.type === 'GET_MESSAGES') {
      console.log('333');
      await refDispatch(referenceActions.clearReferences());
      await docDispatch(documentActions.clearDocuments());

      console.log('444');
      mes.messageList?.forEach((message) => {
        console.log('555', message.body.type);
        handleProccess(message);
      });
    } else if (mes.type === 'ERROR') {
      Alert.alert('Ошибка!', mes.message, [{ text: 'Закрыть' }]);
      return;
    }

    const messageGetRef: IMessage['body'] = {
      type: 'CMD',
      payload: {
        name: 'GET_REF',
        params: { data: ['Employees', 'Statuses', 'DocTypes'] },
      },
    };

    const db = new Date();
    const de = new Date();
    de.setDate(de.getDate() + 1);

    const messageGetDoc: IMessage['body'] = {
      type: 'CMD',
      payload: {
        name: 'GET_DOCUMENTS',
        params: [
          {
            dateBegin: db.toISOString(),
            dateEnd: de.toISOString(),
            documentType: {
              id: '168063006',
              name: 'Заявки на закупку ТМЦ',
            },
          },
        ],
      },
    };

    await api.message.sendMessages(
      'gdmn-appl-request',
      { id: company.id, name: company.name },
      { id: '1425a8c0-f142-11eb-8521-edeb717198b0', name: 'gdmn' },
      messageGetRef,
    );

    await api.message.sendMessages(
      'gdmn-appl-request',
      { id: company.id, name: company.name },
      { id: '1425a8c0-f142-11eb-8521-edeb717198b0', name: 'gdmn' },
      messageGetDoc,
    );

    setLoading(false);
  };

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
        <TouchableOpacity disabled={syncing || isLoading} onPress={handleUpdate}>
          <Avatar.Icon size={50} icon="cloud-refresh" />
        </TouchableOpacity>
        <View style={styles.updateSection}>
          <Caption style={styles.caption}>{syncing || isLoading ? 'загрузка данных...' : ''}</Caption>
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

// Документы Appl
export const applDocuments = [
  {
    id: '172846156',
    number: '104',
    documentDate: '2021-06-07',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Текущий ремонт зерноуборочных комбайнов',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '170039555',
        name: '"Комбаин з/у КЗС-1218 -03 """"Палессе"""""',
      },
      faGoodNumber: '13316',
      cancelReason: 'Текущий ремонт ЧЕГО????',
    },
    lines: [
      {
        id: '172846487',
        orderNum: 1,
        goodName: '30.01.2199 Амортизатор маховика',
        quantity: 200,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174360229',
    number: '473',
    documentDate: '2021-06-07',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим Вас закупить данный компрессор на трактор который задействован на внесении минеральных удобрений.',
      sysApplicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      applicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '151911169',
        name: 'ТРАКТОР БЕЛАРУС-1221.2',
      },
      faGoodNumber: '701442',
    },
    lines: [
      {
        id: '174361484',
        orderNum: 1,
        goodName: 'Компрессор Д-260 А29.05.000 БЗА',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
];
