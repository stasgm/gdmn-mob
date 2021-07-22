import React, { useLayoutEffect, useMemo } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { BackButton, SubTitle, AppScreen } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { INamedEntity } from '@lib/types';

import { ReferenceStackParamList } from '../../navigation/Root/types';

import { styles } from './styles';

interface IRefEntity extends INamedEntity {
  [fieldName: string]: string | undefined | IRefEntity;
}

interface IProperty {
  sortOrder: number;
  name: string;
  title: string;
  visible: boolean;
  value?: string;
}

const LineItem = React.memo(({ item }: { item: IProperty }) => {
  return (
    <View style={styles.item}>
      <View style={styles.details}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={[styles.number, styles.field]}>{item.value}</Text>
      </View>
    </View>
  );
});

const ReferenceDetailScreen = () => {
  const navigation = useNavigation();

  const { name, id } = useRoute<RouteProp<ReferenceStackParamList, 'ReferenceDetals'>>().params;

  const ref = refSelectors.selectByName<IRefEntity>(name);

  const list = ref?.data.find((e) => e.id === id);

  if (!list) {
    return (
      <AppScreen>
        <SubTitle style={styles.title}>Запись в справочнике не найдена</SubTitle>
      </AppScreen>
    );
  }

  const meta = ref.metadata;

  const refData: IProperty[] = useMemo(
    () =>
      Object.entries(list)
        .map(
          ([key, value]) =>
            ({
              sortOrder: meta?.[key]?.sortOrder || 999,
              name: key,
              title: meta?.[key]?.name || key,
              visible: meta?.[key]?.visible !== false,
              value: value instanceof Object ? value.name || '-' : value,
            } as IProperty),
        )
        .filter((i) => i.visible)
        .sort((a, b) => (a.sortOrder < b.sortOrder ? -1 : 1)),
    [list],
  );

  const renderItem = ({ item }: { item: IProperty }) => <LineItem item={item} />;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{list.name}</SubTitle>
      <FlatList
        data={refData}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
      />
    </AppScreen>
  );
};

export default ReferenceDetailScreen;
