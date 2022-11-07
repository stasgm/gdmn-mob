import React, { useState } from 'react';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { appActions, useDispatch, useSelector } from '@lib/store';
import { StyleSheet, Modal, View, ScrollView, Alert } from 'react-native';

import { Button, Dialog, useTheme } from 'react-native-paper';

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
  const { requestNotice, errorNotice, syncDate, showSyncInfo, loading } = useSelector((state) => state.app);
  const settings = useSelector((state) => state.settings?.data);
  const synchPeriod = (settings.synchPeriod?.data as number) || 10;
  const [errorListVisible, setErrorListVisible] = useState(false);

  const onSync = () => {
    //Отрисовать окно синхронизации
    dispatch(appActions.setShowSyncInfo(true));
    //Если идет процесс, то выходим
    if (loading) {
      return;
    }
    //В первый раз выполняем синхронизацию
    if (!syncDate) {
      onSyncClick();
      return;
    }
    //Определяем, сколько минут с прошлой синхронизации
    //и если меньше, чем synchPeriod, то предупреждаем и выходим
    //иначе - выполняем синхронизацию
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
  };

  const onDismissDialog = () => {
    dispatch(appActions.setShowSyncInfo(false));
    setErrorListVisible(false);
    if (!loading) {
      dispatch(appActions.clearRequestNotice());
      dispatch(appActions.clearErrorNotice());
    }
  };

  return (
    <>
      <Modal animationType="fade" visible={showSyncInfo} statusBarTranslucent={true}>
        <Dialog visible={showSyncInfo} onDismiss={onDismissDialog} style={localStyles.dialog}>
          <Dialog.Title>
            <View style={styles.containerCenter}>
              <LargeText style={localStyles.dialogTitle}>
                {loading
                  ? 'Выполняются операции:'
                  : errorNotice.length
                  ? 'Выполнено с ошибками!'
                  : 'Выполнено успешно!'}
              </LargeText>
            </View>
          </Dialog.Title>
          <Dialog.Content style={localStyles.content}>
            <ScrollView>
              {errorListVisible && errorNotice.length ? (
                errorNotice
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((note, key) => (
                    <MediumText key={key}>
                      {errorNotice.length - key}. {note.message}
                      {key === 0 && loading ? '...' : ''}
                    </MediumText>
                  ))
              ) : requestNotice.length ? (
                requestNotice
                  .sort((a, b) => new Date(b.started).getTime() - new Date(a.started).getTime())
                  .map((note, key) => (
                    <View key={key} style={{ flexDirection: 'row' }}>
                      <MediumText>
                        {requestNotice.length - key}. {note.message}
                        {key === 0 && loading ? '...' : ''}
                      </MediumText>
                      {key === 0 && loading && <AppActivityIndicator style={{}} />}
                    </View>
                  ))
              ) : (
                <MediumText>{`Синхронизация данных${loading ? '...' : ''}`}</MediumText>
              )}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions style={localStyles.action}>
            {!!errorNotice.length && !loading ? (
              <Button onPress={() => setErrorListVisible(!errorListVisible)}>
                {errorListVisible ? 'Просмотреть операции' : 'Проcмотреть ошибки'}
              </Button>
            ) : null}
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
      {loading && (
        <View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}
        >
          <Button
            style={{ opacity: 0.7, borderRadius: 20 }}
            icon="sync"
            mode="contained"
            loading={true}
            onPress={() => dispatch(appActions.setShowSyncInfo(true))}
            uppercase={false}
            compact={true}
          >
            <MediumText style={localStyles.syncInfoText}>Синхронизация</MediumText>
          </Button>
        </View>
      )}
    </>
  );
};
const localStyles = StyleSheet.create({
  dialog: {
    height: 380,
  },
  dialogTitle: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '500',
  },
  text: {
    marginTop: -16,
  },
  content: {
    height: 240,
  },
  action: {
    height: 70,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  syncInfo: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 6,
    paddingVertical: 10,
    opacity: 0.5,
    bottom: 0,
  },
  syncInfoText: {
    fontSize: 8,
    color: 'white',
  },
});

export default DrawerNavigator;
