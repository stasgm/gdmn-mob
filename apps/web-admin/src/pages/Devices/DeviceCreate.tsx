import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IDevice, NewDevice } from '@lib/types';

import DeviceDetails from '../../components/device/DeviceDetails';
import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/device';

const DeviceCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.devices);

  // useEffect(() => {
  //   dispatch(actions.deviceActions.clearError());
  // }, [dispatch]);

  const goBack = () => {
    dispatch(actions.deviceActions.clearError());
    navigate(-1);
  }; // [dispatch]);

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleSubmit = async (values: IDevice | NewDevice) => {
    const res = await dispatch(actions.addDevice({ ...values } as NewDevice));
    if (res.type === 'DEVICE/ADD_SUCCESS') {
      goBack();
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
          device={{ name: '', state: 'NON-REGISTERED' } as IDevice}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={goBack}
        />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceCreate;
