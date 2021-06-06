import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

import styles from '../styles/global';

import { ItemSeparator } from './ItemSeparator';

interface IProps {
  children?: string;
  line?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SubTitle = ({ children, style, line = true }: IProps) => {
  return (
    <View style={[localStyles.container, styles.subHeader, style]}>
      <Text style={localStyles.text}>{children?.toUpperCase()}</Text>
      {line && <ItemSeparator />}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  text: {
    color: '#333536',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export { SubTitle };
