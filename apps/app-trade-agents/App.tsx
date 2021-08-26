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

  return (
    // <MobileApp store={store} items={navItems} /> - если не нужен доступ к Store извне
    <MobileApp items={navItems} />
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
