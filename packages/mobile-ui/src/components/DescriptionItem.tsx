import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading, Switch, TextInput, useTheme } from 'react-native-paper';
import { INamedEntity } from '@lib/types';

type Props = {
  description: string;
  data: string | number | INamedEntity;
  onValueChange: (newValue: any) => void;
};

const DescriptionItem = ({ description, data, onValueChange }: Props) => {

  return (
    <View style={localStyles.container}>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    width: '100%',
  },
  input: {
    height: 32,
  },
  subHeading: {
    width: '85%',
    fontSize: 14,
  },
});

export default DescriptionItem;
