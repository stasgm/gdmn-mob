import { Button } from '@material-ui/core';

import { IDevice } from '@lib/types';

import DeviceList from '../../pages/Devices/DeviceList';

interface IUserSelectDevices {
  devices: IDevice[];
  onSaveClick: () => void;
  onCancelClick: () => void;
  onChangeSelectedDevices: (value: any[]) => void;
  sourcePath?: string;
}
//{ devices = [] }:
const UserSelectDevices = (props: IUserSelectDevices) => {
  const { onSaveClick, onCancelClick, onChangeSelectedDevices } = props;
  let { sourcePath } = props;
  const { devices = [] } = props;

  sourcePath = `${sourcePath}selectdevice/`;

  return (
    <div>
      <DeviceList
        selectedDevices={devices}
        limitRows={5}
        onChangeSelectedDevices={onChangeSelectedDevices}
        sourcePath={sourcePath}
      />
      <>
        <Button color="primary" variant="contained" sx={{ m: 1 }} onClick={onSaveClick}>
          Сохранить
        </Button>
        <Button color="secondary" variant="contained" onClick={onCancelClick}>
          Отмена
        </Button>
      </>
    </div>
  );
};

export default UserSelectDevices;
