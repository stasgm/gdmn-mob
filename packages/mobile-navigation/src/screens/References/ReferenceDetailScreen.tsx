import { ItemSeparator, SubTitle } from '@lib/mobile-ui/src/components';
import { refSelectors } from '@lib/store';
import { INamedEntity } from '@lib/types';
import { RouteProp, useRoute, useScrollToTop } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Text, View, FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';

import { ReferenceStackParamList } from '../../navigation/Root/types';

import { styles } from './styles';

interface IRefEntity extends INamedEntity {
  [fieldName: string]: string | undefined | IRefEntity;
}

interface IProperty {
  name: string;
  value: string | undefined;
}

const LineItem = React.memo(({ item }: { item: IProperty }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.item, { backgroundColor: colors.background }]}>
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.number, styles.field, { color: colors.text }]}>{item.value}</Text>
      </View>
    </View>
  );
});

const ReferenceDetailScreen = () => {
  const { colors } = useTheme();

  const { name, id } = useRoute<RouteProp<ReferenceStackParamList, 'ReferenceDetals'>>().params;

  const list = (refSelectors.selectByName(name)?.data as IRefEntity[])?.find((e) => e.id === id);

  if (!list) {
    return (
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <SubTitle style={[styles.title, { backgroundColor: colors.background }]}>
          Запись в справочнике не найдена
        </SubTitle>
      </View>
    );
  }

  const refData: IProperty[] = useMemo(
    () =>
      Object.entries(list).map(([key, value]) => ({ name: key, value: value instanceof Object ? value.name : value })),
    [list],
  );

  const ref = React.useRef<FlatList<IProperty>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IProperty }) => <LineItem item={item} />;

  return (
    <View style={[styles.content, { backgroundColor: colors.background }]}>
      <SubTitle style={[styles.title, { backgroundColor: colors.background }]}>{list.name}</SubTitle>
      <ItemSeparator />
      <FlatList
        ref={ref}
        data={refData}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default ReferenceDetailScreen;
