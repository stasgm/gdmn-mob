import React, { useLayoutEffect, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';

import { INamedEntity } from '@lib/types';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodMatrix } from '../../store/types';

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

const GoodLineScreen = () => {
  const navigation = useNavigation();
  const { contactId, item } = useRoute<RouteProp<GoodMatrixStackParamList, 'GoodLine'>>().params;

  const good = refSelectors.selectByName<IGood>('good')?.data.find((e) => e.id === item?.goodId);

  const metadata = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.metadata;

  // Object.entries(item).forEach(([key, value]) => {
  //   console.log('key', key, 'value', value);
  // });

  const refData: IProperty[] = useMemo(
    () =>
      Object.entries(item)?.map(
          ([key, value]) =>
            ({
              sortOrder: metadata?.[key]?.sortOrder || 999,
              name: key,
              title: metadata?.[key]?.name || key,
              visible: metadata?.[key]?.visible !== false,
              value: value instanceof Object ? value.name || '-' : value,
            } as IProperty),
        )
        .filter((i) => i.visible && i.name !== 'goodName')
        .sort((a, b) => (a.sortOrder < b.sortOrder ? -1 : 1)),
    [item, metadata],
  );

  console.log('refdata', refData);

  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation, colors.card]);

  const renderItem = ({ item }: { item: IProperty }) => <LineItem item={item} />;

  return (
    <>
      <SubTitle style={[styles.title]}>{item.goodName}</SubTitle>
      <View style={[styles.content]}>
        <FlatList
          data={refData}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
        <ItemSeparator />
      </View>
      <Text>123</Text>
      <ItemSeparator />
      {/* <ScrollView>
        <View style={[styles.content]}>
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>id</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>{item.goodId}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>PriceFSN</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>
                {(item.priceFsn || 0).toString()}
              </Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>PriceFSNSklad</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>
                {(item.priceFsnSklad || 0).toString()}
              </Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>PriceFSO</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>
                {(item.priceFso || 0).toString()}
              </Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>PriceFSOSklad</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>
                {(item.priceFsoSklad || 0).toString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView> */}
    </>
  );
};

export default GoodLineScreen;
