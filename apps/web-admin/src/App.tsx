import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';

import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

// import { authSelectors } from '@lib/store';

import { setStore } from './store';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

// const store = configureStore();

const store = setStore();

// setStore(store);

const Routing = () => {
  // const isLogged = authSelectors.isLogged();
  const isLogged = true;

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
