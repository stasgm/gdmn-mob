import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import AuthNavigator from '../../navigation/AuthNavigator';
import { useServiceStore } from '../../store';

/**
 * Компонент для загрузки ресурсов приложения
 */
const ConnectionScreen = () => {
  const {
    state: { serverUrl },
  } = useServiceStore();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (serverUrl !== undefined) {
      setLoading(false);
    }
  }, [serverUrl]);

  if (isLoading) {
    return <ActivityIndicator style={localStyles.container} size="large" color="#70667D" />;
  }

  return <AuthNavigator />;
};

export { ConnectionScreen };

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
