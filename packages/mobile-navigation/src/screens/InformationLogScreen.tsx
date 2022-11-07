import React, { useLayoutEffect } from 'react';
import { FlatList, View, Text } from 'react-native';
import { IErrorNotice, useSelector } from '@lib/store';
import { AppScreen, globalStyles as styles, MediumText, ItemSeparator, EmptyList, navBackButton } from '@lib/mobile-ui';

import { getDateString, keyExtractor } from '@lib/mobile-hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';

import { InformationStackParamList } from '../navigation/Root/types';

const InformationLogScreen = () => {
  const navigation = useNavigation<StackNavigationProp<InformationStackParamList, 'Log'>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, []);

  const errorList = useSelector((state) => state.app.errorList).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const renderItem = ({ item }: { item: IErrorNotice }) => {
    const errDate = new Date(item.date);
    return (
      <View style={styles.item}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="exclamation-thick" size={18} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{`${getDateString(errDate)} ${new Date(errDate).toLocaleTimeString()}`}</Text>
          </View>
          <MediumText>{item.name}</MediumText>
          <MediumText>{item.message}</MediumText>
        </View>
      </View>
    );
  };

  return (
    <AppScreen style={styles.contentTop}>
      <FlatList
        data={errorList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
      />
    </AppScreen>
  );
};

export default InformationLogScreen;
