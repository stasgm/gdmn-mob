import { AppScreen } from '@lib/mobile-ui';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { IVisitDocument } from '../../../store/types';
import { getDateString } from '../../../utils/helpers';

//import { StackNavigationProp } from '@react-navigation/stack';

// import { IVisitDocument } from '../../../store/docs/types';
//import { RoutesStackParamList } from '../../../navigation/Root/types';

//type RouteLineProp = StackNavigationProp<RoutesStackParamList, 'RouteView'>;

/*const Progress = ({ completed }: { completed: boolean }) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ borderRadius: 10, backgroundColor: '#3914AF', height: 15, borderColor: '#3914AF', width: 15 }} />
      <View style={{ flex: 1, height: 5, backgroundColor: '#3914AF' }} />
      <View style={{ borderRadius: 10, backgroundColor: '#3914AF', height: 15, borderColor: '#3914AF', width: 15 }} />
      <View style={{ flex: 1, height: 5, backgroundColor: completed ? '#3914AF' : '#999' }} />
      <View
        style={{
          borderRadius: 10,
          backgroundColor: completed ? '#3914AF' : '#999',
          borderColor: completed ? '#3914AF' : '#999',
          height: 15,
          width: 15,
        }}
      />
    </View>
  );
};*/

const VisitItem = ({ item }: { item: IVisitDocument }) => {
  //const navigation = useNavigation<RouteLineProp>();
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
