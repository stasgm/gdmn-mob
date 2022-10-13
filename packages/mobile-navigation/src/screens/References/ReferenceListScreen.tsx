import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useSelector } from '@lib/store';
import { AppScreen, MenuButton, navBackDrawer, SendButton, useActionSheet } from '@lib/mobile-ui';

import { ReferenceStackParamList } from '../../navigation/Root/types';

import useSendRefsRequest from '../../hooks/useSendRefsRequest';

import ReferenceItem, { RefListItem } from './components/ReferenceListItem';

import { styles } from './styles';

type ViewScreenProp = StackNavigationProp<ReferenceStackParamList, 'ReferenceView'>;

const ReferenceListScreen = () => {
  const { list, loading } = useSelector((state) => state.references);

  const refData = useMemo(() => {
    return Object.entries(list)
      .map(([key, value]) => ({ ...value, refName: key } as RefListItem))
      .filter((i) => i.visible !== false)
      .sort((a, b) => ((a?.description || a?.name) < (b?.description || b?.name) ? -1 : 1));
  }, [list]);

  const navigation = useNavigation<ViewScreenProp>();

  const showActionSheet = useActionSheet();

  const sendRequest = useSendRefsRequest();

  const handleSendRefsRequest = () => sendRequest();

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

  const renderRight = useCallback(() => <MenuButton actionsMenu={actionsMenu} />, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: RefListItem }) => <ReferenceItem item={item} />;

  return (
    <AppScreen>
      <FlatList
        data={refData}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        scrollEventThrottle={400}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
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
