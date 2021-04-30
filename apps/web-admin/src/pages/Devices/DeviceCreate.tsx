import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IDevice, NewDevice } from '@lib/types';

import DeviceDetails from '../../components/device/DeviceDetails';
import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device';

const DeviceCreate = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.devices);

  const handleGoToDevices = () => {
    navigate('/app/devices');
  };

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleSubmit = (values: IDevice | NewDevice) => {
    dispatch(actions.addDevice(values as NewDevice, handleGoToDevices));
  };

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
            <CardHeader title={'Добавление устройства'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <DeviceDetails
          device={{ name: '' } as IDevice}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleGoToDevices}
        />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceCreate;
