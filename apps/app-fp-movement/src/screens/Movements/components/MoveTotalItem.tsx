import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';

import { IMoveLine } from '../../../store/types';

import { MoveItem } from './MoveItem';

interface IProps {
  docId: string;
  lines: IMoveLine[];
  isBlocked: boolean;
}

export const MoveTotalItem = ({ lines, docId, isBlocked }: IProps) => {
  const linesList = lines.reduce((acc: IMoveLine[], cur) => {
    if (!acc.length) {
      acc.push(cur);
    }

    if (acc.find((i) => i.id !== cur.id)) {
      const b = acc.find((i) => i.good.id === cur.good.id);
      if (b) {
        const c: IMoveLine = { ...b, weight: b.weight + cur.weight };
        acc.splice(acc.indexOf(b), 1, c);
      } else {
        acc.push(cur);
      }
    }
    return acc;
  }, []);

  // console.log('a', a);

  const renderItem = ({ item }: { item: IMoveLine }) => {
    return <MoveItem docId={docId} item={item} readonly={isBlocked} />;
  };

  return (
    <FlatList
      data={linesList}
      keyExtractor={(_, i) => String(i)}
      renderItem={renderItem}
      scrollEventThrottle={400}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};
