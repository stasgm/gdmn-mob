import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';

import { appActions, authActions, authSelectors, useDispatch, useSelector } from '@lib/store';

import api from '@lib/client-api';

import { store } from './store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';

import useClearPageParams from './utils/useClearPageParams';
import { getNumber } from './utils/helpers';
import AppRoutes from './routes';

const Router = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLogged = authSelectors.isLogged();
  const { config, loadingData } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastPath = window.localStorage.getItem('lastPath');
    if (lastPath) {
      navigate(lastPath);
    }

    dispatch(appActions.loadGlobalDataFromDisc());

    const fetchEnv = async () => {
      try {
        //Получаем переменные среды, содержащие настройки сервера
        const response = await fetch('/api/env');
        const envs = await response.json();
        //Перезаписываем конфиг для апи
        dispatch(
          authActions.setConfig({
            ...config,
            protocol: envs.protocol,
            port: getNumber(envs.port, config.port),
            server: envs.host,
          }),
        );
      } catch (error) {
        // console.error('Ошибка при выполнении запроса:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api.config = { ...api.config, ...config };
  }, [config]);

  useEffect(() => {
    window.localStorage.setItem('lastPath', location.pathname);
  }, [dispatch, location.pathname]);

  useClearPageParams();

  return loading || loadingData ? null : <AppRoutes isLoggedIn={isLogged} />;
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

export default App;
