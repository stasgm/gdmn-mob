import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator, PrimeButton } from '@lib/mobile-ui';
import { useSelector } from '@lib/store';

import { IconButton } from 'react-native-paper';

import { ISettingsOption } from '@lib/types';

import { IInventoryLine } from '../../../store/types';

import { ScanDataMatrix } from '../../../components/Scanners/ScanDataMatrix';
import { ScanDataMatrixReader } from '../../../components/Scanners/ScanDataMatrixReader';

interface IProps {
  item: IInventoryLine;
  onSetLine: (value: IInventoryLine) => void;
}

interface IProperty {
  sortOrder?: number;
  name: string;
  title?: string;
  visible?: boolean;
  value?: string;
}

export const LineItem = React.memo(({ item }: { item: IProperty }) => {
  console.log('new1', item);
  return (
    <ScrollView>
      <View style={[styles.content]}>
        <View style={styles.item}>
          <View style={styles.details}>
            <Text style={styles.name}>{item?.title}</Text>
            {item.name === 'quantity' ? (
              <TextInput
                style={[styles.number, styles.field]}
                editable={true}
                keyboardType="numeric"
                // onChangeText={handelQuantityChange}
                returnKeyType="done"
                // ref={currRef}
                value={item?.value}
              />
            ) : (
              <Text style={[styles.number, styles.field]}>{item?.value}</Text>
            )}
          </View>
          <View style={localStyles.button}>
            {item?.name === 'EID' && item?.value ? (
              <TouchableOpacity>
                <IconButton icon="close" size={20} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

const localStyles = StyleSheet.create({
  button: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    right: -10,
    zIndex: 5,
  },
  new: {
    width: '90%',
  },
  details: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
  },
});
