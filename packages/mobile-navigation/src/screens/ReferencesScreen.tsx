import React, { useCallback, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ItemSeparator } from '@lib/mobile-ui/src/components';
import { useDispatch, useSelector, referenceActions } from '@lib/store';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
//import { Button, FAB, useTheme } from 'react-native-paper';
import { IReference } from '@lib/types';
import { peopleRefMock, depRefMock, companyRefMock } from '@lib/mock';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';

interface IRef {
  name: string;
  ref: IReference;
}

const ReferenceItem = ({ item }: { item: IRef }) => {
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
            <Text style={[styles.name, { color: colors.text }]}>{item.ref.name}</Text>
          </View>
          <Text style={[styles.number, styles.field, { color: colors.text }]}>Размер: {item.ref.data.length}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ReferencesScreen = () => {
  const { list, loading } = useSelector((state) => state.references);
  const { colors } = useTheme();

  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const handleLoad = () => {
    dispatch(
      referenceActions.addReferences({ people: peopleRefMock, departmens: depRefMock, companies: companyRefMock }),
    );
  };

  const handleReset = () => {
    dispatch(referenceActions.init());
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Загрузить',
        onPress: handleLoad,
      },
      {
        title: 'Удалить все',
        type: 'destructive',
        onPress: handleReset,
      },
      /*       {
              title: 'Сбросить',
              onPress: handleReset,
            }, */
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleLoad, handleReset, showActionSheet]);

  const renderItem = ({ item }: { item: IRef }) => <ReferenceItem item={item} />;

  const ref = useRef<FlatList<IRef>>(null);

  return (
    <>
      {/*<Button compact={false} onPress={handleLoad}>
        Загрузить
      </Button>
      <Button compact={false} onPress={handleReset}>
        Сбросить
  </Button>*/}
      <FlatList
        ref={ref}
        data={Object.keys(list).map((key) => {
          return { name: key, ref: list[key] } as IRef;
        })}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        // refreshing={loading}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
      <FAB style={[styles.fabAdd, { backgroundColor: colors.primary }]} icon="dots-horizontal" onPress={actionsMenu} />
    </>
  );
};

export default ReferencesScreen;

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
  fabAdd: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
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
