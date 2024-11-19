import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Divider, MD2Theme, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/global';

interface IProps {
  colorLabel: string;
  title: string;
  children: React.ReactElement;
  onPress?: () => void;
  disabled?: boolean;
  isBlocked?: boolean;
  onSwipeOpen?: () => void;
  onSwipeClose?: () => void;
  isSwipeable?: boolean;
  isFromRoute?: boolean;
  editable?: boolean;
}

const InfoBlock = ({
  colorLabel,
  title,
  children,
  disabled = false,
  onPress,
  isBlocked = false,
  isFromRoute = false,
  editable = false,
}: IProps) => {
  const { dark, colors } = usePaperTheme<MD2Theme>();
  const colorsTheme = useTheme().colors;
  return (
    <View style={[styles.flexDirectionRow, localStyles.box, { borderColor: colors.disabled }]}>
      <View style={[localStyles.label, { backgroundColor: colorLabel }]} />
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={colors.backdrop}
        onPress={onPress}
        disabled={disabled}
        style={localStyles.info}
      >
        <>
          <Text style={[localStyles.titleText, { color: colorsTheme.text }]}>{title}</Text>
          <Divider theme={{ dark }} />
          <View style={localStyles.infoContainer}>
            <View style={localStyles.childrenView}>{children}</View>
            {isFromRoute && (
              <MaterialCommunityIcons name="routes" color={colors.onSurface} size={20} style={localStyles.iconEdit} />
            )}
            {isBlocked ? (
              <MaterialCommunityIcons
                name="lock-outline"
                color={colors.onSurface}
                size={20}
                style={localStyles.iconEdit}
              />
            ) : null}
            {!disabled && editable && onPress ? (
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                color={colors.onSurface}
                size={20}
                style={localStyles.iconEdit}
              />
            ) : null}
          </View>
        </>
      </TouchableHighlight>
    </View>
  );
};

export default InfoBlock;

const localStyles = StyleSheet.create({
  box: {
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  info: {
    flex: 1,
    padding: 5,
    paddingLeft: 10,
  },
  label: {
    width: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconEdit: {
    alignSelf: 'flex-end',
  },
  childrenView: {
    alignSelf: 'center',
    flexGrow: 1,
    width: '80%',
  },
});
