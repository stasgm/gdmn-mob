import React from 'react';
import { Text, View, StyleSheet, ImageStyle, TextStyle, ViewStyle } from 'react-native';

interface IProps {
  children?: string;
  styles?: ImageStyle | TextStyle | ViewStyle;
}

const SubTitle = ({ children, styles }: IProps) => {
  return (
    <View style={[localStyles.titleContainer, styles]}>
      <Text style={localStyles.titleText}>{children?.toUpperCase()}</Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  titleContainer: {
    marginTop: 0,
  },
  titleText: {
    color: '#333536',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SubTitle;
