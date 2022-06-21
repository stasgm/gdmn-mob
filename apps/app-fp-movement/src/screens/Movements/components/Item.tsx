import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { IMoveDocument, IMoveLine } from '../../../store/types';
import { MoveStackParamList } from '../../../navigation/Root/types';

interface IProps {
  docId?: string;
  item?: IMoveLine;
  readonly?: boolean;
  lines: IMoveLine[];
  doc?: IMoveDocument;
}

export const Item = ({ doc, lines, docId, item, readonly = false }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveView'>>();

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  // const orderLines = lines.reduce((prev: IMoveLine[], line) => {
  //   return [...prev, ...line.weight];
  // }, []);

  // const li = lines.reduce((prev, cur) =>
  // const
  // );

  //   const l: IMoveLine[] = lines.map((i) => {
  //     const q = l.find((a) => a.good.id === i.good.id && a.id !== i.id);
  //  if (q) {
  //   l.find((o) => o.id === q.id)
  // return {...i,}
  //  }
  // });

  // const l = lines.reduce((prev, line) => {
  //   return console.log('prev', prev, 'line', line);
  // });

  // const newLines: IMoveLine[] = lines.filter(
  //   (i) => i.id !== newLines?.find((a) => a.good.id === i.good.id && a.id !== i.id)?.id,
  // );
  // console.log('new', newLines);

  // const a: IMoveLine[] = lines.filter(
  //   (i) =>
  //     i.id !==
  //     a?.find((o) => {
  //       console.log('1', o);
  //       if (o.good.id === i.good.id && o.id !== i.id) {
  //         console.log('o1', o);
  //       }
  //       return o.good.id === i.good.id && o.id !== i.id;
  //     })?.id,
  // );
  // console.log(a);

  // const id = lines.map((i) => {
  //   if (lines.find((o) => o.good.id === i.good.id && i.id !== o.id)) {
  //     return i.id;
  //   }
  // });

  const a = lines.reduce((acc: IMoveLine[], currentValue) => {
    !acc.find((i) => i.good.id === currentValue.good.id) && acc.push(currentValue);
    console.log;
    return acc;
  }, []);

  // console.log('a', a);

  const newLines = a.map((i) => {
    for (const line of lines) {
      let q: IMoveLine;
      if (line.good.id === i.good.id) {
        console.log('1');
        q = { ...i, weight: i.weight + line.weight };
      } else {
        console.log('2');

        q = i;
      }
      return q;
    }
    return i;
  });
  console.log('id', newLines);
  // const l: IMoveLine[] = lines.map((line) => ({ ...line, weight }));
  // const totalList: IOrderTotalLine[] = firstLevelGroups;
  // ?.map((firstGr) => ({
  //   group: {
  //     id: firstGr.id,
  //     name: firstGr.name,
  //   },
  //   quantity: orderLines
  //     .filter((l) =>
  //       goods.find(
  //         (g) =>
  //           g.id === l.good.id &&
  //           (g.goodgroup.id === firstGr.id ||
  //             groups.find((group) => group.parent?.id === firstGr.id && group.id === g.goodgroup.id)),
  //       ),
  //     )
  //     .reduce((s: number, line) => {
  //       return round(s + round(line.quantity));
  //     }, 0),
  //   price: orderLines
  //     .filter((l) =>
  //       goods.find(
  //         (g) =>
  //           g.id === l.good.id &&
  //           (g.goodgroup.id === firstGr.id ||
  //             groups.find((group) => group.parent?.id === firstGr.id && group.id === g.goodgroup.id)),
  //       ),
  //     )
  //     .reduce((s: number, line) => {
  //       return round(s + round(line.good.priceFsn));
  //     }, 0),
  // }))
  // .filter((i) => i.quantity > 0);

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly && navigation.navigate('MoveLine', { mode: 1, docId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          {/* <Text style={styles.name}>{item.good.name}</Text>
          <View style={[styles.directionRow]}>
            <Text style={textStyle}>{(item.weight || 0).toString()} кг</Text>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};
