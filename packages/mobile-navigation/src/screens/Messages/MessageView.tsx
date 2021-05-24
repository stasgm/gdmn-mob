import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';

import { useSelector, messageActions, referenceActions, documentActions, useDispatch } from '@lib/store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { IDocument, IReference } from '@lib/types';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';

import MenuButton from '@lib/mobile-ui/src/components/AppBar/MenuButton';
import BackButton from '@lib/mobile-ui/src/components/AppBar/BackButton';

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
        dispatch(documentActions.updateList(msg.body.payload as IDocument[]));
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
        title: 'Загрузить',
        // onPress: handleLoad,
      },
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

  return msg ? (
    <>
      <View style={styles.container}>
        <Text style={styles.fieldSystem}>
          {msg.head.appSystem}, {msg.head.company.name}
        </Text>
        <Text style={styles.fieldAdress}>{`${msg.head.consumer.name} > ${msg.head.producer.name}`}</Text>
        <View style={styles.field}>
          <Text style={styles.fontBold}>Тип:</Text>
          <Text style={styles.fieldType}>{msg.body.type}</Text>
        </View>
        <Text style={styles.fontBold}>Содержимое:</Text>
        <Text style={styles.fieldText}>{msg.body.payload.toString()}</Text>
        <Text style={styles.fieldDate}>{msg.head.dateTime}</Text>
      </View>
      <View style={styles.icons}>
        <FAB style={[styles.fabAdd, { backgroundColor: colors.primary }]} icon="sync" onPress={handleTransform} />
        <FAB style={[styles.fabAdd, { backgroundColor: colors.primary }]} icon="delete" onPress={handleDelete} />
      </View>
    </>
  ) : null;
};

export default MessageViewScreen;

const styles = StyleSheet.create({
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
