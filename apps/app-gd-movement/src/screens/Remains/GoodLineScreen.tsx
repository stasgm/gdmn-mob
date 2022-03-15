import React, { useLayoutEffect } from 'react';
import { Text, View } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { RemainsStackParamList } from '../../navigation/Root/types';
import { IRemGood } from '../../store/app/types';

// interface IProperty {
//   sortOrder: number;
//   name: string;
//   title: string;
//   visible: boolean;
//   value?: string;
// }

const LineItem = React.memo(({ item }: { item: IRemGood /*IProperty*/ }) => {
  return (
    <View>
      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Алиас</Text>
          <Text style={[styles.number, styles.field]}>{item.good.alias}</Text>
        </View>
      </View>
      <ItemSeparator />

      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Штрих-код</Text>
          <Text style={[styles.number, styles.field]}>{item.good.barcode}</Text>
        </View>
      </View>
      <ItemSeparator />

      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Цена</Text>
          <Text style={[styles.number, styles.field]}>{item.price}</Text>
        </View>
      </View>
      <ItemSeparator />

      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Покупная цена</Text>
          <Text style={[styles.number, styles.field]}>{item.buyingPrice}</Text>
        </View>
      </View>
      <ItemSeparator />

      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Остаток</Text>
          <Text style={[styles.number, styles.field]}>{item.remains}</Text>
        </View>
      </View>
    </View>
  );
});

const GoodLineScreen = () => {
  const navigation = useNavigation();
  const matrixItem = useRoute<RouteProp<RemainsStackParamList, 'GoodLine'>>().params?.item;

  console.log('item', matrixItem);
  // const metadata = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.metadata as IRefMetadata<IMatrixData>;

  // const refData = useMemo(
  //   () =>
  //     matrixItem &&
  //     metadata &&
  //     Object.entries(metadata)
  //       ?.map(
  //         ([key, value]) =>
  //           ({
  //             sortOrder: value?.sortOrder,
  //             name: key,
  //             title: value?.name,
  //             visible: value?.visible !== false,
  //             value: matrixItem[key],
  //           } as IProperty),
  //       )
  //       .filter((i) => i.visible && i.name !== 'goodName')
  //       .sort((a, b) => (a.sortOrder < b.sortOrder ? -1 : 1)),
  //   [metadata, matrixItem],
  // );

  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
    ('');
  }, [navigation, colors.card]);

  // const renderItem = ({ item }: { item: IRemGood /*IProperty*/ }) => <LineItem item={item} />;

  return (
    <>
      <SubTitle style={[styles.title]}>{matrixItem?.good.name}</SubTitle>
      <View style={[styles.content]}>
        {/* <FlatList
          data={matrixItem}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        /> */}
        <LineItem item={matrixItem} />
        {/* <ItemSeparator /> */}
      </View>
      <ItemSeparator />
    </>
  );
};

export default GoodLineScreen;
