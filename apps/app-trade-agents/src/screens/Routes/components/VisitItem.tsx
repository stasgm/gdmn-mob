import React from 'react';
//import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';

//import { StackNavigationProp } from '@react-navigation/stack';

import { IVisit } from '../../../store/docs/types';
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

const VisitItem = ({ item }: { item: IVisit }) => {
  //const navigation = useNavigation<RouteLineProp>();
  const dateBegin = new Date(item.dateBegin);
  const dateEnd = item.dateEnd ? new Date(item.dateEnd) : undefined;

  return (
    <View style={localStyles.container}>
      <View style={[localStyles.InfoBlock, localStyles.directionRow]}>
        <View style={localStyles.directionRow}>
          <Text style={localStyles.text}>
            {dateBegin.getHours()}:{dateBegin.getMinutes()}
          </Text>
          <Text style={localStyles.date}>{dateBegin.toLocaleDateString()}</Text>
        </View>
        {dateEnd && (
          <Text style={localStyles.text}>
            {dateEnd.getHours()}:{dateEnd.getMinutes()}
          </Text>
        )}
      </View>
    </View>
  );
};

export default VisitItem;

const localStyles = StyleSheet.create({
  container: {
    margin: 5,
  },
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
