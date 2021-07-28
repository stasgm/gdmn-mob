import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Divider } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { BodyType, IDocument, IReferences } from '@lib/types';
import { messageActions, referenceActions, documentActions, useDispatch, messageSelectors } from '@lib/store';
import { AppScreen, BackButton, MenuButton, SubTitle, useActionSheet, globalStyles as styles } from '@lib/mobile-ui';

type MessagesStackParamList = {
  Messages: undefined;
  MessageView: { id: string };
};

const MessageViewScreen = () => {
  //const { data } = useSelector((state) => state.messages);
  const id = useRoute<RouteProp<MessagesStackParamList, 'MessageView'>>().params?.id;
  const msg = messageSelectors.selectById(id);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const showActionSheet = useActionSheet();

  const handleProccess = useCallback(async () => {
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

  const handleDelete = useCallback(() => {
    if (msg) {
      dispatch(messageActions.removeMessage(msg.id));
      navigation.goBack();
    }
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Обработать',
        onPress: handleProccess,
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
  }, [handleProccess, handleDelete, showActionSheet]);

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
            {typeof msg.body.payload !== 'object' ? (msg.body.payload as any).toString() : '[данные]'}
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
