import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading, Switch } from 'react-native-paper';

type Props = {
  label: string;
  value: boolean;
  onValueChange: () => void;
};

const SettingsItem = ({ label, value, onValueChange }: Props) => {
  return (
    <View style={localStyles.container}>
      <Subheading numberOfLines={5} style={localStyles.subHeading}>
        {label}
      </Subheading>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  subHeading: {
    width: '85%',
  },
});

export default SettingsItem;
