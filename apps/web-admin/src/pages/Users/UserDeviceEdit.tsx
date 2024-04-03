import { Box, CircularProgress, CardHeader } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { IDeviceBinding, NewDeviceBinding } from '@lib/types';
import { useEffect } from 'react';

import DeviceBindingDetails from '../../components/deviceBinding/DeviceBindingDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import { bindingActions, bindingSelectors } from '../../store/deviceBinding';

export type Params = {
  bindingid: string;
};

const UserDeviceEdit = () => {
  const { bindingid } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading } = useSelector((state) => state.deviceBindings);
  const binding = bindingSelectors.bindingById(bindingid);

  useEffect(() => {
    dispatch(bindingActions.fetchDeviceBindingById(bindingid));
  }, [dispatch, bindingid]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: NewDeviceBinding | IDeviceBinding) => {
    const res = await dispatch(bindingActions.updateDeviceBinding(values as IDeviceBinding));
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
    </Box>
  );
};

export default UserDeviceEdit;
