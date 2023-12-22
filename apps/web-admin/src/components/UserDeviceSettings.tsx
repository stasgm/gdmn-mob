import { Typography, Box } from '@mui/material';

import { ISettingsGroup, ISettingsOption, SettingValue, Settings } from '@lib/types';
import { baseSettingGroup } from '@lib/store';

interface IProps {
  group: ISettingsGroup;
  appSettings: ISettingsOption<SettingValue>[];
}

const UserDeviceSettings = ({ group, appSettings }: IProps) => {
  return (
    <Box>
      <>
        <Typography color="red">{group.name}</Typography>
        {appSettings.map((item2, index2) => (
          <Typography key={index2} color="blue">
            {item2.description}: {String(item2.data)}
          </Typography>
        ))}
      </>
    </Box>
  );
};

export default UserDeviceSettings;
