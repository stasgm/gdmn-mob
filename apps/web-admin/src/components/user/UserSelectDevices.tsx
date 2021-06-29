import { Button } from '@material-ui/core';

import { IDevice } from '@lib/types';

import DeviceList from '../../pages/Devices/DeviceList';

interface IUserSelectDevices {
  devices: IDevice[];
  onSave: (selectedDevices: IDevice[]) => void;
  onCancel: () => void;
  onChangeSelectedDevices: (value: any[]) => void;
  // sourcePath: string;
}
//{ devices = [] }:
const UserSelectDevices = ({ onSave, onCancel, onChangeSelectedDevices, devices }: IUserSelectDevices) => {
  // sourcePath = `${sourcePath}selectdevice/`;

  return (
    <div>
      <DeviceList
        selectedDevices={devices}
        limitRows={5}
        onChangeSelectedDevices={onChangeSelectedDevices}
        // sourcePath={sourcePath}
      />
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
