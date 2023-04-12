import React, { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const Checkbox = ({ title, selected, onSelect }: { title: string; selected: boolean; onSelect: () => void }) => {
  const { colors } = useTheme();

  const checkboxStyle = useMemo(
    () => [
      styles.container,
      {
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : colors.background,
      },
    ],
    [colors.background, colors.border, colors.primary, selected],
  );

  const textStyle = useMemo(
    () => [styles.text, { color: selected ? colors.background : colors.text }],
    [colors.background, colors.text, selected],
  );

  const borderColor = useMemo(() => (selected ? 'white' : colors.border), [colors.border, selected]);

  const iconName = useMemo(() => (selected ? 'check-circle-outline' : 'circle-outline') as Icon, [selected]);

  return (
    <TouchableOpacity style={checkboxStyle} onPress={onSelect}>
      <MaterialCommunityIcons name={iconName} size={20} color={borderColor} />
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  text: {
    marginRight: 5,
    marginLeft: 5,
  },
});

export default Checkbox;
