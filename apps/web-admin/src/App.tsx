import { useEffect, useState } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import { appActions, authSelectors, useDispatch } from '@lib/store';

import { store } from './store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

import useClearPageParams from './utils/useClearPageParams';

const Router = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();

  const isLogged = authSelectors.isLogged();

  const [history, setHistory] = useState('');
  const [loadingData, setLoadingData] = useState(false);

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
