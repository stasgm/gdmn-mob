import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { INamedEntity } from '@lib/types';

type Props = {
  description: string;
  data: string | number | INamedEntity;
  onValueChange?: (newValue: any) => void;
};

const DescriptionItem = ({ description, data }: Props) => {
  const value = typeof data === 'object' && 'name' in data ? data.name : data;
  return (
    <View style={localStyles.container}>
      <View style={localStyles.change}>
        <Text style={localStyles.titleText}>{description}</Text>
        <Text style={localStyles.text}>{value}</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  change: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    width: '100%',
    height: 30,
  },
  titleText: {
    color: '#333536',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#333536',
    fontSize: 14,
    //fontWeight: '300',
  },
});

export default DescriptionItem;
