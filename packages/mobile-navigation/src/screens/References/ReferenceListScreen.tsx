import React, { useLayoutEffect, useMemo } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

// import { peopleRefMock, depRefMock, companyRefMock, docTypeRefMock } from '@lib/mock';
import { useSelector } from '@lib/store';
import { DrawerButton, AppScreen } from '@lib/mobile-ui';

import { ReferenceStackParamList } from '../../navigation/Root/types';

import ReferenceItem, { RefListItem } from './components/ReferenceListItem';

import { styles } from './styles';

type ViewScreenProp = StackNavigationProp<ReferenceStackParamList, 'ReferenceView'>;

const ReferenceListScreen = () => {
  const { list, loading } = useSelector((state) => state.references);

  console.log(list);

  const refData = useMemo(() => {
    return Object.entries(list)
      .map(([key, value]) => ({ ...value, refName: key } as RefListItem))
      .filter((i) => i.visible !== false);
  }, [list]);

  const navigation = useNavigation<ViewScreenProp>();
  // const showActionSheet = useActionSheet();
  // const dispatch = useDispatch();

  /*   const handleLoad = () => {
      dispatch(
        referenceActions.addReferences({
          people: peopleRefMock,
          departmens: depRefMock,
          companies: companyRefMock,
          docTypes: docTypeRefMock,
        }),
      );
    };

    const handleReset = () => {
      dispatch(referenceActions.init());
    };

    const handleDeleteAll = () => {
      dispatch(referenceActions.deleteAllReferences());
    }; */

  // const actionsMenu = useCallback(() => {
  //   showActionSheet([
  //     {
  //       title: 'Загрузить',
  //       onPress: handleLoad,
  //     },
  //     {
  //       title: 'Сбросить',
  //       onPress: handleReset,
  //     },
  //     {
  //       title: 'Удалить',
  //       type: 'destructive',
  //       onPress: handleDeleteAll,
  //     },
  //     {
  //       title: 'Отмена',
  //       type: 'cancel',
  //     },
  //   ]);
  // }, [showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      // headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
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
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};

export default ReferenceListScreen;
