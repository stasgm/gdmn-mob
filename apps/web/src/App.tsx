import React from 'react';
import { hot } from 'react-hot-loader';

const App = () => {
  return (
    <div>Hello, Inna!</div>
  );
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
