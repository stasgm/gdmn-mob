import React, { ReactNode, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

export interface ListItemProps {
  children?: ReactNode;
  onPress: (name: 'edit' | 'copy' | 'delete') => void;
  edit?: boolean;
  copy?: boolean;
  del?: boolean;
}

const SwipeItem = ({ children, onPress, edit = true, copy = true, del = true }: ListItemProps) => {
  const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

  let ref = useRef(null);

  const updateRef = (_ref: any) => {
    ref = _ref;
  };

  const renderRightActions = (progress: unknown) => (
    <View style={localStyles.swipeViewItem}>
      {edit && renderRightAction('edit', 'file-document-edit', '#ffab00', 120, progress)}
      {copy && renderRightAction('copy', 'content-copy', '#00aaff', 120, progress)}
      {del && renderRightAction('delete', 'delete-forever', '#dd2c00', 60, progress)}
    </View>
  );

  const renderRightAction = (name: 'edit' | 'copy' | 'delete', icon: any, color: any, x: any, progress: any) => {
    const trans: Animated.AnimatedInterpolation = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [x, 0, 1],
    });

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[localStyles.rightAction, { backgroundColor: color }]}
          onPress={() => {
            onPress(name);
            (ref as unknown as Swipeable).close();
          }}
        >
          <AnimatedIcon name={icon} size={30} color="#fff" style={localStyles.actionIcon} />
        </RectButton>
      </Animated.View>
    );
  };

  return (
    <Swipeable friction={2} renderRightActions={(progress) => renderRightActions(progress)} ref={updateRef}>
      <View>{children}</View>
    </Swipeable>
  );
};

const localStyles = StyleSheet.create({
  actionIcon: {
    marginHorizontal: 10,
    width: 30,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  swipeViewItem: {
    flexDirection: 'row',
    width: 120,
  },
});

export default SwipeItem;
