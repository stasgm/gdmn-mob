import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { IMessage } from '@lib/types';
import { useSelector, messageActions, useDispatch } from '@lib/store';
import { useActionSheet, MenuButton, DrawerButton } from '@lib/mobile-ui';

import { getDateString } from '../../../../../apps/app-trade-agents/src/utils/helpers';

const MessageItem = ({ item }: { item: IMessage }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('MessageView', { id: item.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="message-text-outline" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text
              style={[styles.name, { color: colors.text }]}
            >{`${item.head.producer.name} > ${item.head.consumer.name}`}</Text>
          </View>
          <Text style={[styles.number, styles.field, { color: colors.text }]}>{getDateString(item.head.dateTime)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MessagesListScreen = () => {
  const { data, loading } = useSelector((state) => state.messages);
  const { company } = { company: { id: '654', name: 'ОДО Амперсант', admin: 'Stas' } };
  // const { company } = useSelector((state) => state.auth);
  // const { colors } = useTheme();

  const dispatch = useDispatch();
  const showActionSheet = useActionSheet();

  /*
const handleSend = async () => {
  console.log('send new message to server');
  //if (!company) {
  //  return;
  //}
  const response = await api.message.sendMessages(
    //Constants.manifest.extra.SYSTEM_NAME,
    //company,
    newMessage.head.appSystem,
    newMessage.head.company,
    newMessage.head.consumer,
    newMessage.body,
  );

  if (response.type === 'SEND_MESSAGE') {
    Alert.alert('Запрос отправлен!', response.uid, [{ text: 'Закрыть' }]);
  }

  if (response.type === 'ERROR') {
    Alert.alert('Ошибка!', response.message, [{ text: 'Закрыть' }]);
  }

  Alert.alert("Ошибка!", "something wrong", [{ text: "Закрыть" }]);

}; */

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  const handleLoad = useCallback(() => {
    //TODO systemId из конфига
    //company &&
    dispatch(
      messageActions.fetchMessages({
        companyId: company.id,
        systemId: 'gdmn-appl-request',
      }),
    );
  }, [company, dispatch]);

  const handleProcessAll = useCallback(async () => {
    for await (const message of data) {
      console.log(message);
    }
  }, [data]);

  const handleReset = useCallback(() => {
    dispatch(messageActions.init());
  }, [dispatch]);

  const handleDeleteAll = useCallback(() => {
    dispatch(messageActions.deleteAllMessages());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Загрузить',
        onPress: handleLoad,
      },
      {
        title: 'Обработать все',
        onPress: handleProcessAll,
      },
      {
        title: 'Удалить все',
        type: 'destructive',
        onPress: handleDeleteAll,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleDeleteAll, handleLoad, handleReset, showActionSheet]);

  const renderItem = ({ item }: { item: IMessage }) => <MessageItem item={item} />;

  const ref = useRef<FlatList<IMessage>>(null);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          ref={ref}
          data={data}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
          scrollEventThrottle={400}
          onEndReached={() => ({})}
          refreshControl={<RefreshControl refreshing={loading} title="Загрузка данных..." />}
          ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
        />
      </View>
      {/*
      <FAB style={[styles.fabAdd, { backgroundColor: colors.primary }]} icon="dots-horizontal" onPress={actionsMenu} />
      */}
    </>
  );
};

export default MessagesListScreen;

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
  field: {
    opacity: 0.5,
  },
  fabAdd: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
});
