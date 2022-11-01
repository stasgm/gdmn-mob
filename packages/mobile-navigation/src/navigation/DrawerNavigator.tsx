import React, { useEffect, useState } from 'react';

import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { appActions, useDispatch, useSelector } from '@lib/store';
import { StyleSheet, Modal, View, ScrollView, Alert } from 'react-native';

import { Button, Dialog } from 'react-native-paper';

import { AppActivityIndicator, globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { INavItem, RootDrawerParamList } from './types';

import SettingsNavigator from './Root/SettingsNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
import ProfileNavigator from './Root/ProfileNavigator';
import InformationNavigator from './Root/InformationNavigator';
import { DrawerContent } from './drawerContent';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const baseNavList: INavItem[] = [
  {
    name: 'ReferencesNav',
    component: ReferencesNavigator,
    icon: 'file-cabinet',
    title: 'Справочники',
  },
  {
    name: 'SettingsNav',
    component: SettingsNavigator,
    icon: 'tune',
    title: 'Настройки',
  },
  {
    name: 'ProfileNav',
    component: ProfileNavigator,
    icon: 'account-circle-outline',
    title: 'Профиль',
  },
  {
    name: 'InformationNav',
    component: InformationNavigator,
    icon: 'information-outline',
    title: 'О программе',
  },
];

export interface IProps {
  items?: INavItem[];
  onSyncClick: () => void;
}

const getMinsUntilNextSynch = (lastSyncTime: Date, synchPeriod: number) => {
  const nextTime = new Date(lastSyncTime);
  nextTime.setMinutes(nextTime.getMinutes() + synchPeriod);
  return Math.round((nextTime.getTime() - new Date().getTime()) / 60000);
};

const DrawerNavigator = ({ onSyncClick, items }: IProps) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navList: INavItem[] = [...(items || []), ...baseNavList];
  const appLoading = useSelector((state) => state.app.loading);
  const requestNotice = useSelector((state) => state.app.requestNotice);
  const syncDate = useSelector((state) => state.app.syncDate) as Date;
  const settings = useSelector((state) => state.settings?.data);
  const synchPeriod = (settings.synchPeriod?.data as number) || 10;
  const autoSync = (settings.autoSync?.data as boolean) || false;

  const [syncLoading, setSyncLoading] = useState(appLoading);

  const onSync = () => {
    if (appLoading) {
      setSyncLoading(true);
    } else {
      if (!syncDate) {
        onSyncClick();
        return;
      }

      const mins = getMinsUntilNextSynch(syncDate, synchPeriod);

      if (mins > 0) {
        Alert.alert(
          'Внимание!',
          // eslint-disable-next-line max-len
          `В настоящее время сервер обрабатывает запрос.\nПовторная синхронизация возможна через ${mins} мин.`,
          [{ text: 'OK' }],
        );
      } else {
        onSyncClick();
      }
    }
  };

  const onDismissDialog = () => {
    setSyncLoading(false);
    if (!appLoading) {
      dispatch(appActions.clearRequestNotice());
    }
  };

  useEffect(() => {
    if (appLoading && !autoSync) {
      setSyncLoading(appLoading);
    }
  }, [appLoading]);

  return (
    <>
      <Modal animationType="none" visible={syncLoading} statusBarTranslucent={true}>
        <Dialog visible={true} onDismiss={onDismissDialog}>
          <Dialog.Title>
            <View style={styles.containerCenter}>
              <LargeText style={localStyles.titleSize}>
                {appLoading ? 'Выполняются операции...' : 'Завершены операции:'}
              </LargeText>
              {appLoading && <AppActivityIndicator style={{}} />}
            </View>
          </Dialog.Title>
          <Dialog.Content style={{ height: 200 }}>
            <ScrollView>
              {requestNotice.length ? (
                requestNotice
                  .sort((a, b) => new Date(b.started).getTime() - new Date(a.started).getTime())
                  .map((note, key) => (
                    <MediumText key={key}>
                      {requestNotice.length - key}. {note.message}
                      {key === 0 && appLoading ? '...' : ''}
                    </MediumText>
                  ))
              ) : (
                <MediumText>{`Синхронизация данных${appLoading ? '...' : ''}`}</MediumText>
              )}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismissDialog}>Продолжить работу в приложении</Button>
          </Dialog.Actions>
        </Dialog>
      </Modal>
      <Drawer.Navigator
        useLegacyImplementation
        screenOptions={{
          drawerActiveBackgroundColor: colors.primary,
          drawerActiveTintColor: '#ffffff',
        }}
        drawerContent={(props) => <DrawerContent {...props} onSync={onSync} />}
      >
        {navList.map((item) => (
          <Drawer.Screen
            name={item.name}
            key={item.name}
            component={item.component}
            options={{
              headerShown: false,
              title: item.title,
              drawerLabelStyle: { fontSize: 16 },
              drawerIcon: (pr) => <Icon name={item.icon} {...pr} />,
            }}
          />
        ))}
      </Drawer.Navigator>
    </>
  );
};
const localStyles = StyleSheet.create({
  titleSize: {
    fontSize: 18,
    lineHeight: 18,
  },
});

export default DrawerNavigator;
