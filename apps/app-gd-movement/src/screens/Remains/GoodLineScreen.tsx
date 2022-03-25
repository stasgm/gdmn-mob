import React, { useLayoutEffect } from 'react';
import { Text, View } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { RemainsStackParamList } from '../../navigation/Root/types';
import { IRemGood } from '../../store/app/types';

const LineItem = React.memo(({ item }: { item: IRemGood }) => {
  return (
    <View>
      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Алиас</Text>
          <Text style={[styles.number, styles.field]}>{item?.good?.alias}</Text>
        </View>
      </View>
      <ItemSeparator />

      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Штрих-код</Text>
          <Text style={[styles.number, styles.field]}>{item?.good?.barcode}</Text>
        </View>
      </View>
      <ItemSeparator />

      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Цена</Text>
          <Text style={[styles.number, styles.field]}>{item?.price}</Text>
        </View>
      </View>
      <ItemSeparator />

      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Покупная цена</Text>
          <Text style={[styles.number, styles.field]}>{item?.buyingPrice || '0'}</Text>
        </View>
      </View>
      <ItemSeparator />

      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>Остаток</Text>
          <Text style={[styles.number, styles.field]}>{item?.remains}</Text>
        </View>
      </View>
    </View>
  );
});

const GoodLineScreen = () => {
  const navigation = useNavigation();
  const remainsItem = useRoute<RouteProp<RemainsStackParamList, 'GoodLine'>>().params?.item;

  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
    ('');
  }, [navigation, colors.card]);

  return (
    <>
      <SubTitle style={[styles.title]}>{remainsItem?.good.name}</SubTitle>
      <View style={[styles.content]}>
        <LineItem item={remainsItem} />
      </View>
      <ItemSeparator />
    </>
  );
};

export default GoodLineScreen;
