import React from 'react';
import { View, Text } from 'react-native';

import Theme from '../configuration/Theme';

import { AppScreen } from '../primitives/AppView';
import globalStyles from '../styles/global';

import PrimeButton from './PrimeButton';

import SubTitle from './SubTitle';

interface IProps {
  error: Error;
  resetError: () => void;
}

const AppFallback = (props: IProps) => (
  <AppScreen>
    <View style={globalStyles.container}>
      <SubTitle>Произошла ошибка!</SubTitle>
      <Text style={globalStyles.text}>{props.error.toString()}</Text>
      <PrimeButton onPress={props.resetError} style={{ backgroundColor: Theme.colors.error }}>
        {'Обновить'}
      </PrimeButton>
    </View>
  </AppScreen>
);

export default AppFallback;
