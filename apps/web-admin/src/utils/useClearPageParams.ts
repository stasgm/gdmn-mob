import { createBrowserHistory } from 'history';

import { useEffect, useState } from 'react';

import { useDispatch } from '../store';

import appSystemActions from '../store/appSystem';
import companyActions from '../store/company';
import deviceActions from '../store/device';
import deviceBindingActions from '../store/deviceBinding';
import deviceLogActions from '../store/deviceLog';
import fileActions from '../store/file';
import processActions from '../store/process';
import userActions from '../store/user';

import { adminPath } from './constants';

const cutPathName = (str: string) => {
  const strWithoutAdminPath = str.replace(adminPath + '/app/', '');
  return strWithoutAdminPath.substring(0, strWithoutAdminPath.indexOf('/')) || strWithoutAdminPath;
};

const useClearPageParams = () => {
  const browserHistory = createBrowserHistory();
  const [history, setHistory] = useState(browserHistory.location.pathname);

  const dispatch = useDispatch();

  useEffect(() => {
    if (cutPathName(history) !== cutPathName(browserHistory.location.pathname)) {
      switch (cutPathName(history)) {
        case 'appSystems': {
          dispatch(appSystemActions.clearPageParams());
          break;
        }
        case 'companies': {
          dispatch(companyActions.companyActions.clearPageParams());
          break;
        }
        case 'devices': {
          dispatch(deviceActions.clearPageParams());
          dispatch(deviceBindingActions.deviceBindingActions.clearPageParams());
          break;
        }
        case 'deviceLogs': {
          dispatch(deviceLogActions.deviceLogActions.clearPageParams());
          break;
        }
        case 'files': {
          dispatch(fileActions.fileSystemActions.clearPageParams());
          break;
        }
        case 'processes': {
          dispatch(processActions.clearPageParams());
          break;
        }
        case 'users': {
          dispatch(userActions.userActions.clearPageParams());
          dispatch(deviceBindingActions.deviceBindingActions.clearPageParams());
          break;
        }
      }
      setHistory(browserHistory.location.pathname);
    }
  }, [dispatch, browserHistory.location.pathname, history]);
};

export default useClearPageParams;
