import React from 'react';
import { Text, View, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';

import styles from '../../styles/global';

import { ItemSeparator } from '../ItemSeparator';

import localStyles from './styles';

interface IProps {
  line?: boolean;
  style?: StyleProp<ViewStyle>;
  errorText?: string;
  infoRow?: boolean;
  loadIcon?: boolean;
  children: string;
}

const ScreenTitle = ({ children, style, loadIcon, errorText, line = true, infoRow = true }: IProps) => {
  return (
    <View style={[localStyles.container, styles.subHeader, style]}>
      <View style={localStyles.headerContaner}>
        <Text style={localStyles.text}>{children.toUpperCase()}</Text>
        {loadIcon ? <ActivityIndicator size="small" color="#70667D" /> : <View style={localStyles.blank} />}
      </View>
      {line && <ItemSeparator />}
      {infoRow && (
        <View style={localStyles.errorContaner}>
          {errorText ? (
            <Text style={localStyles.errorText}>Ошибка: {errorText}</Text>
          ) : (
            <View style={localStyles.blankError} />
          )}
        </View>
      )}
    </View>
  );
};

export default ScreenTitle;
