import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface IProps {
  children?: string;
  style?: StyleProp<ViewStyle>;
}

const SubTitle = ({ children, style }: IProps) => {
  return (
    <View style={[localStyles.titleContainer, style]}>
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SubTitle;
