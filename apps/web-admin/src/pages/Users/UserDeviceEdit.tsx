import { Box, CircularProgress, CardHeader } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IDeviceBinding, NewDeviceBinding } from '@lib/types';
import { useEffect } from 'react';

import DeviceBindingDetails from '../../components/deviceBinding/DeviceBindingDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import SnackBar from '../../components/SnackBar';
import actions from '../../store/deviceBinding';
import selectors from '../../store/deviceBinding/selectors';

const BindingEdit = () => {
  const { id: userId, deviceid } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading, errorMessage } = useSelector((state) => state.deviceBindings);
  const binding = selectors.bindingsByDeviceIdAndUserId(deviceid, userId);

  useEffect(() => {
    dispatch(actions.fetchDeviceBindings(userId));
  }, [dispatch, userId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.deviceBindingActions.clearError());
  };

  const handleSubmit = async (values: NewDeviceBinding | IDeviceBinding) => {
    const res = await dispatch(actions.updateDeviceBinding(values as IDeviceBinding));
    if (res.type === 'DEVICEBINDING/UPDATE_SUCCES') {
      goBack();
    }
  };

  if (!binding) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Связь с устройством не найдена
      </Box>
    );
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
        {loading && <CircularProgress size={40} />}
      </Box>
      <DeviceBindingDetails
        deviceBinding={binding as IDeviceBinding}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </Box>
  );
};

export default BindingEdit;
