import { Box, CircularProgress, CardHeader } from '@material-ui/core';

import { useNavigate, useParams } from 'react-router-dom';
import { IDeviceBinding, NewDeviceBinding } from '@lib/types';

import { useEffect } from 'react';

import DeviceBindingDetails from '../../components/deviceBinding/DeviceBindingDetails';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import SnackBar from '../../components/SnackBar';

import bindingActions from '../../store/deviceBinding';

const BindingEdit = () => {
  const { id: userId, deviceid } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const bindings = useSelector((state) => state.deviceBindings);
  const binding = bindings.list.find((b) => b.device.id === deviceid && b.user.id === userId);

  useEffect(() => {
    dispatch(bindingActions.fetchDeviceBindings(userId));
  }, [dispatch, userId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(bindingActions.deviceBindingActions.clearError());
  };

  const handleSubmit = async (values: NewDeviceBinding | IDeviceBinding) => {
    const res = await dispatch(bindingActions.updateDeviceBinding(values as IDeviceBinding));
    if (res.type === 'DEVICEBINDING/UPDATE_SUCCCES') {
      goBack();
    }
  };

  if (!binding) {
    return <Box>Связь с устройством не найдена</Box>;
  }

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CardHeader title={'Редактирование связи с устройством'} />
        {bindings.loading && <CircularProgress size={40} />}
      </Box>
      <DeviceBindingDetails
        deviceBinding={binding as IDeviceBinding}
        loading={bindings.loading}
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
      <SnackBar errorMessage={bindings.errorMessage} onClearError={handleClearError} />
    </Box>
  );
};

export default BindingEdit;
