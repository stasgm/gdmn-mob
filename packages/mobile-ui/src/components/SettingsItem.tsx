import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading, Switch, TextInput, useTheme } from 'react-native-paper';
import { Input } from '@lib/mobile-ui';

type Props = {
  label: string;
  value: string | boolean | number | undefined;
  onValueChange: (newValue: any) => void;
};

const SettingsItem = ({ label, value, onValueChange }: Props) => {
  const { colors } = useTheme();

  return (
    <View>
      {/* <Subheading numberOfLines={5} style={localStyles.subHeading}>
        {label}
      </Subheading> */}
      {typeof value === 'boolean' ? (
        <View style={localStyles.container}>
          <Subheading numberOfLines={5} style={localStyles.subHeading}>
            {label}
          </Subheading>
          <Switch value={value} onValueChange={(item) => onValueChange(item)} />
        </View>
      ) : (
        <View style={localStyles.settingsContainer}>
          {typeof value === 'number' ? (
            // <TextInput
            //   value={value === 0 ? '' : value.toString()}
            //   onChangeText={(text) => onValueChange(text !== '' ? Number(text) : 0)}
            //   mode="outlined"
            //   keyboardType={'numeric'}
            //   style={localStyles.input}
            //   theme={{
            //     colors: {
            //       primary: colors.primary,
            //       text: colors.text,
            //       placeholder: colors.primary,
            //       background: colors.surface,
            //     },
            //   }}
            // />
            <Input
              label={label}
              value={value === 0 ? '' : value.toString()}
              onChangeText={(text) => onValueChange(text !== '' ? Number(text) : 0)}
              keyboardType={'numeric'}
            />
          ) : typeof value === 'string' ? (
            <Input label={label} value={value} onChangeText={(text) => onValueChange(text)} keyboardType={'default'} />
          ) : (
            <Input label={label} value={value} onChangeText={(text) => onValueChange(text)} keyboardType={'default'} />
          )}
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingHorizontal: 12,
    // width: '100%',
  },
  settingsContainer: {
    // alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingTop: 6,
    width: '100%',
  },
  input: {
    height: 32,
  },
  subHeading: {
    width: '85%',
    fontSize: 14,
  },
});

export default SettingsItem;
