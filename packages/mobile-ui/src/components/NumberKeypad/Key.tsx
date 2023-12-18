import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native';

import globalColors from '../../styles/colors';

interface IKeyProps {
  title: string;
  grow?: number;
  operation?: boolean;
  onPress: () => void;
}

const Key = ({ title, grow = 1, operation, onPress }: IKeyProps) => {
  const viewStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      flexGrow: grow,
      paddingBottom: grow > 1 ? grow : 0,
    }),
    [grow],
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderColor: globalColors.border,
          backgroundColor:
            title === '=' ? globalColors.backgroundLight : operation ? globalColors.background : globalColors.card,
        },
        viewStyle,
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
