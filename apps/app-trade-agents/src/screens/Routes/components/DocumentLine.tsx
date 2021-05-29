import React from 'react';
import { IEntity } from '@lib/types';
import { View } from 'react-native';

const DocumentLine = ({ item }: { item: IEntity }) => {
  return <View>{item.id}</View>;
};

export default DocumentLine;
