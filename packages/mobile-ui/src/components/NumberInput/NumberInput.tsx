import React from 'react';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { StyleSheet, View, BackHandler, useWindowDimensions, Text, TouchableOpacity } from 'react-native';

import { styles as globalStyles } from '@lib/mobile-navigation/src/screens/References/styles';

import { NumberKeypad } from './NumberKeypad';

interface IProps {
  label?: string;
  value: string;
  isKeyboardVisible: boolean;
  position?: number;
  height?: number;
  visibleOperation?: boolean;
  setValue: (newValue: string) => void;
  handlePress: () => void;
}

const NumberInput = ({
  isKeyboardVisible,
  label = '',
  position = 0,
  height = 0,
  value,
  visibleOperation,
  setValue,
  handlePress,
}: IProps) => {
  const { colors } = useTheme();
  const heightW = useWindowDimensions().height;
  const headerHeight = useHeaderHeight();

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
      <TouchableOpacity onPress={handlePress} style={[globalStyles.item]}>
        <View style={globalStyles.details}>
          <Text style={[globalStyles.name, { color: colors.text }]}>{label}</Text>
          <Text style={[globalStyles.number, globalStyles.field, { color: colors.text }]}>{value}</Text>
        </View>
      </TouchableOpacity>
      {/*<TextInputWithIcon label={label} onPress={handlePress} isFocus={isKeyboardVisible} value={value}>
        <MaterialCommunityIcons style={styles.marginRight} size={20} color={colors.text} name="calculator-variant" />
  </TextInputWithIcon>*/}
      {isKeyboardVisible && (
        <View
          onLayout={(obj) => {
            console.log('onLayout', obj.nativeEvent.layout);
            console.log('heightW', heightW);
            console.log('headerHeight', headerHeight);
          }}
          style={[
            styles.keypad,
            {
              //flex: 1,
              //top: -position,
              //bottom: 0,
              height: heightW - headerHeight,
              backgroundColor: '#500',
              //height: '100%',
            },
          ]}>
          <NumberKeypad
            oldValue={value}
            visibleOperation={visibleOperation || false}
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
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    zIndex: 99999,
  },
  marginRight: {
    alignItems: 'center',
    marginRight: 10,
  },
});
