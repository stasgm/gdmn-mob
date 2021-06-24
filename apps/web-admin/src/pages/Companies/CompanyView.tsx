import { Box, CardHeader, IconButton, CircularProgress, Container, Typography } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// import { users } from '@lib/mock';

import { useCallback, useEffect } from 'react';

import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';

import userActions from '../../store/user';

import CompanyUsers from '../../components/company/CompanyUsers';

import { IToolBarButton } from '../../types';

import ToolBarAction from '../../components/ToolBarActions';

import CompanyDetailsView from '../../components/company/CompanyDetailsView';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

const CompanyView = () => {
  const { id: companyId } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const {
    loading: companyLoading,
    errorMessage: companyError,
    list: companies,
  } = useSelector((state) => state.companies);

  const { loading: usersLoading, errorMessage: usersError, list: users } = useSelector((state) => state.users);

  //TODO Вынести в селекторы
  const company = companies.find((i) => i.id === companyId);
  // const users = useSelector((state) => state.users.list);

  const handleClearCompanyError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const handleClearUsersError = () => {
    dispatch(userActions.userActions.clearError());
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
      onClick: handleRefresh,
      icon: <CachedIcon />,
    },
    {
      name: 'Редактировать',
      sx: { marginRight: 1 },
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: handleEdit,
      icon: <EditIcon />,
    },
    {
      name: 'Удалить',
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: handleDelete,
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
        <Container maxWidth={false}>
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
            </Box>
            <Box
              sx={{
                justifyContent: 'right',
              }}
            >
              <ToolBarAction buttons={buttons} />
            </Box>
          </Box>

          <Box>
            {companyLoading ? (
              <CircularProgressWithContent content={'Идет загрузка данных...'} />
            ) : (
              <Box>
                <CompanyDetailsView company={company} />
                <Box sx={{ pt: 2 }}>
                  <Typography variant="h5" sx={{ mx: 2 }}>
                    Пользователи компании
                  </Typography>
                  <Box sx={{ pt: 2 }}>
                    <CompanyUsers users={users?.filter((u) => u.companies.find((c) => c.id === companyId))} />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
      <SnackBar errorMessage={companyError} onClearError={handleClearCompanyError} />
      <SnackBar errorMessage={usersError} onClearError={handleClearUsersError} />
    </>
  );
};

export default CompanyView;
