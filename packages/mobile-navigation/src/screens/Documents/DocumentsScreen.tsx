import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ItemSeparator } from '@lib/mobile-ui/src/components';
import { IDocument } from '@lib/types';
import { useDispatch, useSelector, documentActions } from '@lib/store';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/core';
import DrawerButton from '@lib/mobile-ui/src/components/AppBar/DrawerButton';
import MenuButton from '@lib/mobile-ui/src/components/AppBar/MenuButton';
// import {  } from '@lib/mock';

interface IField {
  name: keyof IDocument;
  type: typeValue;
}

interface IFields {
  typeDoc?: IField;
  number: IField;
  important?: IField;
  addition1?: IField;
  addition2?: IField;
}

type typeValue = 'number' | 'date' | 'INamedEntity' | 'string';

//вынести к компонентам
const DocumentItem = ({ item, fields }: { item: IDocument; fields: IFields }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

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

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DocumentView', { id: item.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {`${
                fields.typeDoc ? toString({ value: item[fields.typeDoc.name], type: fields.typeDoc.type }) : ''
              } №${toString({ value: item[fields.number.name], type: fields.number.type })}`}
            </Text>
            {fields.important ? (
              <Text style={[styles.name, { color: colors.text }]}>
                {toString({ value: item[fields.important.name], type: fields.important.type })}
              </Text>
            ) : null}
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.number, styles.field, { color: colors.text }]}>
              {fields.addition1 && toString({ value: item[fields.addition1.name], type: fields.addition1.type })}
            </Text>
            <Text style={[styles.number, styles.field, { color: colors.text, alignItems: 'flex-end' }]}>
              {fields.addition2 && toString({ value: item[fields.addition2.name], type: fields.addition2.type })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DocumentsScreen = () => {
  const { list, loading } = useSelector((state) => state.documents);
  // const { colors } = useTheme();

  const showActionSheet = useActionSheet();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLoad = () => {
    // dispatch(documentActions.addDocuments());
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: IDocument }) => (
    <DocumentItem
      item={item}
      fields={{
        number: { name: 'number', type: 'string' },
        typeDoc: { name: 'documentType', type: 'INamedEntity' },
        important: { name: 'status', type: 'string' },
        addition1: { name: 'documentDate', type: 'date' },
      }}
    />
  );

  const ref = useRef<FlatList<IDocument>>(null);

  return (
    <>
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
    </>
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
