import { useEffect, useState } from 'react';

import { useLocation } from 'react-router';

import { useDispatch } from '../store';

import { appSystemActions } from '../store/appSystem';
import { deviceActions } from '../store/device';
import { bindingActions } from '../store/deviceBinding';
import { deviceLogActions } from '../store/deviceLog';
import { fileActions } from '../store/file';
import { processActions } from '../store/process';
import { userActions } from '../store/user';

import { adminPath } from './constants';

const cutPathName = (str: string) => {
  const strWithoutAdminPath = str.replace(adminPath + '/app/', '');
  return strWithoutAdminPath.substring(0, strWithoutAdminPath.indexOf('/')) || strWithoutAdminPath;
};

const useClearPageParams = () => {
  const location = useLocation();
  const [history, setHistory] = useState(location.pathname);

  const dispatch = useDispatch();

  useEffect(() => {
    if (cutPathName(history) !== cutPathName(location.pathname)) {
      switch (cutPathName(history)) {
        case 'appSystems': {
          dispatch(appSystemActions.clearPageParams());
          break;
        }
        case 'companies': {
          dispatch(userActions.clearPageParams());
          break;
        }
        case 'devices': {
          dispatch(deviceActions.clearPageParams());
          dispatch(bindingActions.clearPageParams());
          break;
        }
        case 'deviceLogs': {
          dispatch(deviceLogActions.clearPageParams());
          break;
        }
        case 'files': {
          dispatch(fileActions.clearPageParams());
          break;
        }
        case 'processes': {
          dispatch(processActions.clearPageParams());
          break;
        }
        case 'users': {
          dispatch(userActions.clearPageParams());
          dispatch(bindingActions.clearPageParams());
          break;
        }
      }
      setHistory(location.pathname);
    }
  }, [dispatch, location.pathname, history]);
};

export default useClearPageParams;
