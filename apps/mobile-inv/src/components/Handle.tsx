import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { interpolate, Extrapolate } from 'react-native-reanimated';
import { transformOrigin, toRad } from 'react-native-redash';

type HandleProps = BottomSheetHandleProps;

const Handle: React.FC<HandleProps> = ({ animatedIndex }) => {
  //#region animations
  const borderTopRadius = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [1, 2],
        outputRange: [20, 0],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex],
  );
  const indicatorTransformOriginY = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [0, 1, 2],
        outputRange: [-1, 0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex],
  );
  const leftIndicatorRotate = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [0, 1, 2],
        outputRange: [toRad(-30), 0, toRad(30)],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex],
  );
  const rightIndicatorRotate = interpolate(animatedIndex, {
    inputRange: [0, 1, 2],
    outputRange: [toRad(30), 0, toRad(-30)],
    extrapolate: Extrapolate.CLAMP,
  });
  //#endregion

  //#region styles
  const containerStyle = useMemo(
    () => [
      styles.header,
      {
        borderTopLeftRadius: borderTopRadius,
        borderTopRightRadius: borderTopRadius,
      },
    ],
    [borderTopRadius],
  );
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator,
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY },
        {
          rotate: leftIndicatorRotate,
          translateX: -5,
        },
      ),
    }),
    [indicatorTransformOriginY, leftIndicatorRotate],
  );
  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator,
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY },
        {
          rotate: rightIndicatorRotate,
          translateX: 5,
        },
      ),
    }),
    [indicatorTransformOriginY, rightIndicatorRotate],
  );
  //#endregion

  // render
  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={leftIndicatorStyle} />
      <Animated.View style={rightIndicatorStyle} />
    </Animated.View>
  );
};

export default Handle;

const styles = StyleSheet.create({
  header: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    elevation: 16,
    justifyContent: 'center',
    paddingVertical: 14,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  indicator: {
    backgroundColor: '#999',
    height: 4,
    position: 'absolute',
    width: 10,
  },
  leftIndicator: {
    borderBottomStartRadius: 2,
    borderTopStartRadius: 2,
  },
  rightIndicator: {
    borderBottomEndRadius: 2,
    borderTopEndRadius: 2,
  },
});
