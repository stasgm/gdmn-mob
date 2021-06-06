import React from 'react';
import { View, StyleSheet } from 'react-native';

import styles from '../styles/global';

import { SubTitle } from './SubTitle';

interface IProps {
  colorLabel: string;
  title: string;
  children: React.ReactElement;
}

const InfoBlock = ({ colorLabel, title, children }: IProps) => {
  return (
    <View style={[styles.flexDirectionRow, currStyles.box]}>
      <View style={[currStyles.label, { backgroundColor: colorLabel }]} />
      <View style={currStyles.info}>
        <SubTitle style={[styles.title]}>{title}</SubTitle>
        {children}
      </View>
    </View>
  );
};

export default InfoBlock;

const currStyles = StyleSheet.create({
  box: {
    borderColor: '#8888',
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  info: {
    margin: 5,
    marginLeft: 15,
  },
  label: {
    width: 10,
    backgroundColor: '#3914AF',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
