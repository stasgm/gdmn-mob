import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

import { ScreenTitle, AppScreen, PrimeButton, globalStyles as styles, RoundButton } from '@lib/mobile-ui';
import { INamedEntity } from '@lib/types';

import localStyles from './styles';

type Props = {
  company?: INamedEntity;
  onLogout: () => void;
  onSetCompany: () => void;
  loading?: boolean;
};

const AppLoadScreen = (props: Props) => {
  const { onSetCompany, company, onLogout, loading } = props;

  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    //Так как организация всегда только одна
    //заполнение компании перенесено выше
    //Возможно, можно удалить компонент выбора компании
    company ? onSetCompany() : setError('Компания для пользователя не задана');
  }, [company, onSetCompany]);

  const handleLogOut = async () => {
    onLogout();
  };

  return (
    <>
      <AppScreen>
        <ScreenTitle loadIcon={loading} errorText={error || ''}>
          Вход в компанию
        </ScreenTitle>
        {company ? (
          <View style={localStyles.container}>
            <Text style={localStyles.serverName}>{company.name}</Text>
            <PrimeButton icon="sync" disabled={loading} onPress={onSetCompany}>
              Войти
            </PrimeButton>
          </View>
        ) : null}
      </AppScreen>
      <View style={styles.buttons}>
        <RoundButton icon="account" onPress={handleLogOut} disabled={loading} />
      </View>
    </>
  );
};

export default AppLoadScreen;
