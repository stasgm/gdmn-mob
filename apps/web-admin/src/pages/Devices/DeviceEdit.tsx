import { Box, CircularProgress, CardHeader } from '@material-ui/core';

import { useNavigate, useParams } from 'react-router-dom';
import { IDevice, NewDevice } from '@lib/types';

import DeviceDetails from '../../components/device/DeviceDetails';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/device';
import SnackBar from '../../components/SnackBar';

interface IDeviceEdit {
  sourcePath?: string;
}

const DeviceEdit = (props: IDeviceEdit) => {
  const { sourcePath } = props;

  const { id: deviceId } = useParams();
  const { userid: userId } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.devices);
  const device = useSelector((state) => state.devices.list.find((i) => i.id === deviceId));

  const handleGoToDeviceView = () => {
    if (sourcePath) {
      let text;
      text = sourcePath.replace(':userid', userId);
      text = text.replace(':id', deviceId);

      navigate(text);
      return;
    }
    navigate(`/app/devices/${deviceId}`);
  };

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleSubmit = async (values: IDevice | NewDevice) => {
    const res = await dispatch(actions.updateDevice(values as IDevice));
    if (res.type === 'DEVICE/UPDATE_SUCCCES') {
      handleGoToDeviceView();
    }
  };

  if (!device) {
    return <Box>Устройство не найдено</Box>;
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
      <DeviceDetails device={device} loading={loading} onSubmit={handleSubmit} onCancel={handleGoToDeviceView} />
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </Box>
  );
};

export default DeviceEdit;
