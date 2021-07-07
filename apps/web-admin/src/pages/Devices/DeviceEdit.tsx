import { Box, CircularProgress, CardHeader } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IDevice, NewDevice } from '@lib/types';
import { useEffect } from 'react';

import DeviceDetails from '../../components/device/DeviceDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import SnackBar from '../../components/SnackBar';
import selectors from '../../store/device/selectors';
import actions from '../../store/device';

const DeviceEdit = () => {
  const { id: deviceId } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.devices);
  const device = selectors.deviceById(deviceId);

  useEffect(() => {
    dispatch(actions.fetchDeviceById(deviceId));
  }, [dispatch, deviceId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleSubmit = async (values: IDevice | NewDevice) => {
    const res = await dispatch(actions.updateDevice(values as IDevice));
    if (res.type === 'DEVICE/UPDATE_SUCCCES') {
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
      <DeviceDetails device={device} loading={loading} onSubmit={handleSubmit} onCancel={goBack} />
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </Box>
  );
};

export default DeviceEdit;
