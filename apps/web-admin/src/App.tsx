import { useEffect } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

import { appActions, authSelectors, useDispatch } from '@lib/store';

import { store } from './store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

const Router = () => {
  const dispatch = useDispatch();
  const isLogged = authSelectors.isLogged();
  console.log('isLogged', isLogged);

  useEffect(() => {
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
