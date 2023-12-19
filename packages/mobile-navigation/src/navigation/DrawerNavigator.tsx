import { INavItem, RootDrawerParamList } from './types';
import SettingsNavigator from './Root/SettingsNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
import ProfileNavigator from './Root/ProfileNavigator';
import InformationNavigator from './Root/InformationNavigator';
import { DrawerContent } from './drawerContent';
import DashboardNavigator from './Root/DashboardNavigator';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { appActions, authActions, useDispatch, useSelector } from '@lib/store';

import { Button, Dialog, Snackbar, useTheme, Text, MD2Theme } from 'react-native-paper';

import { globalStyles as styles, AppActivityIndicator, LargeText, MediumText } from '@lib/mobile-ui';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

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

  const DashboardComponent = useCallback(
    () => <DashboardNavigator dashboardScreens={dashboardScreens} items={items} />,
    [dashboardScreens, items],
  );

  const dashboard: INavItem | undefined = useMemo(() => {
    if (items && dashboardScreens) {
      return {
        name: 'DashboardNav',
        component: DashboardComponent,
        icon: 'view-dashboard-outline',
        title: 'Дашборд',
      };
    } else {
      return;
    }
  }, [DashboardComponent, dashboardScreens, items]);

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

  const onSync = useCallback(() => {
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
  }, [loading, syncDate, dispatch, onSyncClick]);

  const onDismissDialog = useCallback(() => {
    dispatch(appActions.setShowSyncInfo(false));
    setErrorListVisible(false);
    if (!loading) {
      dispatch(appActions.clearRequestNotice());
      dispatch(appActions.clearErrorNotice());
    }
  }, [loading, dispatch]);

  const closeErrBar = useCallback(() => {
    dispatch(authActions.setErrorMessage(''));
    dispatch(authActions.clearError());
  }, [dispatch]);

  const drawerContent = (props: any) => <DrawerContent {...props} onSync={onSync} />;

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
                    <View key={key} style={localStyles.view}>
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
          <Text style={localStyles.snackText}>{errorMessage}</Text>
        </Snackbar>
      </Modal>
      <Drawer.Navigator
        screenOptions={{
          drawerActiveBackgroundColor: colors.primary,
          drawerActiveTintColor: '#ffffff',
          drawerStyle: { width: 270 },
        }}
        drawerContent={drawerContent}
      >
        {navList.map((item) => {
          const drawerIcon = (pr: any) => <Icon name={item.icon} {...pr} />;

          return (
            <Drawer.Screen
              name={item.name}
              key={item.name}
              component={item.component}
              options={{
                headerShown: false,
                title: item.title,
                drawerLabelStyle: { fontSize: 16 },
                drawerIcon,
              }}
            />
          );
        })}
      </Drawer.Navigator>
      {loading && (
        <View style={localStyles.viewSync}>
          <Button
            style={localStyles.buttonSync}
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
  view: {
    flexDirection: 'row',
  },
  viewSync: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  buttonSync: {
    opacity: 0.7,
    borderRadius: 20,
  },
  content: {
    height: 240,
  },
  action: {
    height: 70,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  syncInfoText: {
    fontSize: 8,
    color: 'white',
  },
  snackText: {
    color: 'white',
  },
});

export default DrawerNavigator;
