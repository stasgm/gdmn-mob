import { AppScreen } from '@lib/mobile-ui';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { getDateString } from '@lib/mobile-app';

import { IVisitDocument } from '../../../store/types';

const VisitItem = ({ item }: { item: IVisitDocument }) => {
  const dateBegin = new Date(item.head.dateBegin);
  const dateEnd = item.head.dateEnd ? new Date(item.head.dateEnd) : undefined;

  return (
    <AppScreen>
      <View style={[localStyles.InfoBlock, localStyles.directionRow]}>
        <View style={localStyles.directionRow}>
          <Text style={localStyles.text}>
            {dateBegin.getHours()}:{dateBegin.getMinutes()}
          </Text>
          <Text style={localStyles.date}>{getDateString(dateBegin)}</Text>
        </View>
        {dateEnd && (
          <Text style={localStyles.text}>
            {dateEnd.getHours()}:{dateEnd.getMinutes()}
          </Text>
        )}
      </View>
    </AppScreen>
  );
};

export default VisitItem;

const localStyles = StyleSheet.create({
  date: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  directionRow: {
    flexDirection: 'row',
  },
  InfoBlock: {
    flex: 1,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
