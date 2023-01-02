import { globalColors } from '@lib/mobile-ui';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface IKeyProps {
  title: string;
  grow?: number;
  operation?: boolean;
  onPress: () => void;
}

const Key = ({ title, grow = 1, operation, onPress }: IKeyProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderColor: colors.border,

          backgroundColor: title === '=' ? globalColors.backgroundLight : operation ? colors.background : colors.card,
        },
        // eslint-disable-next-line react-native/no-inline-styles
        {
          flexGrow: grow,
          paddingBottom: grow > 1 ? grow : 0,
        },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export { Key, IKeyProps };

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    margin: 1,
    borderWidth: 1,
    borderRadius: 5,
  },
  text: {
    fontSize: 25,
  },
});
