import React, { useState, useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';

import { ScreenTitle, AppScreen, PrimeButton, globalStyles as styles, RoundButton } from '@lib/mobile-ui';
import { ICompany, INamedEntity } from '@lib/types';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import localStyles from './styles';

type Props = {
  company?: INamedEntity;
  onLogout: () => void;
  // onSetCompany: (company: ICompany) => void;
  onSetCompany: () => void;
  loading?: boolean;
};

const AppLoadScreen = (props: Props) => {
  const { onSetCompany, company, onLogout, loading } = props;

  // const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const dispatch = useAuthThunkDispatch();

  // const loadCompany = useCallback(async () => {
  //   if (!company) {
  //     return;
  //   }

  //   setError(undefined);
  //   setLoading(true);

  //   const res = await dispatch(authActions.getCompany(company.id));
  //   if (res.type === 'AUTH/GET_COMPANY_SUCCESS') {
  //     onSetCompany(res.payload);
  //   } else if (res.type === 'AUTH/GET_COMPANY_FAILURE') {
  //     setLoading(false);
  //     setError(res.payload.toLocaleLowerCase());
  //   }
  // }, [company, dispatch, onSetCompany]);

  useEffect(() => {
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
