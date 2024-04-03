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
  Tabs,
  Tab,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import { companyActions, companySelectors } from '../../store/company';
import { userActions, userSelectors } from '../../store/user';
import CompanyUsers from '../../components/company/CompanyUsers';
import { ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import { adminPath } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';
import TabPanel from '../../components/TabPanel';

export type Params = {
  id: string;
};

const CompanyView = () => {
  const { id: companyId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state) => state.companies);
  const company = companySelectors.companyById(companyId);
  const users = userSelectors.usersByCompanyId(companyId);
  const [open, setOpen] = useState(false);

  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const companyDetails: ILinkedEntity[] = useMemo(
    () =>
      company
        ? [
            { id: 'Компания', value: company },
            { id: 'Идентификатор', value: company?.id },
            { id: 'Город', value: company?.city },
            { id: 'Администратор', value: company?.admin, link: `${adminPath}/app/users/${company.admin.id}/` },
            { id: 'Подсистемы', value: company?.appSystems },
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
    dispatch(userActions.fetchUsers(companyId));
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
            disabled: true,
            color: 'primary',
            variant: 'contained',
            onClick: handleEdit,
            icon: <EditIcon />,
          },
          {
            name: 'Удалить',
            disabled: true,
            color: 'secondary',
            variant: 'contained',
            onClick: handleClickOpen,
            icon: <DeleteIcon />,
          },
        ]
      : [
          {
            name: 'Обновить',
            sx: { marginRight: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
            icon: <CachedIcon />,
          },
        ];
  }, [handleEdit, refreshData, tabValue]);

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
          <Box sx={{ display: 'inline-flex' }}>
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
        <Box>
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab label="Общая информация" />
            <Tab label="Пользователи" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <DetailsView details={companyDetails} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CompanyUsers users={users} />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default CompanyView;
