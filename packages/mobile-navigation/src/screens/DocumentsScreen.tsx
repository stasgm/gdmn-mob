import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ItemSeparator } from '@lib/mobile-ui/src/components';
import { IDocument } from '@lib/types';
import { useDispatch, useSelector, documentActions } from '@lib/store';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/native';
import DrawerButton from '@lib/mobile-ui/src/components/AppBar/DrawerButton';
import MenuButton from '@lib/mobile-ui/src/components/AppBar/MenuButton';
// import {  } from '@lib/mock';

const DocumentItem = ({ item }: { item: IDocument }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate('DocumentView', { docId: item?.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={[styles.name, { color: colors.text }]}>{item.number}</Text>
          </View>
          <Text style={[styles.number, styles.field, { color: colors.text }]}>Документ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DocumentsScreen = () => {
  const { list, loading } = useSelector((state) => state.documents);
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();

  const dispatch = useDispatch();

  const handleLoad = () => {
    dispatch(documentActions.addDocuments([]));
  };

  const handleDeleteAll = () => {
    dispatch(documentActions.deleteAllDocuments());
  };

  const handleReset = () => {
    dispatch(documentActions.init());
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Загрузить',
        onPress: handleLoad,
      },
      {
        title: 'Сбросить',
        onPress: handleReset,
      },
      {
        title: 'Удалить',
        type: 'destructive',
        onPress: handleDeleteAll,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: IDocument }) => <DocumentItem item={item} />;

  const ref = useRef<FlatList<IDocument>>(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={list}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        // refreshing={loading}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </View>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    // alignItems: 'center',
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
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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
});
