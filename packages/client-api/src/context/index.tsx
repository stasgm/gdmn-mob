import React from 'react';

import { config } from '@lib/client-config';

import Api from '../api';

const {
  debug: { deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const ApiContext = React.createContext<Api | null>(null);

export const ApiContextProvider: React.FC = ({ children }) => {
  const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = React.useContext(ApiContext);

  if (!context) {
    throw new Error('Context should be provided before use.');
  }

  return context;
};
