import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

import { appActions, authSelectors, useDispatch, useAuthThunkDispatch } from '@lib/store';

import { store } from './store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

import useClearPageParams from './utils/useClearPageParams';

const Router = () => {
  const dispatch = useDispatch();
  const isLogged = authSelectors.isLogged();

  useEffect(() => {
    dispatch(appActions.loadGlobalDataFromDisc());
    //TODO Костыль, добавить экшн для проверки состояния сессии
    // const f = async () => {
    //   if (isLogged) {
    //     await authDispatch(authActions.getDeviceByUid(webRequest(dispatch, authActions), ''));
    //   }
    // };
    // f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useClearPageParams();

  return useRoutes(routes(isLogged));
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router />
      </ThemeProvider>
    </Provider>
  );
};

export default hot(App);
