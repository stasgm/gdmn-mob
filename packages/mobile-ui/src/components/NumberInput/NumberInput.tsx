import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, BackHandler } from 'react-native';

import { TouchableOpacity } from '@gorhom/bottom-sheet';

import { NumberKeypad } from './NumberKeypad';
import { Input } from './Input';

interface IProps {
  label?: string;
  value: string;
  isKeyboardVisible: boolean;
  visibleOperation?: boolean;
  setValue: (newValue: string) => void;
  handlePress: () => void;
}

const NumberInput = ({
  isKeyboardVisible,
  label = '',
  value,
  visibleOperation = false,
  setValue,
  handlePress,
}: IProps) => {
  useFocusEffect(
    React.useCallback(() => {
      const handleBack = () => {
        if (isKeyboardVisible) {
          handlePress();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', handleBack);

      return () => BackHandler.removeEventListener('hardwareBackPress', handleBack);
    }, [isKeyboardVisible, handlePress]),
  );

  return (
    <>
      <Input label={label} onPress={handlePress} isFocus={isKeyboardVisible} value={value} />
      {isKeyboardVisible && (
        <View style={styles.keypad}>
          <TouchableOpacity style={{ height: '100%', width: '100%' }} onPress={handlePress} />
          <NumberKeypad
            oldValue={value}
            visibleOperation={visibleOperation}
            handelApply={setValue}
            handelDismiss={handlePress}
          />
        </View>
      )}
    </>
  );
};

export { NumberInput };

const styles = StyleSheet.create({
  keypad: {
    justifyContent: 'flex-end',
    position: 'absolute',
    height: '100%',
    width: '100%',
    //top: 0,
    //zIndex: 1,
  },
  marginRight: {
    alignItems: 'center',
    marginRight: 10,
  },
});
