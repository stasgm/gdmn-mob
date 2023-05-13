import { useCallback, useEffect, useState } from 'react';
import { Box, CardHeader, IconButton, CircularProgress, Grid, Typography } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';

import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useSelector, useDispatch } from '../../store';
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import fileSelectors from '../../store/file/selectors';
import SnackBar from '../../components/SnackBar';

import FileContentView from '../../components/file/FileContentView';
import serverLogActions from '../../store/serverLog';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import { adminPath } from '../../utils/constants';
import ServerLogDetailsView from '../../components/serverLog/ServerLogDetailsView';

export type Params = {
  name: string;
};

const ServerLogView = () => {
  const { name } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const serverLog = `::ffff:192.168.0.71 - - [23/Feb/2022:11:18:19 +0000] "OPTIONS /api/v1/auth/login HTTP/1.1" 204 - "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:20 +0000] "POST /api/v1/auth/login HTTP/1.1" 200 302 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:22 +0000] "GET /api/v1/companies HTTP/1.1" 200 254 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:24 +0000] "GET /api/v1/users HTTP/1.1" 200 3435 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:24 +0000] "GET /api/v1/companies/dc3673f0-45eb-11ec-aa5c-b7494455c651 HTTP/1.1" 200 252 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:24 +0000] "GET /api/v1/users?companyId=dc3673f0-45eb-11ec-aa5c-b7494455c651 HTTP/1.1" 200 3435 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:37 +0000] "GET /api/v1/users HTTP/1.1" 200 3435 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:42 +0000] "GET /api/v1/devices HTTP/1.1" 200 1733 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:42 +0000] "GET /api/v1/codes HTTP/1.1" 200 25 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:50 +0000] "GET /api/v1/users/d35f6c00-45eb-11ec-aa5c-b7494455c651 HTTP/1.1" 200 302 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:52 +0000] "GET /api/v1/companies HTTP/1.1" 200 254 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:57 +0000] "GET /api/v1/companies HTTP/1.1" 200 254 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:11:18:58 +0000] "GET /api/v1/users HTTP/1.1" 200 3435 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:12:55:47 +0000] "GET /api/v1/users HTTP/1.1" 200 3435 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:12:56:03 +0000] "OPTIONS /api/v1/users HTTP/1.1" 204 - "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
::ffff:192.168.0.71 - - [23/Feb/2022:12:56:03 +0000] "POST /api/v1/users HTTP/1.1" 201 392 "http://192.168.0.71:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
`;

  const { loading, errorMessage, serverLog: log } = useSelector((state) => state.serverLogs);

  const fetchServerLog = useCallback(() => {
    dispatch(serverLogActions.fetchServerLog(name));
  }, [dispatch, name]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchServerLog();
  }, [fetchServerLog]);

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const refreshData = useCallback(() => {
    dispatch(serverLogActions.fetchServerLog(name));
  }, [dispatch, name]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClearError = () => {
    dispatch(serverLogActions.serverLogActions.clearError());
  };

  if (!serverLog) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        {loading ? <CircularProgressWithContent content={'Идет загрузка данных...'} /> : 'Сообщение не найдено'}
      </Box>
    );
  }

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: refreshData,
      icon: <CachedIcon />,
    },
  ];

  return (
    <>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
            <IconButton color="primary" onClick={handleCancel}>
              <ArrowBackIcon />
            </IconButton>
            <CardHeader title={'Назад'} />
            {loading && <CircularProgress size={40} />}
          </Box>
          <Box
            sx={{
              justifyContent: 'right',
            }}
          >
            <ToolBarAction buttons={buttons} />
          </Box>
        </Box>
        {serverLog ? (
          <>
            <Box
              sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
              }}
            >
              <ServerLogDetailsView serverLog={serverLog} />
            </Box>
          </>
        ) : (
          <Box>
            <CardHeader sx={{ mx: 2 }} />
            <Grid item>
              <Typography variant="subtitle1" gutterBottom>
                Данный файл не является файлом формата JSON
              </Typography>
            </Grid>
          </Box>
        )}
      </Box>

      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default ServerLogView;
