import { useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

import { useNavigate, useParams } from 'react-router-dom';

import { useSelector, useDispatch } from '../../store';
import { IToolBarButton } from '../../types';

import { serverLogActions, serverLogSelectors } from '../../store/serverLog';
import ServerLogDetailsView from '../../components/serverLog/ServerLogDetailsView';
import ViewContainer from '../../components/ViewContainer';

export type Params = {
  id: string;
};

const ServerLogView = () => {
  const { id } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, serverLog } = useSelector((state) => state.serverLogs);

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

  if (!serverLog && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Сообщение не найдено
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

  const tabs = [{ name: log?.id || 'Содержание', component: <ServerLogDetailsView serverLog={serverLog!} /> }];

  return <ViewContainer handleCancel={handleCancel} buttons={buttons} loading={loading} tabValue={0} tabs={tabs} />;
};

export default ServerLogView;
