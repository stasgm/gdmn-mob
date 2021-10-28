import React from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';

import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './src/store';

import RoutesNavigator from './src/navigation/Root/RoutesNavigator';
import OrdersNavigator from './src/navigation/Root/OrdersNavigator';
import ReturnsNavigator from './src/navigation/Root/ReturnsNavigator';
import MapNavigator from './src/navigation/Root/Maps/MapNavigator';
import { Settings, IBaseSettings } from '@lib/types';

const Root = () => {
  const navItems: INavItem[] = [
    /*   {
      name: 'Dashboard',
      title: 'Дашборд',
      icon: 'view-dashboard-outline',
      component: DashboardNavigator,
    }, */
    {
      name: 'Routes',
      title: 'Маршруты',
      icon: 'routes',
      component: RoutesNavigator,
    },
    {
      name: 'Orders',
      title: 'Заявки',
      icon: 'clipboard-list-outline',
      component: OrdersNavigator,
    },
    {
      name: 'Returns',
      title: 'Возвраты',
      icon: 'file-restore',
      component: ReturnsNavigator,
    },
    {
      name: 'Map',
      title: 'Карта',
      icon: 'map-outline',
      component: MapNavigator,
    },
  ];

  const newSettings: Settings<IBaseSettings> = {
    serverName: {
      id: '1',
      sortOrder: 1,
      description: 'Адрес сервера',
      data: 'http://192.168.0.70',
      type: 'string',
      visible: true,
    },
    serverPort: {
      id: '2',
      description: 'Порт',
      data: '8000',
      type: 'string',
      sortOrder: 2,
      visible: true,
    },
    timeout: {
      id: '3',
      description: 'Время ожидания',
      data: 10000,
      type: 'number',
      sortOrder: 3,
      visible: true,
    },
  };

  return (
    // <MobileApp store={store} items={navItems} /> - если не нужен доступ к Store извне
    <MobileApp items={navItems} appSettings={newSettings} />
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);

export default App;

// const App = () => {
//   const navItems: INavItem[] = [
//     /*   {
//       name: 'Dashboard',
//       title: 'Дашборд',
//       icon: 'view-dashboard-outline',
//       component: DashboardNavigator,
//     }, */
//     {
//       name: 'Routes',
//       title: 'Маршруты',
//       icon: 'routes',
//       component: RoutesNavigator,
//     },
//     {
//       name: 'Orders',
//       title: 'Заявки',
//       icon: 'clipboard-list-outline',
//       component: OrdersNavigator,
//     },
//     {
//       name: 'Returns',
//       title: 'Возвраты',
//       icon: 'file-restore',
//       component: ReturnsNavigator,
//     },
//     {
//       name: 'Map',
//       title: 'Карта',
//       icon: 'map-outline',
//       component: MapNavigator,
//     },
//   ];
//   const Router = () => (authSelectors.isLoggedWithCompany() ? <RootNavigator /> : <AuthNavigator />);
//   // const Router = () => <RootNavigator />;

//   return (
//     <Provider store={store}>
//       <UIProvider theme={defaultTheme}>
//         <ActionSheetProvider>
//           <NavigationContainer>
//             <Router />
//           </NavigationContainer>
//         </ActionSheetProvider>
//       </UIProvider>
//     </Provider>
//   );
// };

// export default App;
