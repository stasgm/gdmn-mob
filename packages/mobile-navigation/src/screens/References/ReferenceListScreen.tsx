import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useSelector } from '@lib/store';
import { AppScreen, MenuButton, navBackDrawer, useActionSheet } from '@lib/mobile-ui';

import { keyExtractorByIndex, useSendRefsRequest } from '@lib/mobile-hooks';

import { ReferenceStackParamList } from '../../navigation/Root/types';

import ReferenceItem, { RefListItem } from './components/ReferenceListItem';

import { styles } from './styles';

type ViewScreenProp = StackNavigationProp<ReferenceStackParamList, 'ReferenceView'>;

const ReferenceListScreen = () => {
  const { list, loading } = useSelector((state) => state.references);
  const appLoading = useSelector((state) => state.app.loading);

  const refData = useMemo(() => {
    return Object.entries(list)
      .map(([key, value]) => ({ ...value, refName: key } as RefListItem))
      .filter((i) => i.visible !== false)
      .sort((a, b) => ((a?.description || a?.name) < (b?.description || b?.name) ? -1 : 1));
  }, [list]);

  const navigation = useNavigation<ViewScreenProp>();

  const showActionSheet = useActionSheet();

  const sendRequest = useSendRefsRequest();

  const handleSendRefsRequest = async () => {
    await sendRequest();
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Отправить запрос на получение справочников',
        onPress: handleSendRefsRequest,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, []);

  const renderRight = useCallback(() => <MenuButton actionsMenu={actionsMenu} disabled={appLoading} />, [appLoading]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation, appLoading]);

  const renderItem = ({ item }: { item: RefListItem }) => <ReferenceItem item={item} />;

  return (
    <AppScreen>
      <FlatList
        data={refData}
        keyExtractor={keyExtractorByIndex}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        scrollEventThrottle={400}
        refreshControl={<RefreshControl refreshing={loading} />}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyList}>{'Список пуст. \nПожалуйста, выполните синхронизацию.'}</Text>
          ) : null
        }
      />
    </AppScreen>
  );
};

export default ReferenceListScreen;
