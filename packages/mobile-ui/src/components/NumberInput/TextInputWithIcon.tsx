import { useTheme } from '@react-navigation/native';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Colors } from 'react-native-paper';

interface IProps {
  label: string;
  value: string;
  children: ReactNode;
  isFocus?: boolean;
  onPress: () => void;
}

const TextInputWithIcon = ({ label, value, onPress, children: icon, isFocus = false }: IProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderBottomWidth: isFocus ? 2 : 1,
          borderColor: isFocus ? colors.primary : Colors.grey400,
          marginBottom: isFocus ? 0 : 0.25,
        },
      ]}>
      <Text style={[styles.subdivisionText, { color: colors.primary }]}>{label}</Text>
      <View style={styles.containerDate}>
        <Text style={[styles.textDate, { color: colors.text }]}>{value}</Text>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export { TextInputWithIcon };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  containerDate: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  subdivisionText: {
    fontSize: 11,
    paddingLeft: 12,
    textAlign: 'left',
  },
  textDate: {
    flex: 1,
    flexGrow: 4,
    fontSize: 16,
    paddingLeft: 12,
  },
});
