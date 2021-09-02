import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { useTheme } from 'react-native-paper';

import { IEntity } from '@lib/types';
import { useSelector } from '@lib/store';
import { useRoute } from '@react-navigation/core';
import { RouteProp, useNavigation } from '@react-navigation/native';

import { BackButton, MenuButton, useActionSheet, ItemSeparator } from '@lib/mobile-ui';

import { DocumentsTabsStackParamsList } from '../../navigation/Root/types';

import { styles } from './styles';
import Header from './components/Header';
import DocumentLine from './components/DocumentLine';

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

const DocumentViewScreen = () => {
  const { list, loading } = useSelector((state) => state.documents);
  const { colors } = useTheme();
  const docId = useRoute<RouteProp<DocumentsTabsStackParamsList, 'DocumentView'>>().params?.id;
  const CustomItem = useRoute<RouteProp<DocumentsTabsStackParamsList, 'DocumentView'>>().params?.view?.componentItem;
  const titles = useRoute<RouteProp<DocumentsTabsStackParamsList, 'DocumentView'>>().params?.view?.titles;
  const styleHeader = useRoute<RouteProp<DocumentsTabsStackParamsList, 'DocumentView'>>().params?.view?.styleHeader;
  const document = useMemo(() => list.find((item: { id: string }) => item.id === docId), [docId, list]);

  const showActionSheet = useActionSheet();
  const navigation = useNavigation();
  // const dispatch = useDispatch();

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        // onPress: () => { },
      },
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
      title: Title,
    });
  }, [navigation]);

  const Title = () => {
    return (
      <View>
        <Text>{document?.documentType.description}</Text>
        <Text style={[styles.textDescription, { color: colors.text }]}>{`№${document?.number} от ${toString({
          value: document?.documentDate,
          type: 'date',
        })}`}</Text>
      </View>
    );
  };

  const renderItem = <T extends IEntity>({ item }: { item: T }) => {
    return CustomItem ? <CustomItem key={item.id} item={item} /> : <DocumentLine key={item.id} item={item} />;
  };

  const ref = useRef<FlatList<IEntity>>(null);

  return (
    <>
      {/*<View style={{ backgroundColor: colors.background }}>
        <Text style={[styles.textDescription, { color: colors.text }]}>{`№${document?.number} от ${toString({
          value: document?.documentDate,
          type: 'date',
        })}`}</Text>
      </View>*/}
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
        ListHeaderComponent={() => <Header titles={titles ?? ['Идентификатор']} />}
        ListHeaderComponentStyle={styleHeader ?? styles.header}
      />
    </>
  );
};

export default DocumentViewScreen;
