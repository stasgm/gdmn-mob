import { useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

import { useNavigate, useParams } from 'react-router-dom';

import { useSelector, useDispatch } from '../../store';
import { IToolBarButton } from '../../types';

import { erpLogActions } from '../../store/erpLog';
import ErpLogDetailsView from '../../components/erpLog/ErpLogDetailsView';
import ViewContainer from '../../components/ViewContainer';

export type Params = {
  id: string;
  appSystemId: string;
};

const ErpLogView = () => {
  const { id: companyId, appSystemId } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, erpLog } = useSelector((state) => state.erpLogs);

  const fetchServerLog = useCallback(() => {
    dispatch(erpLogActions.fetchErpLog(companyId, appSystemId));
  }, [appSystemId, companyId, dispatch]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchServerLog();
  }, [fetchServerLog]);

  const handleCancel = () => {
    navigate(-1);
  };

  if (!erpLog && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Лог не найден
      </Box>
    );
  }

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: fetchServerLog,
      icon: <CachedIcon />,
    },
  ];

  const tabs = [{ name: 'erpLog.txt', component: <ErpLogDetailsView erpLog={erpLog!} /> }];

  return <ViewContainer handleCancel={handleCancel} buttons={buttons} loading={loading} tabValue={0} tabs={tabs} />;
};

export default ErpLogView;
