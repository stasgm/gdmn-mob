import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { IReferences } from '@lib/types';
import { useSelector, messageActions, referenceActions, documentActions, useDispatch } from '@lib/store';
import { AppScreen, BackButton, MenuButton, SubTitle, useActionSheet, globalStyles as styles } from '@lib/mobile-ui';

type MessagesStackParamList = {
  Messages: undefined;
  MessageView: { id: string };
};

const MessageViewScreen = () => {
  //const { data } = useSelector((state) => state.messages);
  const { colors } = useTheme();
  const id = useRoute<RouteProp<MessagesStackParamList, 'MessageView'>>().params?.id;
  const msg = useSelector((state) => state.messages).data.find((item) => item.id === id);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const showActionSheet = useActionSheet();

  const handleTransform = useCallback(async () => {
    if (!msg) {
      return;
    }

    switch (msg.body.type) {
      case 'cmd':
        //TODO: обработка
        break;

      case 'refs':
        //TODO: проверка данных, приведение к типу
        dispatch(referenceActions.updateList(msg.body.payload as IReferences));
        dispatch(messageActions.updateStatusMessage({ id: msg.id, newStatus: 'procd' }));
        break;

      case 'docs':
        //TODO: проверка данных, приведение к типу
        dispatch(documentActions.setDocuments(msg.body.payload));
        dispatch(messageActions.updateStatusMessage({ id: msg.id, newStatus: 'procd' }));
        break;

      default:
        Alert.alert('Предупреждение!', 'Неизвестный тип сообщения', [{ text: 'Закрыть' }]);
        break;
    }
  }, []);

  const handleDelete = useCallback(() => {
    if (msg) {
      dispatch(messageActions.deleteMessage(msg.id));
      navigation.goBack();
    }
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Обработать',
        onPress: handleTransform,
      },
      {
        title: 'Удалить',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleTransform, handleDelete, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  if (!msg) {
    return (
      <AppScreen>
        <SubTitle style={styles.title}>Сообщение не найдено</SubTitle>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={styles.contentTop}>
      <View>
        <View>
          <Text style={[styles.textBold, styles.title]}>Заголовок</Text>
          <Divider />
          <Text style={styles.name}>Система:</Text>
          <Text style={styles.field}>{msg.head.appSystem}</Text>
          <Text style={styles.name}>Компания:</Text>
          <Text style={styles.field}>{msg.head.company.name}</Text>
          <Text style={styles.name}>Дата и время:</Text>
          <Text style={[styles.number, styles.field]}>{new Date(msg.head.dateTime).toLocaleString()}</Text>
          <Text style={styles.name}>Тип:</Text>
          <Text style={[styles.number, styles.field]}>{msg.body.type}</Text>
          <Text style={[styles.textBold, styles.title]}>Стороны</Text>
          <Divider />
          <Text style={styles.name}>Отправитель:</Text>
          <Text style={[styles.number, styles.field]}>{msg.head.consumer.name}</Text>
          <Text style={styles.name}>Получатель:</Text>
          <Text style={[styles.number, styles.field]}>{msg.head.producer.name}</Text>
          <Text style={[styles.textBold, styles.title]}>Содержимое</Text>
          <Divider />
          <Text style={styles.field}>
            {typeof msg.body.payload !== 'object' ? msg.body.payload.toString() : '[данные]'}
          </Text>
        </View>
      </View>
    </AppScreen>
  );
};

export default MessageViewScreen;

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
    margin: 20,
    position: 'relative',
  },
  details: {
    margin: 8,
    marginRight: 0,
    flex: 1,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fabAdd: {},
  field: {
    flexDirection: 'row',
  },
  fieldAdress: {},
  fieldDate: {
    alignItems: 'flex-end',
  },
  fieldSystem: {},
  fieldText: {},
  fieldType: {},
  fontBold: {
    fontWeight: 'bold',
  },
  viewType: {},
});
 */
