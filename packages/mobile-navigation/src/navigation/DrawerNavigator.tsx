import React, { useMemo, useState } from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { appActions, authActions, useDispatch, useSelector } from '@lib/store';

import { Button, Dialog, Snackbar, useTheme, Text, MD2Theme } from 'react-native-paper';

import { globalStyles as styles, AppActivityIndicator, LargeText, MediumText } from '@lib/mobile-ui';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { INavItem, RootDrawerParamList } from './types';

import SettingsNavigator from './Root/SettingsNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
import ProfileNavigator from './Root/ProfileNavigator';
import InformationNavigator from './Root/InformationNavigator';
import { DrawerContent } from './drawerContent';
import DashboardNavigator from './Root/DashboardNavigator';

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
  dashboardScreens?: any;
  onSyncClick: () => void;
}

const DrawerNavigator = ({ onSyncClick, items, dashboardScreens }: IProps) => {
  const { colors } = useTheme<MD2Theme>();
  const dispatch = useDispatch();

  const dashboard: INavItem | undefined = useMemo(() => {
    if (items && dashboardScreens) {
      const DashboardComponent = () => <DashboardNavigator dashboardScreens={dashboardScreens} items={items} />;
      return {
        name: 'DashboardNav',
        component: DashboardComponent,
        icon: 'view-dashboard-outline',
        title: 'Дашборд',
      };
    } else return;
  }, [dashboardScreens, items]);

  const navList: INavItem[] = useMemo(
    () => (dashboard ? [dashboard, ...(items || []), ...baseNavList] : [...(items || []), ...baseNavList]),
    [items, dashboard],
  );

  const {
    requestNotice = [],
    errorNotice = [],
    syncDate,
    showSyncInfo = false,
    loading,
  } = useSelector((state) => state.app);

  const [errorListVisible, setErrorListVisible] = useState(false);
  const { errorMessage } = useSelector((state) => state.auth);

  const onSync = () => {
    //Если идет процесс, то выходим
    if (loading) {
      //Отрисовать окно синхронизации
      dispatch(appActions.setShowSyncInfo(true));
      return;
    }
    //В первый раз выполняем синхронизацию
    if (!syncDate) {
      dispatch(appActions.setShowSyncInfo(true));
      onSyncClick();
      return;
    }

    dispatch(appActions.setShowSyncInfo(true));
    onSyncClick();
  };

  const onDismissDialog = () => {
    dispatch(appActions.setShowSyncInfo(false));
    setErrorListVisible(false);
    if (!loading) {
      dispatch(appActions.clearRequestNotice());
      dispatch(appActions.clearErrorNotice());
    }
  };

  const closeErrBar = () => {
    dispatch(authActions.setErrorMessage(''));
    dispatch(authActions.clearError());
  };

  return (
    <>
      <Modal animationType="fade" visible={showSyncInfo} statusBarTranslucent={true}>
        <Dialog visible={showSyncInfo} onDismiss={onDismissDialog} style={localStyles.dialog}>
          <Dialog.Title>
            <View style={styles.containerCenter}>
              <LargeText
                style={[
                  localStyles.dialogTitle,
                  { color: errorNotice.length && !loading ? colors.error : colors.text },
                ]}
              >
                {loading
                  ? 'Выполняются операции:'
                  : errorNotice.length
                  ? 'Закончено с ошибками!'
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
        <Snackbar
          visible={!!errorMessage}
          onDismiss={closeErrBar}
          style={{ backgroundColor: colors.error }}
          action={{
            icon: 'close',
            label: '',
            onPress: closeErrBar,
            color: 'white',
          }}
        >
          <Text style={{ color: 'white' }}>{errorMessage}</Text>
        </Snackbar>
      </Modal>
      <Drawer.Navigator
        screenOptions={{
          drawerActiveBackgroundColor: colors.primary,
          drawerActiveTintColor: '#ffffff',
          drawerStyle: { width: 270 },
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
