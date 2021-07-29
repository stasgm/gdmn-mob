import { useCallback, useEffect } from 'react';
import { Box, CardHeader, IconButton, CircularProgress } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { IUser } from '@lib/types';

import { useSelector, useDispatch } from '../../store';
import deviceActions from '../../store/device';
import userActions from '../../store/user';
import codeActions from '../../store/activationCode';
import bindingActions from '../../store/deviceBinding';
import { IToolBarButton, IHeadCells } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';
// eslint-disable-next-line import/namespace
import DeviceDetailsView from '../../components/device/DeviceDetailsView';
//import UserListTable from '../../components/user/UserListTable';
import userSelectors from '../../store/user/selectors';
import deviceSelectors from '../../store/device/selectors';
import activationCodeSelectors from '../../store/activationCode/selectors';
import SnackBar from '../../components/SnackBar';

import SortableTable from '../../components/SortableTable';

import { adminPath } from '../../utils/constants';

const DeviceView = () => {
  const { id: deviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.users);

  const { loading, errorMessage } = useSelector((state) => state.devices);

  const device = deviceSelectors.deviceById(deviceId);
  const users = userSelectors.usersByDeviceId(deviceId);
  const code = activationCodeSelectors.activationCodeByDeviceId(deviceId);
  /*  console.log('activationCodes', activationCodes);*/

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/devices/edit/${deviceId}`);
  };

  const handleDelete = async () => {
    const res = await dispatch(deviceActions.removeDevice(deviceId));
    if (res.type === 'DEVICE/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(deviceActions.fetchDeviceById(deviceId));
    dispatch(bindingActions.fetchDeviceBindings());
    dispatch(userActions.fetchUsers());
    dispatch(codeActions.fetchActivationCodes(deviceId));
  }, [dispatch, deviceId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClearError = () => {
    dispatch(deviceActions.deviceActions.clearError());
  };

  if (!device) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Устройство не найдено
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
      onClick: handleDelete,
      icon: <DeleteIcon />,
    },
  ];

  // const headCells: IHeadCells<IUser>[] = [
  const headCells: IHeadCells<IUser>[] = [
    { id: 'name', label: 'Пользователь', sortEnable: true },
    { id: 'lastName', label: 'Фамилия', sortEnable: true },
    { id: 'firstName', label: 'Имя', sortEnable: true },
    { id: 'phoneNumber', label: 'Телефон', sortEnable: false },
    { id: 'creationDate', label: 'Дата создания', sortEnable: false },
    { id: 'editionDate', label: 'Дата редактирования', sortEnable: false },
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
          <DeviceDetailsView device={device} activationCode={code} />
        </Box>
      </Box>
      <Box sx={{ p: 3 }}>
        <CardHeader title={'Пользователи устройства'} sx={{ mx: 2 }} />
        {/* <UserListTable users={users} /> */}
        <SortableTable<IUser> headCells={headCells} data={users} path={'/app/users/'} />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceView;
