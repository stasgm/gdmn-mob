import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';

import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

import { configureStore } from '@lib/store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

const store = configureStore();

// const Router = () => (authSelectors.isLogged() ? <RootNavigator /> : <AuthNavigator />);

const App = () => {
  const routing = useRoutes(routes);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
    </Provider>
  );
};

export default hot(App);
