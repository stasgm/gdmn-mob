import React from 'react';
import { View, StyleSheet } from 'react-native';
import { INamedEntity } from '@lib/types';

import globalStyles from '../styles/global';

import { LargeText, MediumText } from './AppText';

type Props = {
  description: string;
  data: string | number | INamedEntity;
  onValueChange?: (newValue: any) => void;
};

const DescriptionItem = ({ description, data }: Props) => (
  <View style={localStyles.container}>
    <LargeText style={globalStyles.textBold}>{description}</LargeText>
    <MediumText>{typeof data === 'object' && 'name' in data ? data.name : data}</MediumText>
  </View>
);

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
});

export default DescriptionItem;
