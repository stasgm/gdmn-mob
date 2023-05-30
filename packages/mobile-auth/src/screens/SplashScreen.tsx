import React, { useEffect } from 'react';
import { Alert, Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { getInstallReferrerAsync } from 'expo-application';

import { globalStyles as styles, PrimeButton, RoundButton, AppScreen, ScreenTitle } from '@lib/mobile-ui';
import { IApiConfig } from '@lib/client-types';
import { appActions, useDispatch, useSelector } from '@lib/store';

import Constants from 'expo-constants';

import VersionCheck from 'react-native-version-check';

import { AsyncAlert, generateId } from '@lib/mobile-hooks';

import { AuthStackParamList } from '../navigation/types';

import localStyles from './styles';

type Props = {
  settings: IApiConfig | undefined;
  onCheckDevice: () => void;
  onBreakConnection?: () => void;
};

const SplashScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const { onCheckDevice, onBreakConnection } = props;
  const { error, loading, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkForUpdates = async () => {
      const packageName = Constants.manifest?.android?.package || '';
      const currentVersion = Constants.manifest?.version;

      const storeVersion = await VersionCheck.getLatestVersion({
        packageName,
      });

      if (storeVersion !== currentVersion) {
        const installerPackageName = await getInstallReferrerAsync();
        const appName = Constants.manifest?.name || '';

        if (installerPackageName.includes('utm_source=google-play')) {
          const googlePlayUrl = await VersionCheck.getPlayStoreUrl({
            packageName,
          });

          const response = await AsyncAlert(
            appName,
            `Доступна новая версия приложения v${storeVersion}!\n\n Обновить из Google Play?`,
          );

          if (response === 'YES') {
            try {
              await Linking.openURL(googlePlayUrl);
            } catch (err) {
              dispatch(
                appActions.addErrors([
                  {
                    id: generateId(),
                    name: 'update app: openURL',
                    date: new Date().toISOString(),
                    message: `Невозможно перейти по ссылке ${googlePlayUrl}. ${JSON.stringify(err)}}`,
                  },
                ]),
              );
              Alert.alert(
                'Внимание!',
                `Невозможно перейти по ссылке ${googlePlayUrl}.\n\nПопробуйте обновить ${appName} из приложения Google Play.`,
                [{ text: 'OK' }],
              );
            }
          }
        } else {
          Alert.alert(
            appName,
            `Доступна новая версия приложения v${storeVersion}!\n\nВ зависимости от того, как вы устанавливали приложение, для обновления перейдите в Google Play, Huawei AppGallery или скачайте новый APK файл с сайта компании.`,
            [{ text: 'OK' }],
          );
        }
      }
    };

    checkForUpdates();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppScreen>
        <ScreenTitle loadIcon={loading} errorText={error ? status : ''}>
          Подключение к серверу
        </ScreenTitle>
        <View style={localStyles.container}>
          <PrimeButton
            icon={!loading ? 'apps' : 'block-helper'}
            onPress={!loading ? onCheckDevice : onBreakConnection}
            disabled={loading}
          >
            Подключиться
          </PrimeButton>
        </View>
      </AppScreen>
      <View style={styles.buttons}>
        <RoundButton icon="server" onPress={() => navigation.navigate('Config')} disabled={loading} />
      </View>
    </>
  );
};

export default SplashScreen;
