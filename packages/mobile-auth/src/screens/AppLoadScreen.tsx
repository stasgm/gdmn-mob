import React, { useState, useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';

import { ScreenTitle, AppScreen, PrimeButton, globalStyles as styles, RoundButton } from '@lib/mobile-ui';
import { ICompany, INamedEntity } from '@lib/types';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import localStyles from './styles';

type Props = {
  company?: INamedEntity;
  onLogout: () => void;
  onSetCompany: (company: ICompany) => void;
};

const AppLoadScreen = (props: Props) => {
  const { onSetCompany, company, onLogout } = props;

  const [userCompany, setUserCompany] = useState<ICompany | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const dispatch = useAuthThunkDispatch();

  const loadCompany = useCallback(async () => {
    if (!company) {
      return;
    }

    setError(undefined);
    setLoading(true);

    const res = await dispatch(authActions.getCompany(company.id));
    if (res.type === 'AUTH/GET_COMPANY_SUCCESS') {
      setUserCompany(res.payload);
    } else if (res.type === 'AUTH/GET_COMPANY_FAILURE') {
      setError(res.payload.toLocaleLowerCase());
    }

    setLoading(false);
  }, [company, dispatch]);

  useEffect(() => {
    company ? loadCompany() : setError('Компания для пользователя не задана');
  }, [company, loadCompany]);

  useEffect(() => {
    // Если компания получена то загружаем данные и входим в компанию
    userCompany && onSetCompany(userCompany);
  }, [userCompany, onSetCompany]);

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
            <PrimeButton icon="sync" disabled={loading} onPress={loadCompany}>
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
