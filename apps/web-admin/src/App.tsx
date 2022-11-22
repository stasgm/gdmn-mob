import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

import { appActions, authActions, authSelectors, useAuthThunkDispatch, useDispatch, useSelector } from '@lib/store';

import { store } from './store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';
import SnackBar from './components/SnackBar';

const Router = () => {
  const dispatch = useDispatch();
  const isLogged = authSelectors.isLogged();

  const authDispatch = useAuthThunkDispatch();

  useEffect(() => {
    dispatch(appActions.loadGlobalDataFromDisc());
    //TODO Костыль, добавить экшн для проверки состояния сессии
    authDispatch(authActions.getDeviceByUid(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routeComponent = useRoutes(routes(isLogged));
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  console.log('errorMessage', errorMessage, !!errorMessage);

  return (
    <>
      {routeComponent}
      <SnackBar
        visible={!!errorMessage}
        errorMessage={errorMessage}
        // eslint-disable-next-line max-len
        // 'Не удается получить ответ от сервера. Возможные причины:\n1) неправильно указан адрес сервера\n2) на сервере ведутся технические работы'

        onClearError={() => dispatch(authActions.setErrorMessage(''))}
      />
    </>
  );
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
