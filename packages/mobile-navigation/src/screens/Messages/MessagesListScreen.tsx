import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import Constants from 'expo-constants';

import { IMessage } from '@lib/types';
import { useSelector, messageActions, useDispatch } from '@lib/store';
import { useActionSheet, MenuButton, DrawerButton, globalStyles as styles, AppScreen } from '@lib/mobile-ui';

const MessageItem = ({ item }: { item: IMessage }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('MessageView', { id: item.id });
      }}
    >
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: item.status === 'READY' ? '#E91E63' : '#06567D' }]}>
          <MaterialCommunityIcons name="message-text-outline" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.rowCenter}>
            <Text style={styles.name}>{`${item.head.producer.name}  >>  ${item.head.consumer.name}`}</Text>
          </View>
          <Text style={[styles.number, styles.field]}>
            {`${item.body.type}, ${new Date(item.head.dateTime).toDateString()} (${item.status})`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MessagesListScreen = () => {
  const { data, loading } = useSelector((state) => state.messages);
  const { company } = useSelector((state) => state.auth);
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
        companyId: company!.id,
        systemId: Constants.manifest?.extra?.slug || 'gdmn',
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
    // dispatch(messageActions.deleteAllMessages());
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
      <AppScreen style={styles.contentTop}>
        <FlatList
          ref={ref}
          data={data}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
          scrollEventThrottle={400}
          ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
        />
      </AppScreen>
    </>
  );
};

export default MessagesListScreen;
