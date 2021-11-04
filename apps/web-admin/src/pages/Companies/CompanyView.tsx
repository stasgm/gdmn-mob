import {
  Box,
  Button,
  CardHeader,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useCallback, useEffect, useState } from 'react';

import SnackBar from '../../components/SnackBar';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';
import userActions from '../../store/user';
import CompanyUsers from '../../components/company/CompanyUsers';
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';
import CompanyDetailsView from '../../components/company/CompanyDetailsView';
import companySelectors from '../../store/company/selectors';
import userSelectors from '../../store/user/selectors';

import { adminPath } from '../../utils/constants';

const CompanyView = () => {
  const { id: companyId } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading, errorMessage } = useSelector((state) => state.companies);

  const company = companySelectors.companyById(companyId);
  const users = userSelectors.usersByCompanyId(companyId);

  const [open, setOpen] = useState(false);

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/companies/${companyId}/edit`);
  };

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(actions.removeCompany(companyId));
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

  const refreshData = useCallback(() => {
    dispatch(actions.fetchCompanyById(companyId));
    dispatch(userActions.fetchUsers(companyId));
  }, [dispatch, companyId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: refreshData,
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
      onClick: handleClickOpen, // handleDelete,
      icon: <DeleteIcon />,
    },
  ];

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить компанию?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary" variant="contained">
              Удалить
            </Button>
            <Button onClick={handleClose} color="secondary" variant="contained">
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
        <CompanyUsers users={users} />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default CompanyView;
