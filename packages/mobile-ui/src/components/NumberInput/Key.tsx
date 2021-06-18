import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from 'react-native-paper';

interface IKeyProps {
  title: string;
  grow?: number;
  operation?: boolean;
  onPress: () => void;
}

const Key = ({ title, grow = 1, operation, onPress }: IKeyProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          flexGrow: grow,
          paddingBottom: grow > 1 ? grow : 0,
        },
      ]}>
      <Text style={[styles.text, { color: operation ? Colors.blue600 : Colors.black }]}>{title}</Text>
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
  },
  text: {
    fontSize: 25,
  },
});
