import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Divider } from 'react-native-paper';

import Swipeable from 'react-native-gesture-handler/Swipeable';

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
}

const InfoBlock = ({
  colorLabel,
  title,
  children,
  disabled = false,
  onPress,
  onSwipeOpen,
  onSwipeClose,
  isBlocked = false,
  isSwipeable,
}: IProps) => {
  const ref = useRef(null);

  const infoBlock = (
    <View style={[styles.flexDirectionRow, localStyles.box]}>
      <View style={[localStyles.label, { backgroundColor: colorLabel }]} />
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor="#DDDDDD"
        onPress={onPress}
        disabled={disabled}
        style={localStyles.info}
      >
        <>
          <Text style={localStyles.titleText}>{title}</Text>
          <Divider />
          <View style={localStyles.infoContainer}>
            <View style={{ alignSelf: 'center', flexGrow: 1, width: '80%' }}>{children}</View>
            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} style={localStyles.iconEdit} /> : null}
            {!disabled && onPress ? (
              <MaterialCommunityIcons name="file-document-edit-outline" size={20} style={localStyles.iconEdit} />
            ) : null}
          </View>
        </>
      </TouchableHighlight>
    </View>
  );

  return (
    <>
      {isSwipeable ? (
        <Swipeable friction={2} ref={ref} onSwipeableWillOpen={onSwipeOpen} onSwipeableWillClose={onSwipeClose}>
          {infoBlock}
        </Swipeable>
      ) : (
        infoBlock
      )}
    </>
  );
};

export default InfoBlock;

const localStyles = StyleSheet.create({
  box: {
    borderColor: '#8888',
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
    backgroundColor: '#3914AF',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  titleText: {
    color: '#333536',
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
});
