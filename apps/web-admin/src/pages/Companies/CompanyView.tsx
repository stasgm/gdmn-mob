import { Box, CardHeader, IconButton, CardContent, Grid, Card, TextField, CircularProgress } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { users } from '@lib/mock';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company';
import CompanyUsers from '../../components/company/CompanyUsers';

import { IToolBarButton } from '../../types';

import ToolBarAction from '../../components/ToolBarActions';

const CompanyView = () => {
  const { id: companyId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.companies);
  const company = useSelector((state) => state.companies.list.find((i) => i.id === companyId));
  // const { users, usersLoading } = useSelector((state) => state.users); пользователи из хранилища по companyId

  const handleCancel = () => {
    navigate('/app/companies');
  };

  const handleEdit = () => {
    navigate(`/app/companies/edit/${companyId}`);
  };

  const handleRefresh = () => {
    dispatch(actions.fetchCompanyById(companyId));
    //обновить пользователей
  };

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
      onClick: () => {
        return;
      },
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
            <CardHeader title={'Компания'} />
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
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    inputProps={{ readOnly: true }}
                    fullWidth
                    label="Наименование компании"
                    name="name"
                    variant="outlined"
                    type="name"
                    disabled={loading}
                    value={company.name}
                    margin="dense"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Box>
        <CardHeader title={'Пользователи компании'} sx={{ mx: 2 }} />
        <CompanyUsers users={users.filter((u) => u.companies.find((c) => c.id === companyId))} />
      </Box>
    </>
  );
};

export default CompanyView;
