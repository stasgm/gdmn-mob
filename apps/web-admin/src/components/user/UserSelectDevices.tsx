import { Button } from '@mui/material';

import { IDevice } from '@lib/types';

import DeviceList from '../../pages/Devices/DeviceList';

interface IUserSelectDevices {
  devices: IDevice[];
  onSave: (selectedDevices: IDevice[]) => void;
  onCancel: () => void;
  onChangeSelectedDevices: (value: any[]) => void;
}

const UserSelectDevices = ({ onSave, onCancel, onChangeSelectedDevices, devices }: IUserSelectDevices) => {
  return (
    <div>
      <DeviceList selectedDevices={devices} limitRows={5} onChangeSelectedDevices={onChangeSelectedDevices} />
      <>
        <Button
          color="primary"
          variant="contained"
          sx={{ m: 1 }}
          onClick={(selectedDevices) => onSave(selectedDevices)}
        >
          Сохранить
        </Button>
        <Button color="secondary" variant="contained" onClick={onCancel}>
          Отмена
        </Button>
      </>
    </div>
  );
};

export default UserSelectDevices;
