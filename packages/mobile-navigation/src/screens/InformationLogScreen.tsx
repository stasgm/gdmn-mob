import React, { useCallback, useLayoutEffect } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { appActions, IErrorLog, useDispatch, useSelector } from '@lib/store';
import {
  AppScreen,
  globalStyles as styles,
  MediumText,
  ItemSeparator,
  EmptyList,
  navBackButton,
  useActionSheet,
  MenuButton,
} from '@lib/mobile-ui';

import { getDateString, keyExtractor } from '@lib/mobile-hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';

import { InformationStackParamList } from '../navigation/Root/types';

const InformationLogScreen = () => {
  const navigation = useNavigation<StackNavigationProp<InformationStackParamList, 'Log'>>();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const handleClearLog = () => {
    Alert.alert('Вы уверены, что хотите удалить всю историю ошибок?', '', [
      {
        text: 'Да',
        onPress: () => {
          dispatch(appActions.clearErrors('all'));
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Удалить историю ошибок',
        type: 'destructive',
        onPress: handleClearLog,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleClearLog]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, []);

  const errorLog = useSelector((state) => state.app.errorLog).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const renderItem = ({ item }: { item: IErrorLog }) => {
    const errDate = new Date(item.date);
    return (
      <View style={styles.item}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="exclamation-thick" size={18} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{`${getDateString(errDate)} ${new Date(errDate).toLocaleTimeString()}`}</Text>
          </View>
          <MediumText>{item.name}</MediumText>
          <MediumText>{item.message}</MediumText>
        </View>
      </View>
    );
  };

  return (
    <AppScreen style={styles.contentTop}>
      <FlatList
        data={errorLog}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
      />
    </AppScreen>
  );
};

export default InformationLogScreen;
