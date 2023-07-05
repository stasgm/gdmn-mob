import { Box, CircularProgress, CardHeader } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { IDevice, NewDevice } from '@lib/types';
import { useEffect } from 'react';

import DeviceDetails from '../../components/device/DeviceDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import selectors from '../../store/device/selectors';
import actions from '../../store/device';
import activationCodeSelectors from '../../store/activationCode/selectors';

export type Params = {
  id: string;
};

const DeviceEdit = () => {
  const { id: deviceId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state) => state.devices);
  const device = selectors.deviceById(deviceId);
  const code = activationCodeSelectors.activationCodeByDeviceId(deviceId);

  useEffect(() => {
    dispatch(actions.fetchDeviceById(deviceId));
  }, [dispatch, deviceId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: IDevice | NewDevice) => {
    const res = await dispatch(actions.updateDevice(values as IDevice));
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
