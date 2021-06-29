import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IDevice, NewDevice } from '@lib/types';

import DeviceDetails from '../../components/device/DeviceDetails';
import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/device';

const DeviceCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.devices);

  const handleGoToDevices = () => {
    navigate('/app/devices');
  };

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleSubmit = async (values: IDevice | NewDevice) => {
    console.log('handleSubmit values', values);
    const res = await dispatch(
      actions.addDevice({ ...values, userId: '70e3d810-c204-11eb-b85e-f3bb0925a990' } as unknown as NewDevice),
    );
    if (res.type === 'DEVICE/ADD_SUCCCES') {
      handleGoToDevices();
    }
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
