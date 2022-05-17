/* eslint-disable react-native/no-unused-styles */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { selectStatus, selectError } from '../features/todos/store';
import { useAppSelector } from '../store';

// const SHOW_TOAST_MESSAGE = "TEST";

// interface Props {
//   children: React.ReactNode;
// }

const colors = {
  info: '#343a40',
  success: '#28a745',
  danger: '#dc3545',
};

const Notification = () => {
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageType, setMessageType] = useState<keyof typeof colors>('danger');
  const [message, setMessage] = useState<string | null>(null);

  // eslint-disable-next-line no-undef
  const timeOutRef = useRef<NodeJS.Timer | null>(null);
  const [timeOutDuration, setTimeOutDuration] = useState(5000);
  const animatedOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    };
  }, []);

  useEffect(() => {
    if (!error && status !== 'error') {
      return;
    }

    setMessage(error);
  }, [error, status]);

  const closeToast = useCallback(() => {
    setMessage(null);
    setTimeOutDuration(5000);

    animatedOpacity.value = withTiming(0);

    if (timeOutRef.current) {
      clearInterval(timeOutRef.current);
    }
  }, [animatedOpacity]);

  useEffect(() => {
    if (!message) {
      return;
    }

    timeOutRef.current = setInterval(() => {
      if (timeOutDuration === 0) {
        closeToast();
      } else {
        setTimeOutDuration((prev) => prev - 1000);
      }
    }, 1000);

    return () => {
      if (timeOutRef.current) {
        clearInterval(timeOutRef.current);
      }
    };
  }, [closeToast, message, timeOutDuration]);

  useEffect(() => {
    if (message) {
      animatedOpacity.value = withTiming(1, { duration: 1000 });
    }
  }, [message, animatedOpacity]);

  return (
    <Animated.View style={[styles({ backgroundColor: colors[messageType] }).container, animatedStyle]}>
      <TouchableOpacity onPress={closeToast}>
        <Text style={styles().text}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface StyleProps {
  backgroundColor: any;
}

export const styles = (props?: StyleProps) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 100,
      left: '2%',
      right: '2%',
      backgroundColor: '#999',
      borderLeftColor: props?.backgroundColor,
      borderLeftWidth: 10,
      zIndex: 999999,
      elevation: 3,
      borderRadius: 6,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    text: {
      padding: 20,
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
  });

export default Notification;
