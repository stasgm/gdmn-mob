import { useCallback, useEffect, useRef } from 'react';
import { Box, CardHeader, IconButton, CircularProgress, Container } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { IUser } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

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
import deviceBindingSelectors from '../../store/deviceBinding/selectors';
import activationCodeSelectors from '../../store/activationCode/selectors';
import SnackBar from '../../components/SnackBar';

import SortableTable from '../../components/SortableTable';

import { adminPath } from '../../utils/constants';
import DeviceBindingDetailsView from '../../components/deviceBinding/DeviceBindingDetailsView';

const UserDeviceView = () => {
  const { bindingid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.users);
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { loading, errorMessage } = useSelector((state) => state.devices);

  // const device = deviceSelectors.deviceById(deviceId);
  const deviceBinding = deviceBindingSelectors.bindingById(bindingid);
  // const users = userSelectors.usersByDeviceId(deviceId);
  // const code = activationCodeSelectors.activationCodeByDeviceId(deviceId);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/users/${deviceBinding?.user.id}/binding/edit/${bindingid}`);
    // <NavLink to={`${adminPath}/app/users/${binding.user.id}/binding/${binding.id}`}></NavLink>
  };

  const handleDelete = async () => {
    const res = await dispatch(bindingActions.removeDeviceBinding(bindingid));
    if (res.type === 'DEVICEBINDING/REMOVE_SUCCES') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    //dispatch(deviceActions.fetchDeviceById(deviceId));
    dispatch(bindingActions.fetchDeviceBindings());
    //dispatch(userActions.fetchUsers());
    //dispatch(codeActions.fetchActivationCodes(deviceId));
  }, [dispatch /*, deviceId*/]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const fetchUsers = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(userActions.fetchUsers('', filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  // useEffect(() => {
  //   fetchUsers();
  // }, [fetchUsers]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    if (inputValue) return;

    fetchUsers('');
  };

  const handleSearchClick = () => {
    const inputValue = valueRef?.current?.value;

    fetchUsers(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    const inputValue = valueRef?.current?.value;

    fetchUsers(inputValue);
  };

  const userButtons: IToolBarButton[] = [
    // {
    //   name: 'Добавить',
    //   color: 'primary',
    //   variant: 'contained',
    //   onClick: () => navigate('app/users/new'),
    //   icon: <AddCircleOutlineIcon />,
    // },
  ];

  const handleClearError = () => {
    dispatch(bindingActions.deviceBindingActions.clearError());
  };

  if (!deviceBinding) {
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
          <DeviceBindingDetailsView deviceBinding={deviceBinding} />
        </Box>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserDeviceView;
