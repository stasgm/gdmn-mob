import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from '../../store';
import { userActions, userSelectors } from '../../store/user';
import { ILinkedEntity, IToolBarButton } from '../../types';
import UserDevices from '../../components/user/UserDevices';

import { adminPath } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';
import ConfirmDialog from '../../components/ConfirmDialog';
import ViewContainer from '../../components/ViewContainer';

export type Params = {
  id: string;
};

const UserView = () => {
  const { id: userId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, pageParams } = useSelector((state) => state.users);
  const user = userSelectors.userById(userId);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(pageParams?.tab || 0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
    dispatch(userActions.setPageParam({ tab: newValue }));
  };

  const userDetails: ILinkedEntity[] = useMemo(
    () =>
      user
        ? [
            { id: 'Пользователь', value: user },
            { id: 'Идентификатор', value: user.id },
            { id: 'Фамилия', value: user.lastName },
            { id: 'Имя', value: user.firstName },
            { id: 'Отчество', value: user.middleName },
            { id: 'Телефон', value: user.phoneNumber },
            { id: 'Email', value: user.email },
            { id: 'Идентификатор из ERP', value: user.externalId },
            user.appSystem
              ? { id: 'Подсистема', value: user.appSystem.name }
              : { id: 'Пользователь ERP', value: user.erpUser?.name },
            { id: 'Компания', value: user.company, link: `${adminPath}/app/companies/${user.company?.id}/` },
          ]
        : [],
    [user],
  );

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/users/${userId}/edit`);
  }, [navigate, userId]);

  const refreshData = useCallback(() => {
    dispatch(userActions.fetchUserById(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    refreshData();
  }, [refreshData]);

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(userActions.removeUser(userId));
    if (res.type === 'USER/REMOVE_SUCCESS') {
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

  const tabs = [
    { name: 'Общая информация', component: <DetailsView details={userDetails} /> },
    { name: 'Устройства', component: <UserDevices userId={userId} /> },
  ];

  if (!user && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Пользователь не найден
      </Box>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        questionText={
          user?.role === 'Admin'
            ? 'Вы действительно хотите удалить пользователя, являющегося администратором?'
            : 'Вы действительно хотите удалить пользователя?'
        }
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

export default UserView;
