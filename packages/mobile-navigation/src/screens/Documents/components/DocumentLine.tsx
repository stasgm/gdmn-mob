import React from 'react';
import { View } from 'react-native';
import { IEntity } from '@lib/types';

const DocumentLine = ({ item }: { item: IEntity }) => {
  return <View>{item.id}</View>;
};

export default DocumentLine;
