import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';

import App from './App';

const AppHR = hot(App);

ReactDOM.render(
  <BrowserRouter>
    <AppHR />
  </BrowserRouter>,
  document.getElementById('root'),
);
