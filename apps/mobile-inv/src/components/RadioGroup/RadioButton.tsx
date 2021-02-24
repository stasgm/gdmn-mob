import React, { Component, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { IOption } from './RadioGroup';

type Props = {
  options: IOption[];
  horizontal?: boolean;
  circleStyle?: { [name: string]: string };
  activeButtonId?: number | string;
  onChange: (option: IOption) => void;
};

const RadioButton = ({ options }: Props) => {
  const [value, setValue] = useState();

  return (
    <View>
      {options.map((res) => {
        return (
          <View key={res.id} style={styles.container}>
            <Text style={styles.radioText}>{res.label}</Text>
            <TouchableOpacity
              style={styles.radioCircle}
              onPress={() => {
                setValue(res.id);
              }}
            >
              {value === res.id && <View style={styles.selectedRb} />}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  radioCircle: {
    alignItems: 'center',
    borderColor: '#3740ff',
    borderRadius: 100,
    borderWidth: 2,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  radioText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 35,
  },
  result: {
    backgroundColor: '#F3FBFE',
    color: 'white',
    fontWeight: '600',
    marginTop: 20,
  },
  selectedRb: {
    backgroundColor: '#3740ff',
    borderRadius: 50,
    height: 15,
    width: 15,
  },
});

export default RadioButton;
