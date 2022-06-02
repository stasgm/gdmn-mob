import React, { useLayoutEffect, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';

import { IRefMetadata } from '@lib/types';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IGoodMatrix, IMatrixData } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

interface IProperty {
  sortOrder: number;
  name: string;
  title: string;
  visible: boolean;
  value?: string;
}

const LineItem = React.memo(({ item }: { item: IProperty }) => {
  const { colors } = useTheme();
  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);

  return (
    <View style={styles.item}>
      <View style={styles.details}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={textStyle}>{item.value}</Text>
      </View>
    </View>
  );
});

const GoodLineScreen = () => {
  const navigation = useNavigation();
  const matrixItem = useRoute<RouteProp<GoodMatrixStackParamList, 'GoodLine'>>().params?.item;
  const metadata = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.metadata as IRefMetadata<IMatrixData>;

  const refData = useMemo(
    () =>
      matrixItem &&
      metadata &&
      Object.entries(metadata)
        ?.map(
          ([key, value]) =>
            ({
              sortOrder: value?.sortOrder,
              name: key,
              title: value?.name,
              visible: value?.visible !== false,
              value: key === 'goodId' ? matrixItem.id : matrixItem[key],
            } as IProperty),
        )
        .filter((i) => i.visible && i.name !== 'goodName')
        .sort((a, b) => (a.sortOrder < b.sortOrder ? -1 : 1)),
    [metadata, matrixItem],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: IProperty }) => <LineItem item={item} />;

  return (
    <>
      <SubTitle style={[styles.title]}>{matrixItem?.name}</SubTitle>
      <View style={[styles.content]}>
        <FlatList
          data={refData}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
        <ItemSeparator />
      </View>
      <ItemSeparator />
    </>
  );
};

export default GoodLineScreen;
