import React, { useLayoutEffect, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';

import { INamedEntity, IRefMetadata } from '@lib/types';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IGoodMatrix } from '../../store/types';

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
  const item = useRoute<RouteProp<GoodMatrixStackParamList, 'GoodLine'>>().params?.item;

  const metadata = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.metadata as IRefMetadata<IRefEntity>;

  const refData = useMemo(
    () =>
      item &&
      Object.entries(metadata)
        ?.map(
          ([key, value]) =>
            ({
              sortOrder: value?.sortOrder,
              name: key,
              title: value?.name,
              visible: value?.visible !== false,
              value: item[key],
            } as IProperty),
        )
        .filter((i) => i.visible && i.name !== 'goodName')
        .sort((a, b) => (a.sortOrder < b.sortOrder ? -1 : 1)),
    [metadata, item],
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
      <SubTitle style={[styles.title]}>{item?.goodName}</SubTitle>
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
    </>
  );
};

export default GoodLineScreen;
