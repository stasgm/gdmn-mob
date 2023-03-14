import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { IRouteLineItem } from '../../../store/types';

export interface IItem {
  item: IRouteLineItem;
  onPressItem: () => void;
}

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;
const iconsStatus: Icon[] = ['circle-outline', 'arrow-right-drop-circle-outline', 'check-circle-outline'];

const RouteItem = ({ item, onPressItem }: IItem) => (
  <TouchableOpacity onPress={onPressItem}>
    <View style={[styles.item, localStyles.item]}>
      <View style={styles.icon}>
        <MediumText style={styles.lightText}>{item.ordNumber}</MediumText>
      </View>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <LargeText style={styles.textBold}>{item.outletName}</LargeText>
        </View>
        {item.address ? (
          <View style={styles.directionRow}>
            <MediumText>{item.address}</MediumText>
          </View>
        ) : null}
      </View>
      <View style={styles.bottomButtons}>
        {item.status ? <MaterialCommunityIcons name={iconsStatus[item.status]} size={24} color="#888" /> : null}
        {item.dateEnd ? <MediumText>{item.dateEnd}</MediumText> : null}
      </View>
    </View>
  </TouchableOpacity>
);

export default RouteItem;

const localStyles = StyleSheet.create({
  item: {
    height: 74,
  },
});
