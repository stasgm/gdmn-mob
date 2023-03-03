import React, { useLayoutEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { styles } from '@lib/mobile-navigation';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { AppActivityIndicator, AppScreen, ItemSeparator, navBackButton, SubTitle } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-hooks';

import { CellsStackParamList } from '../../navigation/Root/types';
import { IMoveLine } from '../../store/types';

const LineItem = React.memo(({ item }: { item: IMoveLine }) => {
  console.log('line', item);
  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);

  return (
    <AppScreen>
      <ScrollView>
        <View>
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Штрих-код</Text>
              <Text style={textStyle}>{item?.barcode}</Text>
            </View>
          </View>
          <ItemSeparator />

          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Вес</Text>
              <Text style={textStyle}>{(item.weight || 0).toString()} кг</Text>
            </View>
          </View>
          <ItemSeparator />

          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Партия</Text>
              <Text style={textStyle}>{item.numReceived} </Text>
            </View>
          </View>
          <ItemSeparator />

          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Дата</Text>
              <Text style={textStyle}>{getDateString(item.workDate)}</Text>
            </View>
          </View>
          <ItemSeparator />

          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Ячейка</Text>
              <Text style={textStyle}>{item?.toCell} </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
});

const GoodLineScreen = () => {
  const navigation = useNavigation();
  const remainsItem = useRoute<RouteProp<CellsStackParamList, 'GoodLine'>>().params?.item;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

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
