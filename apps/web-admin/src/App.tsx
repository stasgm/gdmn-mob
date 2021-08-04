import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { authSelectors } from '@lib/store';

import { persistor, store } from './store';

// import { store } from './store';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

const Router = () => {
  const isLogged = authSelectors.isLogged();
  // const isLogged = true;

  return useRoutes(routes(isLogged));
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Router />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default hot(App);
