import { useCallback, useEffect } from 'react';
import { Box, CardHeader, IconButton, CircularProgress, Grid, Typography } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useSelector, useDispatch } from '../../store';
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import SnackBar from '../../components/SnackBar';

import serverLogActions from '../../store/serverLog';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import ServerLogDetailsView from '../../components/serverLog/ServerLogDetailsView';
import serverLogSelectors from '../../store/serverLog/selectors';

export type Params = {
  id: string;
};

const ServerLogView = () => {
  const { id } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, errorMessage, serverLog } = useSelector((state) => state.serverLogs);

  const fetchServerLog = useCallback(() => {
    dispatch(serverLogActions.fetchServerLog(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchServerLog();
  }, [fetchServerLog]);

  const log = serverLogSelectors.serverLogById(id);

  const handleCancel = () => {
    navigate(-1);
  };

  const refreshData = useCallback(() => {
    dispatch(serverLogActions.fetchServerLog(id));
  }, [dispatch, id]);

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
              <ServerLogDetailsView serverLog={serverLog} title={log?.id} />
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
