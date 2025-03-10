import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { useCallback, useEffect, useMemo, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import CachedIcon from '@mui/icons-material/Cached';

import EditIcon from '@mui/icons-material/Edit';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import { companyActions, companySelectors } from '../../store/company';
import { appSystemActions, appSystemSelectors } from '../../store/appSystem';
import CompanyAppSystemDetailsView from '../../components/company/CompanyAppSystemDetailsView';
import ConfirmDialog from '../../components/ConfirmDialog';
import ViewContainer from '../../components/ViewContainer';
import { IToolBarButton } from '../../types';
import { adminPath } from '../../utils/constants';
import ErpLogView from '../../components/erpLog/ErpLogView';

export type Params = {
  id: string;
  appSystemId: string;
};

const CompanyAppSystemView = () => {
  const { id: companyId, appSystemId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading } = useSelector((state) => state.companies);
  const company = companySelectors.companyById(companyId);
  const appSystem = appSystemSelectors.appSystemById(appSystemId);

  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
    dispatch(appSystemActions.setPageParam({ tab: newValue }));
  };

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/companies/${companyId}/appSystems/${appSystemId}/edit`);
  }, [navigate, companyId, appSystemId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const refreshData = useCallback(() => {
    dispatch(companyActions.fetchCompanyById(companyId));
    dispatch(appSystemActions.fetchAppSystemById(appSystemId));
  }, [dispatch, companyId, appSystemId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const buttons: IToolBarButton[] = useMemo(() => {
    return tabValue === 0
      ? [
          {
            name: 'Обновить',
            sx: { marginRight: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
            icon: <CachedIcon />,
          },
          {
            name: 'Редактировать',
            sx: { marginRight: 1 },
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

  const tabs = [
    {
      name: 'Общая информация',
      component: (
        <CompanyAppSystemDetailsView
          appSystem={{
            ...(company?.appSystems?.find((as) => as.id === appSystemId) || { id: '', name: '', deviceCount: 0 }),
            appVersion: appSystem?.appVersion || '',
            description: appSystem?.description || '',
          }}
          companyName={company?.name || ''}
        />
      ),
    },
    {
      name: 'EPR-логи',
      component: <ErpLogView />,
    },
  ];

  if (!company) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Компания не найдена
      </Box>
    );
  }

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(
      companyActions.updateCompany({
        ...company,
        appSystems: company.appSystems?.filter((as) => as.id !== appSystemId),
      }),
    );
    if (res.type === 'COMPANY/UPDATE_SUCCESS') {
      navigate(-1);
    }
  };

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

export default CompanyAppSystemView;
