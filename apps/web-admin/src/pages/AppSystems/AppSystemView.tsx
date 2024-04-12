import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useNavigate, useParams } from 'react-router-dom';

import { useSelector, useDispatch } from '../../store';
import { ILinkedEntity, IToolBarButton } from '../../types';

import { appSystemActions, appSystemSelectors } from '../../store/appSystem';

import { adminPath } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';

import ConfirmDialog from '../../components/ConfirmDialog';
import ViewContainer from '../../components/ViewContainer';
import AppSystemCompanies from '../../components/appSystem/AppSystemCompanies';

export type Params = {
  id: string;
};

const AppSystemView = () => {
  const { id: appSystemId } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, pageParams } = useSelector((state) => state.appSystems);
  const appSystem = appSystemSelectors.appSystemById(appSystemId);

  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(pageParams?.tab || 0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
    dispatch(appSystemActions.setPageParam({ tab: newValue }));
  };

  const appSystemDetails: ILinkedEntity[] = useMemo(
    () =>
      appSystem
        ? [
            { id: 'Подсистема', value: appSystem },
            { id: 'Идентификатор', value: appSystem?.id },
            { id: 'Описание', value: appSystem?.description },
          ]
        : [],
    [appSystem],
  );

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/appSystems/${appSystemId}/edit`);
  }, [navigate, appSystemId]);

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(appSystemActions.removeAppSystem(appSystemId));
    if (res.type === 'APP_SYSTEM/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(appSystemActions.fetchAppSystemById(appSystemId));
  }, [appSystemId, dispatch]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const tabs = [
    { name: 'Общая информация', component: <DetailsView details={appSystemDetails} /> },
    { name: 'Компании', component: <AppSystemCompanies appSystemId={appSystemId} /> },
  ];

  const buttons: IToolBarButton[] = useMemo(() => {
    return tabValue === 0
      ? [
          {
            name: 'Обновить',
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
            icon: <CachedIcon />,
          },
          {
            name: 'Редактировать',
            sx: { mr: 1 },
            color: 'primary',
            variant: 'contained',
            onClick: handleEdit,
            icon: <EditIcon />,
          },
          {
            name: 'Удалить',
            color: 'secondary',
            variant: 'contained',
            onClick: handleClickOpen,
            icon: <DeleteIcon />,
          },
        ]
      : [];
  }, [handleEdit, refreshData, tabValue]);

  if (!appSystem && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Подсистема не найдена
      </Box>
    );
  }

  return (
    <Box>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        questionText={'Вы действительно хотите удалить подсистему?'}
      />
      <ViewContainer
        handleCancel={handleCancel}
        buttons={buttons}
        loading={loading}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        tabs={tabs}
      />
    </Box>
  );
};

export default AppSystemView;
