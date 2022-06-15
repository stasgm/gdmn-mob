import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollView, TextInput, View, Text } from 'react-native';

import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator } from '@lib/mobile-ui';

import { useTheme } from '@react-navigation/native';

import { getDateString } from '@lib/mobile-app';

import { IMoveLine } from '../../../store/types';

import { ONE_SECOND_IN_MS } from '../../../utils/constants';

interface IProps {
  item: IMoveLine;
  onSetLine: (value: IMoveLine) => void;
}

export const MoveLine = ({ item }: IProps) => {
  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);

  const currRef = useRef<TextInput>(null);

  useEffect(() => {
    currRef?.current && setTimeout(() => currRef.current?.focus(), ONE_SECOND_IN_MS);
  }, []);

  return (
    <>
      <ScrollView>
        <View style={[styles.content]}>
          <View style={[styles.item]}>
            <View style={styles.details}>
              <Text style={styles.name}>Наименование</Text>
              <Text style={textStyle}>{item ? item.good.name || 'товар не найден' : ''}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Вес</Text>
              <Text style={textStyle}>{item.weight || ''}</Text>
              {/* <Text style={textStyle}>{price?.toString() || ''}</Text> */}
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Ед. изм.</Text>
              <Text style={textStyle}>кг</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Номер партии</Text>
              <Text style={textStyle}>{item.numReceived || ''}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Дата производства</Text>
              <Text style={textStyle}>
                {`${getDateString(item.workDate)} ${new Date(item.workDate).toLocaleTimeString()}` || ''}
              </Text>
            </View>
          </View>
          <ItemSeparator />
        </View>
      </ScrollView>
    </>
  );
};
