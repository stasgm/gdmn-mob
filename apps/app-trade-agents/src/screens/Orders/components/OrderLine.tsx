import React from 'react';
import { IEntity } from '@lib/types';
import { View } from 'react-native';

const OrderLine = ({ item }: { item: IEntity }) => {
  return <View>{item.id}</View>;
};

export default OrderLine;
