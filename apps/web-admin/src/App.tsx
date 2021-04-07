import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';

import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

import { authSelectors, configureStore, useAddReducer } from '@lib/store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

import { combinedReducer } from './store';

const store = configureStore();

useAddReducer({ name: 'company', reducer: combinedReducer.company, store });

const Routing = () => {
  // const Router = () => (authSelectors.isLogged() ? <RootNavigator /> : <AuthNavigator />);
  // const { device, user } = useTypedSelector((state) => state.auth);
  const isLogged = authSelectors.isLogged();

  return useRoutes(routes(isLogged));
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routing />
      </ThemeProvider>
    </Provider>
  );
};

export default hot(App);
