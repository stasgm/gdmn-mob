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

const useClearPageParams = () => {
  const browserHistory = createBrowserHistory();
  const [history, setHistory] = useState(browserHistory.location.pathname);

  const dispatch = useDispatch();

  const cutPathName = (str: string) => {
    const strWithoutAdminPath = str.replace(adminPath + '/app/', '');
    const newStr = strWithoutAdminPath.substring(0, strWithoutAdminPath.indexOf('/')) || strWithoutAdminPath;
    return newStr;
  };

  useEffect(() => {
    if (cutPathName(history) !== cutPathName(browserHistory.location.pathname)) {
      dispatch(appSystemActions.clearPageParams());
      dispatch(companyActions.companyActions.clearPageParams());
      dispatch(deviceActions.clearPageParams());
      dispatch(deviceBindingActions.deviceBindingActions.clearPageParams());
      dispatch(deviceLogActions.deviceLogActions.clearPageParams());
      dispatch(fileActions.fileSystemActions.clearPageParams());
      dispatch(processActions.clearPageParams());
      dispatch(userActions.userActions.clearPageParams());
      setHistory(browserHistory.location.pathname);
    }
  }, [dispatch, browserHistory.location.pathname, history]);
};

export default useClearPageParams;
