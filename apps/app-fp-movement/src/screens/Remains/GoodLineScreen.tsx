import React, { useLayoutEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { styles } from '@lib/mobile-navigation';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { AppActivityIndicator, AppScreen, ItemSeparator, navBackButton, SubTitle } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-hooks';

import { RemainsStackParamList } from '../../navigation/Root/types';
import { IRemGood } from '../../store/app/types';

const LineItem = React.memo(({ item }: { item: IRemGood }) => {
  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);

  return (
    <AppScreen>
      <ScrollView>
        <View>
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Код</Text>
              <Text style={textStyle}>{item?.good?.shcode}</Text>
            </View>
          </View>
          <ItemSeparator />

          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Остаток</Text>
              <Text style={textStyle}>{`${item?.remains} кг`}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Партия</Text>
              <Text style={textStyle}>{item?.numReceived} </Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Дата производства</Text>
              <Text style={textStyle}>{getDateString(item?.workDate)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
});

const GoodLineScreen = () => {
  const navigation = useNavigation();
  const remainsItem = useRoute<RouteProp<RemainsStackParamList, 'GoodLine'>>().params?.item;

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
