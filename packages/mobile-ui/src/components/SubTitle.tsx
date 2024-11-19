import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

import { useTheme } from 'react-native-paper';

interface IProps {
  children?: string;
  style?: StyleProp<ViewStyle>;
}

const SubTitle = ({ children, style }: IProps) => {
  const { colors } = useTheme();
  return (
    <View style={[localStyles.titleContainer, style]}>
      <Text style={[{ color: colors.primary }, localStyles.titleText]}>{children?.toUpperCase()}</Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  titleContainer: {
    marginTop: 0,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SubTitle;
