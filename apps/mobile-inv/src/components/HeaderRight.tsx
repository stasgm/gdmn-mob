import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface IProps {
  text: string;
  onPress: () => void;
}

const HeaderRight = ({ text, onPress }: IProps) => {
  return (
    <Button onPress={onPress} mode="text" style={localStyles.marginRight}>
      {text}
    </Button>
  );
};

export { HeaderRight };

const localStyles = StyleSheet.create({
  marginRight: {
    marginRight: 0,
  },
});
