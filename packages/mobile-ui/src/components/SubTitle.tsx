import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';

import styles from '../styles/global';

import { ItemSeparator } from './ItemSeparator';

interface IProps {
  line?: boolean;
  style?: StyleProp<ViewStyle>;
  errorText?: string;
  loadIcon?: boolean;
  children: string;
}

const SubTitle = ({ children, style, loadIcon, errorText, line = true }: IProps) => {
  return (
    <View style={[localStyles.container, styles.subHeader, style]}>
      <View style={localStyles.headerContaner}>
        <Text style={localStyles.text}>{children.toUpperCase()}</Text>
        {loadIcon ? <ActivityIndicator size="small" color="#70667D" /> : <View style={localStyles.blank} />}
      </View>
      {line && <ItemSeparator />}
      <View style={localStyles.errorContaner}>
        {errorText ? (
          <Text style={localStyles.errorText}>Ошибка: {errorText}</Text>
        ) : (
          <View style={localStyles.blankError} />
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  blankError: {
    height: 20,
  },
  container: {
    // borderWidth: 1,
  },
  blank: {
    width: 20,
  },
  errorText: {
    color: '#cc5933',
    fontSize: 15,
    textAlign: 'center',
  },
  errorContaner: {
    // justifyContent: 'center',
    height: 20,
  },
  headerContaner: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 20,
    height: 20,
  },
  text: {
    color: '#333536',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export { SubTitle };
