import React, { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

export const Checkbox = ({ title, selected, onSelect }: { title: string; selected: boolean; onSelect: () => void }) => {
  const { colors } = useTheme();

  const viewStyle = useMemo(
    () => [
      styles.container,
      {
        borderColor: selected ? colors.primary : colors.card,
        backgroundColor: selected ? colors.primary : colors.background,
      },
    ],
    [colors.background, colors.card, colors.primary, selected],
  );

  const textStyle = useMemo(
    () => [styles.text, { color: selected ? colors.background : colors.text }],
    [colors.background, colors.text, selected],
  );

  return (
    <TouchableOpacity style={viewStyle} onPress={onSelect}>
      <MaterialCommunityIcons
        name={(selected ? 'check-circle-outline' : 'circle-outline') as Icon}
        size={20}
        color={selected ? 'white' : colors.card}
      />
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
