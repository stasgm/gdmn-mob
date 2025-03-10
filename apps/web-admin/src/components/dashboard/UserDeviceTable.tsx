import { Grid, Box } from '@mui/material';
import { IDevice, ISystemFile, IUser } from '@lib/types';

import { IHeadCells } from '../../types';
import SortableTable from '../SortableTable';

interface IUserDevice {
  id: string;
  name: string;
  [field: string]: string | string[];
}

const UserDeviceTable = ({ users, devices, files }: { users: IUser[]; devices: IDevice[]; files: ISystemFile[] }) => {
  const userDevicesCells: IHeadCells<IUserDevice>[] = [
    { id: 'name', label: 'Пользователь', sortEnable: true },
    ...devices.map((device) => ({ id: device.name, label: device.name, sortEnable: true })),
  ];

  const data = users.map((user) => {
    const row: any = {
      id: user.id,
      name: user.name,
    };

    devices.forEach((device) => {
      const deviceFiles = files
        .filter((file) => file.device?.id === device.id && file.producer?.id === user.id && !!file.folder)
        .reduce((prev: { [key: string]: number }, curr) => {
          if (curr.folder && !prev[curr.folder]) {
            prev[curr.folder] = 0;
          }
          if (curr.folder) {
            prev[curr.folder]++;
          }
          return prev;
        }, {});

      row[device.name] = Object.entries(deviceFiles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    });

    return row;
  });

  return (
    <Grid container spacing={2} mt={1}>
      {/* Грид с пользователями */}
      <Grid item lg={12} sm={12} xl={12} xs={12} pt={2}>
        <Box>
          <SortableTable<IUserDevice>
            headCells={userDevicesCells}
            data={data}
            path={'/app/users/'}
            byMaxHeight={true}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserDeviceTable;
