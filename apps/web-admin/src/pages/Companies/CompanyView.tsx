import { Box, CardHeader, IconButton, CircularProgress } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SnackBar from '../../components/SnackBar';

import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// import { users } from '@lib/mock';

import { useCallback, useEffect } from 'react';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';

import userActions from '../../store/user';

import CompanyUsers from '../../components/company/CompanyUsers';

import { IToolBarButton } from '../../types';

import ToolBarAction from '../../components/ToolBarActions';

import CompanyDetailsView from '../../components/company/CompanyDetailsView';

const CompanyView = () => {
  const { id: companyId } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading, errorMessage } = useSelector((state) => state.companies);

  console.log('errorMessage', errorMessage);
  //TODO Вынести в селекторы
  const company = useSelector((state) => state.companies.list.find((i) => i.id === companyId));
  const users = useSelector((state) => state.users.list);

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const handleCancel = () => {
    //navigate('/app/companies');
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/app/companies/edit/${companyId}`);
  };

  const handleDelete = async () => {
    const res = await dispatch(actions.removeCompany(companyId));
    if (res.type === 'COMPANY/REMOVE_SUCCCES') {
      navigate(-1);
    }
  };

  const handleRefresh = useCallback(() => {
    dispatch(actions.fetchCompanyById(companyId));
    dispatch(userActions.fetchUsers(companyId));
  }, [dispatch, companyId]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  if (!company) {
    return <Box>Компания не найдена</Box>;
  }

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: () => handleRefresh(),
      icon: <CachedIcon />,
    },
    {
      name: 'Редактировать',
      sx: { marginRight: 1 },
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: () => handleEdit(),
      icon: <EditIcon />,
    },
    {
      name: 'Удалить',
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: () => handleDelete(),
      icon: <DeleteIcon />,
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
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
          }}
        >
          <CompanyDetailsView company={company} />
        </Box>
      </Box>
      <Box>
        <CardHeader title={'Пользователи компании'} sx={{ mx: 2 }} />
        <CompanyUsers users={users?.filter((u) => u.companies.find((c) => c.id === companyId))} />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default CompanyView;
