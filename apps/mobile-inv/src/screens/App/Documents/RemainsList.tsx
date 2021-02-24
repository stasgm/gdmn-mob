import { useScrollToTop, useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Searchbar, IconButton, Avatar } from 'react-native-paper';

import { IGood } from '../../../../../common';
import { IMDGoodRemain, IModelData, IRem } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import { formatValue } from '../../../helpers/utils';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';

interface IField extends IGood {
  remains?: number;
  price?: number;
}

//TODO переделать в useMemo
const RemainsItem = React.memo(({ item }: { item: IField }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const docId = useRoute<RouteProp<RootStackParamList, 'RemainsList'>>().params?.docId;
  const barcode = !!item.barcode;

  return (
    <TouchableOpacity
      style={[localStyles.item, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate('DocumentLineEdit', {
          prodId: item.id,
          docId,
          price: item.price,
          remains: item.remains,
        });
      }}
    >
      <View style={{ backgroundColor: colors.card }}>
        <Avatar.Icon size={38} icon="cube-outline" style={{ backgroundColor: colors.primary }} />
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={localStyles.itemInfo}>
          {item.remains} {item.value} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)} руб.
          {/* цена: {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)}, остаток: {item.remains} */}
        </Text>
        {barcode && (
          <View style={localStyles.barcode}>
            <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>
              {item.barcode}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

type Props = StackScreenProps<RootStackParamList, 'DocumentView'>;

const RemainsListScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const [text, onChangeText] = useState('');
  const { state } = useAppStore();

  const [list, setList] = useState<IField[]>([]);

  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  const goodRemains: IField[] = useMemo(() => {
    const data = (state.models?.remains?.data as unknown) as IModelData<IMDGoodRemain>;
    const goods = data[document?.head?.fromcontactId]?.goods;

    if (!goods) {
      return [];
    }

    return Object.keys(goods)
      ?.reduce((r: IRem[], e) => {
        const { remains, ...goodInfo } = goods[e];
        const goodPos: IRem = { goodkey: e, ...goodInfo, price: 0, remains: 0 };

        // eslint-disable-next-line @babel/no-unused-expressions
        remains.length > 0
          ? remains.forEach((re) => {
              r.push({ ...goodPos, price: re.price, remains: re.q });
            })
          : r.push(goodPos);
        return r;
      }, [])
      .sort((a: IField, b: IField) => (a.name < b.name ? -1 : 1));
  }, [state.models?.remains?.data, document?.head?.fromcontactId]);

  useEffect(() => {
    setList(
      goodRemains?.filter(
        (item) =>
          item.barcode?.toLowerCase().includes(text.toLowerCase()) ||
          item.name?.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  }, [goodRemains, text]);

  const ref = React.useRef<FlatList<IField>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IField }) => <RemainsItem item={item} />;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="barcode-scan"
          size={24}
          onPress={() =>
            navigation.navigate(state.settings?.barcodeReader ? 'ScanBarcodeReader' : 'ScanBarcode', {
              docId: document.id,
            })
          }
        />
      ),
    });
  }, [document.id, navigation, state.settings?.barcodeReader]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <Searchbar
        placeholder="Штрих-код или название"
        onChangeText={onChangeText}
        value={text}
        style={localStyles.searchBar}
      />
      <ItemSeparator />
      <FlatList
        ref={ref}
        data={list}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
      />
    </View>
  );
};

export { RemainsListScreen };

const localStyles = StyleSheet.create({
  barcode: {
    alignItems: 'flex-end',
  },
  content: {
    height: '100%',
  },
  details: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 3,
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fieldDesciption: {
    opacity: 0.5,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
    marginVertical: 2,
    paddingLeft: 4,
  },
  itemInfo: {
    fontSize: 12,
    opacity: 0.4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
});
