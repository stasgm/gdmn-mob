import { useEffect, useState } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import { appActions, authActions, authSelectors, useDispatch, useSelector } from '@lib/store';

import api from '@lib/client-api';

import { store } from './store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

import useClearPageParams from './utils/useClearPageParams';
import { getNumber } from './utils/helpers';

const Router = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();

  const isLogged = authSelectors.isLogged();

  const [history, setHistory] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const config = useSelector((state) => state.auth.config);

  useEffect(() => {
    //Если пользователь logged, но идет загрузка данных из локального хранилища,
    //то переходим на страницу, которая была перед обновлением страницы
    if (isLogged && loadingData) {
      navigate(history);
      setLoadingData(false);
    }
  }, [history, isLogged, loadingData, navigate]);

  useEffect(() => {
    setLoadingData(true);
    setHistory(browserHistory.location.pathname);
    dispatch(appActions.loadGlobalDataFromDisc());

    const fetchData = async () => {
      try {
        const response = await fetch('/env/');
        const data = await response.json();
        console.log('serverConfig', data);
        // Здесь вы можете обработать полученные данные
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };

    fetchData();

    // console.log('process.env.SERVER_PORT', process.env.SERVER_PORT, {
    //   ...config,
    //   // protocol: process.env.SERVER_PORT ? 'http://' : 'https://',
    //   port: getNumber(process.env.SERVER_PORT, config.port),
    // });
    // if (process.env.SERVER_PORT || process.env.SERVER_HTTPS_PORT) {
    //   const newConfig = {
    //     ...config,
    //     protocol: process.env.SERVER_PORT ? 'http://' : 'https://',
    //     port: getNumber(process.env.SERVER_PORT || process.env.SERVER_HTTPS_PORT, config.port),
    //     server: process.env.SERVER_NAME || config.server,
    //   };
    //   dispatch(authActions.setConfig(newConfig));
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api.config = { ...api.config, ...config };
  }, [config]);

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
