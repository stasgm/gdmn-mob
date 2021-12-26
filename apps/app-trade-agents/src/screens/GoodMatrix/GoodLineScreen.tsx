import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { IconButton, Searchbar } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IGoodMatrix } from '../../store/types';

const GoodLineScreen = () => {
  const navigation = useNavigation();
  const { contactId, item } = useRoute<RouteProp<GoodMatrixStackParamList, 'GoodLine'>>().params;

  const good = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data.find((item) => item.contactId === contactId);

  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation, colors.card]);

  return (
    <>
      <SubTitle style={[styles.title]}>{item.goodId}</SubTitle>
      <ScrollView>
        <View style={[styles.content]}>
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>PriceFSN</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>{item.priceFsn}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>PriceFSNSklad</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>{item.priceFsnSklad.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>PriceFSO</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>{item.priceFso.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>PriceFSOSklad</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>{item.priceFsoSklad.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
        </View>
      </ScrollView>
    </>
  );
};

export default GoodLineScreen;
