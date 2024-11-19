import React from 'react';
import { View, Text } from 'react-native';

import { MD2Theme, useTheme } from 'react-native-paper';

import { AppScreen } from '../primitives/AppView';
import globalStyles from '../styles/global';

import PrimeButton from './PrimeButton';

import SubTitle from './SubTitle';

interface IProps {
  error: Error;
  resetError: () => void;
}

const AppFallback = (props: IProps) => {
  const { colors } = useTheme<MD2Theme>();

  return (
    <AppScreen>
      <View style={globalStyles.container}>
        <SubTitle>Произошла ошибка!</SubTitle>
        <Text style={[{ color: colors.text }, globalStyles.text]}>{props.error.toString()}</Text>
        <PrimeButton onPress={props.resetError} style={{ backgroundColor: colors.error }}>
          {'Обновить'}
        </PrimeButton>
      </View>
    </AppScreen>
  );
};

export default AppFallback;
