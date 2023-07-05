import localStyles from './styles';
import { Text, View } from 'react-native';
import { INamedEntity } from '@lib/types';
import { ScreenTitle, AppScreen, PrimeButton, globalStyles as styles, RoundButton } from '@lib/mobile-ui';

import { useEffect } from 'react';

type Props = {
  company?: INamedEntity;
  onLogout: () => void;
  onSetCompany: () => void;
  loading?: boolean;
};

const AppLoadScreen = (props: Props) => {
  const { onSetCompany, company, onLogout, loading = true } = props;

  useEffect(() => {
    //Так как организация всегда только одна
    //заполнение компании перенесено выше
    onSetCompany();
  }, [onSetCompany]);

  return (
    <>
      <AppScreen>
        <ScreenTitle loadIcon={loading}>Вход в компанию</ScreenTitle>
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
        <RoundButton icon="account" onPress={onLogout} disabled={loading} />
      </View>
    </>
  );
};

export default AppLoadScreen;
