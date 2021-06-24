import React, { useLayoutEffect, useMemo } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// import { peopleRefMock, depRefMock, companyRefMock, docTypeRefMock } from '@lib/mock';
import { ItemSeparator } from '@lib/mobile-ui/src/components';
import { useSelector } from '@lib/store';

// import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { DrawerButton } from '@lib/mobile-ui/src/components/AppBar';

import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from 'react-native-paper';

import { ReferenceStackParamList } from '../../navigation/Root/types';

import { styles } from './styles';
import ReferenceItem, { RefListItem } from './components/ReferenceListItem';

type ViewScreenProp = StackNavigationProp<ReferenceStackParamList, 'ReferenceView'>;

const ReferenceListScreen = () => {
  const { list, loading } = useSelector((state) => state.references);

  const refData = useMemo(() => {
    return Object.entries(list)?.map(([key]) => ({ ...list[key], refName: key } as RefListItem)) || [];
  }, [list]);

  const navigation = useNavigation<ViewScreenProp>();
  const { colors } = useTheme();
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
    <View style={[styles.content, { backgroundColor: colors.background }]}>
      <FlatList
        data={refData}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </View>
  );
};

export default ReferenceListScreen;
