import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import { companyActions, companySelectors } from '../../store/company';
import CompanyUsers from '../../components/company/CompanyUsers';
import { ILinkedEntity, IToolBarButton } from '../../types';

import { adminPath } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';

import CompanyAppSystems from '../../components/company/CompanyAppSystems';
import ViewContainer from '../../components/ViewContainer';
import ConfirmDialog from '../../components/ConfirmDialog';
import { appSystemActions } from '../../store/appSystem';

export type Params = {
  id: string;
};

const CompanyView = () => {
  const { id: companyId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading, pageParams } = useSelector((state) => state.companies);
  const company = companySelectors.companyById(companyId);

  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(pageParams?.tab || 0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
    dispatch(companyActions.setPageParam({ tab: newValue }));
  };

  const companyDetails: ILinkedEntity[] = useMemo(
    () =>
      company
        ? [
            { id: 'Компания', value: company },
            { id: 'Идентификатор', value: company?.id },
            { id: 'Город', value: company?.city },
            { id: 'Администратор', value: company?.admin, link: `${adminPath}/app/users/${company.admin.id}/` },
          ]
        : [],
    [company],
  );

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/companies/${companyId}/edit`);
  }, [navigate, companyId]);

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(companyActions.removeCompany(companyId));
    if (res.type === 'COMPANY/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

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
    // dispatch(userActions.fetchUsers(companyId));
    dispatch(appSystemActions.fetchAppSystems(companyId));
  }, [dispatch, companyId]);

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
    { name: 'Общая информация', component: <DetailsView details={companyDetails} /> },
    { name: 'Подсистемы', component: <CompanyAppSystems companyId={companyId} /> },
    { name: 'Пользователи', component: <CompanyUsers companyId={companyId} /> },
    { name: 'ERP-логи', component: <CompanyAppSystems companyId={companyId} /> },
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

  return (
    <>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        questionText={'Вы действительно хотите удалить компанию?'}
      />
      <ViewContainer
        handleCancel={handleCancel}
        buttons={buttons}
        loading={loading}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        tabs={tabs}
      />
    </>
  );
};

export default CompanyView;
