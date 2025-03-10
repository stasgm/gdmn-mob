import { Box, CircularProgress, CardHeader } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { IDevice, NewDevice } from '@lib/types';
import { useEffect } from 'react';

import DeviceDetails from '../../components/device/DeviceDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import { deviceActions, deviceSelectors } from '../../store/device';
import { codeSelectors } from '../../store/activationCode';

export type Params = {
  id: string;
};

const DeviceEdit = () => {
  const { id: deviceId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state) => state.devices);
  const device = deviceSelectors.deviceById(deviceId);
  const code = codeSelectors.activationCodeByDeviceId(deviceId);

  useEffect(() => {
    dispatch(deviceActions.fetchDeviceById(deviceId));
  }, [dispatch, deviceId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: IDevice | NewDevice) => {
    const res = await dispatch(deviceActions.updateDevice(values as IDevice));
    if (res.type === 'DEVICE/UPDATE_SUCCESS') {
      goBack();
    }
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
        <CardHeader title={'Редактирование устройства'} />
        {loading && <CircularProgress size={40} />}
      </Box>
      <DeviceDetails
        device={device}
        activationCode={code}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    </Box>
  );
};

export default DeviceEdit;
