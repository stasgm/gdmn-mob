import { styles } from './styles';
import { ReferenceStackParamList } from '../../navigation/Root/types';
import React, { useLayoutEffect, useMemo } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { SubTitle, AppScreen, navBackButton } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { IReferenceData } from '@lib/types';

import { keyExtractorByIndex } from '@lib/mobile-hooks';

interface IProperty {
  sortOrder: number;
  name: string;
  title: string;
  visible: boolean;
  value?: string;
}

const LineItem = React.memo(({ item }: { item: IProperty }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.item}>
      <View style={styles.details}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={[styles.number, styles.field, { color: colors.text }]}>{item.value}</Text>
      </View>
    </View>
  );
});

const ReferenceDetailScreen = () => {
  const navigation = useNavigation();

  const { name, id } = useRoute<RouteProp<ReferenceStackParamList, 'ReferenceDetals'>>().params;

  const ref = refSelectors.selectByName<IReferenceData>(name);

  const list = ref?.data.find((e) => e.id === id);

  const meta = ref.metadata;

  const refData: IProperty[] = useMemo(() => {
    if (!list) {
      return [];
    }
    return Object.entries(list)
      .map(
        ([key, value]) =>
          ({
            sortOrder: meta?.[key]?.sortOrder || 999,
            name: key,
            title: meta?.[key]?.name || key,
            visible: meta?.[key]?.visible !== false,
            value: value instanceof Object ? value.name || '-' : value,
          }) as IProperty,
      )
      .filter((i) => i.visible)
      .sort((a, b) => (a.sortOrder < b.sortOrder ? -1 : 1));
  }, [list, meta]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  if (!list) {
    return (
      <AppScreen>
        <SubTitle style={styles.title}>Запись в справочнике не найдена</SubTitle>
      </AppScreen>
    );
  }

  const renderItem = ({ item }: { item: IProperty }) => <LineItem item={item} />;

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{list.name}</SubTitle>
      <FlatList
        data={refData}
        keyExtractor={keyExtractorByIndex}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
      />
    </AppScreen>
  );
};

export default ReferenceDetailScreen;
