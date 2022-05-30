import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';

import { docSelectors, documentActions, useDocThunkDispatch } from '@lib/store';
import {
  AddButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
} from '@lib/mobile-ui';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { sleep } from '@lib/client-api';

import { getDateString } from '@lib/mobile-app';

import { IReturnDocument, IReturnLine } from '../../store/types';

import { ReturnsStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import SwipeLineItem from '../../components/SwipeLineItem';

import { navBackButton } from '../../components/navigateOptions';

import ReturnItem from './components/ReturnItem';

const ReturnViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnView'>>();
  const { id } = useRoute<RouteProp<ReturnsStackParamList, 'ReturnView'>>().params;

  const { colors } = useTheme();
  const [del, setDel] = useState(false);

  const returnDoc = docSelectors.selectByDocId<IReturnDocument>(id);

  const isBlocked = returnDoc?.status !== 'DRAFT';

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }
    Alert.alert('Вы уверены, что хотите удалить возврат?', '', [
      {
        text: 'Да',
        onPress: async () => {
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            setDel(true);
            await sleep(500);
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, id, navigation]);

  const handleEditReturnHead = useCallback(() => {
    navigation.navigate('ReturnEdit', { id });
  }, [navigation, id]);

  const handleAddSellBill = useCallback(() => {
    navigation.navigate('SellBill', { id });
  }, [navigation, id]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить товар из накладной',
        onPress: handleAddSellBill,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditReturnHead,
      },
      {
        title: 'Удалить возврат',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleAddSellBill, handleEditReturnHead, handleDelete]);

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          <AddButton onPress={handleAddSellBill} />
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    [actionsMenu, handleAddSellBill, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  if (del) {
    return (
      <View style={styles.container}>
        <View style={localStyles.del}>
          <SubTitle style={styles.title}>Удаление</SubTitle>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  } else {
    if (!returnDoc) {
      return (
        <View style={styles.container}>
          <SubTitle style={styles.title}>Документ не найден</SubTitle>
        </View>
      );
    }
  }

  const renderItem = ({ item }: { item: IReturnLine }) => (
    <SwipeLineItem docId={returnDoc.id} item={item} readonly={isBlocked} copy={false} routeName="ReturnLine">
      <ReturnItem docId={returnDoc.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(returnDoc?.status || 'DRAFT')}
        title={returnDoc?.head.outlet.name}
        onPress={handleEditReturnHead}
        disabled={!['DRAFT', 'READY'].includes(returnDoc.status)}
      >
        <View style={styles.directionRow}>
          <Text style={styles.textLow}>{`№ ${returnDoc.number} от ${getDateString(returnDoc.documentDate)}`}</Text>
          {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
        </View>
      </InfoBlock>
      <FlatList
        data={returnDoc.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default ReturnViewScreen;

const localStyles = StyleSheet.create({
  del: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
