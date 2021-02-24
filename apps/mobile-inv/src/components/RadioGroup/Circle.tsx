import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';

type Props = {
  active: boolean;
  circleStyle: { [name: string]: string };
};

const Circle = ({ active, circleStyle }: Props) => {
  const [state, setState] = useState({
    animatedHeight: new Animated.Value(0),
    animatedWidth: new Animated.Value(0),
  });

  const setWidthHeight = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height;
      const width = event.nativeEvent.layout.width;

      return Animated.parallel([
        Animated.timing(state.animatedHeight, {
          toValue: active ? height - 6 : 0,
          duration: 200,
          useNativeDriver: true,
        }),

        Animated.timing(state.animatedWidth, {
          toValue: active ? width - 6 : 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [state.animatedHeight, state.animatedWidth, active],
  );

  return (
    <View key={+active} style={[styles.circle, circleStyle]} onLayout={setWidthHeight}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: circleStyle.fillColor,
            transform: [{ scaleY: state.animatedHeight }, { scaleX: state.animatedWidth }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderColor: '#000',
    borderRadius: 20,
    borderWidth: 0.8,
    height: 22,
    justifyContent: 'center',
    marginRight: 10,
    width: 22,
  },
  fill: {
    backgroundColor: '#279315',
    borderRadius: 20,
    height: 1,
    width: 1,
  },
});

export default Circle;
