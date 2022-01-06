import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

export const Checkbox = ({ title, selected, onSelect }: { title: string; selected: boolean; onSelect: () => void }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: selected ? colors.primary : colors.disabled,
          backgroundColor: selected ? colors.primary : colors.background,
        },
      ]}
      onPress={onSelect}
    >
      <MaterialCommunityIcons
        name={(selected ? 'check-circle-outline' : 'circle-outline') as Icon}
        size={20}
        color={selected ? 'white' : colors.disabled}
      />
      <Text style={[styles.text, { color: selected ? colors.background : colors.text }]}>{title}</Text>
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
