import React, { useCallback, useLayoutEffect, useMemo, useRef /*, { useCallback }*/ } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { useTheme } from 'react-native-paper';

import { IDocument, IEntity } from '@lib/types';
import { useSelector } from '@lib/store';
import { useRoute } from '@react-navigation/core';
import { RouteProp, useNavigation } from '@react-navigation/native';

import { ItemSeparator } from '@lib/mobile-ui/src/components';

// eslint-disable-next-line import/no-cycle
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import BackButton from '@lib/mobile-ui/src/components/AppBar/BackButton';
import MenuButton from '@lib/mobile-ui/src/components/AppBar/MenuButton';

import { DocumentsStackParamList } from '../../navigation/Root/types';

type typeValue = 'number' | 'date' | 'INamedEntity' | 'string';

//вынести в отдельное место от компонента
//функция для приведения других типов к строке
const toString = ({ value, type }: { value: any; type: typeValue }) => {
  if (type === 'number') {
    return value.toString();
  }
  if (type === 'date') {
    const date = new Date(value);
    return `${('0' + date.getDate()).toString().slice(-2, 3)}.${('0' + (date.getMonth() + 1).toString()).slice(
      -2,
      3,
    )}.${date.getFullYear()}`;
  }
  if (type === 'INamedEntity') {
    return value.name;
  }
  return value;
};

const ContentItem = ({ item }: { item: IEntity }) => {
  return <View>{item.id}</View>;
};

const Header = ({ titles }: { titles: string[] }) => {
  return (
    <>
      {titles.map((title) => (
        <Text>{title}</Text>
      ))}
    </>
  );
};

const DocumentViewScreen = () => {
  const { list, loading } = useSelector((state) => state.documents);
  const { colors } = useTheme();
  const docId = useRoute<RouteProp<DocumentsStackParamList, 'DocumentView'>>().params?.id;
  const CustomItem = useRoute<RouteProp<DocumentsStackParamList, 'DocumentView'>>().params?.view?.componentItem;
  const titles = useRoute<RouteProp<DocumentsStackParamList, 'DocumentView'>>().params?.view?.titles;
  const styleHeader = useRoute<RouteProp<DocumentsStackParamList, 'DocumentView'>>().params?.view?.styleHeader;
  const document = useMemo(() => list.find((item: { id: string }) => item.id === docId), [docId, list]);

  const showActionSheet = useActionSheet();
  const navigation = useNavigation();
  // const dispatch = useDispatch();

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Загрузить',
        // onPress: () => { },
      },
      {
        title: 'Удалить все',
        type: 'destructive',
        // onPress: () => { },
      },
      // {
      //   title: 'Сбросить',
      //   onPress: () => {},
      // },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: any }) =>
    CustomItem ? <CustomItem item={item} /> : <ContentItem item={item as IEntity} />;

  const ref = useRef<FlatList<IDocument>>(null);

  return (
    <>
      <View style={{ backgroundColor: colors.background }}>
        <Text style={[styles.textDescription, { color: colors.text }]}>{`№${document?.number} от ${toString({
          value: document?.documentDate,
          type: 'date',
        })}`}</Text>
      </View>
      <FlatList
        ref={ref}
        //TODO: данные из документа
        data={[]}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        // refreshing={loading}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
        ListHeaderComponent={() => Header({ titles: titles ?? ['Идентификатор'] })}
        ListHeaderComponentStyle={styleHeader ?? styles.header}
      />
    </>
  );
};

export default DocumentViewScreen;

const styles = StyleSheet.create({
  description: {},
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#CC6',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  textDescription: {
    fontSize: 11,
  },
});
