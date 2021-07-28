import { Box, CircularProgress, CardHeader } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IDevice, NewDevice, IActivationCode } from '@lib/types';
import { useEffect } from 'react';
//import {authActions} from '@lib/store';
//import {activateDevice} from '@lib/store';

import DeviceDetails from '../../components/device/DeviceDetails';
import { /*authActions, */useSelector, useDispatch, AppDispatch } from '../../store';
import { authActions } from '@lib/store';
import SnackBar from '../../components/SnackBar';
import selectors from '../../store/device/selectors';
import actions from '../../store/device';

import activationCodeSelectors from '../../store/activationCode/selectors';

const DeviceEdit = () => {
  const { id: deviceId } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.devices);
  const device = selectors.deviceById(deviceId);
  const code = activationCodeSelectors.activationCodeByDeviceId(deviceId);

  console.log('5555', device?.uid);

  useEffect(() => {
    dispatch(actions.fetchDeviceById(deviceId));
  }, [dispatch, deviceId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleCreateUid = (code: string) => {
    console.log('handleCreateUid', code);
    dispatch(authActions.activateDevice(code));
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
        device={device /*as IDevice*/}
        activationCode={code}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={goBack}
        onCreateUid={handleCreateUid}
      />
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </Box>
  );
};

export default DeviceEdit;
