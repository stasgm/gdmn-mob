import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IListItem } from '@lib/mobile-types';

type Props = {
  options: IListItem[];
  activeButtonId?: string;
  onChange: (option: IListItem) => void;
  directionRow?: boolean;
};

const RadioGroup = ({ options, onChange, activeButtonId, directionRow }: Props) => {
  const onPress = useCallback(
    (option: IListItem) => {
      if (option.id === activeButtonId) {
        return;
      }
      onChange(option);
    },
    [onChange, activeButtonId],
  );

  return (
    <View
      style={{
        flexDirection: directionRow ? 'row' : 'column',
        justifyContent: directionRow ? 'space-between' : 'center',
      }}
    >
      {options.map((option) => {
        return (
          <TouchableHighlight
            activeOpacity={0.4}
            key={option.id}
            style={localStyles.item}
            underlayColor="#DDDDDD"
            onPress={() => onPress(option)}
          >
            <>
              <Circle active={activeButtonId === option.id} />
              <Text style={[localStyles.radioText, { flex: directionRow ? 0 : 1 }]}>{option.value}</Text>
            </>
          </TouchableHighlight>
        );
      })}
    </View>
  );
};

interface ICircleProps {
  active?: boolean;
}

const Circle = ({ active }: ICircleProps) => {
  const { colors } = useTheme();

  return (
    <View style={[localStyles.radioCircle, { borderColor: colors.primary }]}>
      {active && <View style={[localStyles.selectedRb, { backgroundColor: colors.primary }]} />}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#FFF',
    marginHorizontal: 5,
  },
  radioCircle: {
    margin: 5,
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  radioText: {
    color: '#000',
    flex: 1,
    fontSize: 16,
    marginRight: 20,
  },
  selectedRb: {
    borderRadius: 50,
    height: 10,
    width: 10,
  },
});

export { RadioGroup };
