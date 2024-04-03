import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { ISettingsOption, Settings } from '@lib/types';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface IProps {
  appSettings: Settings;
}

const UserDeviceSettings = ({ appSettings }: IProps) => {
  const groupedSettings = Object.values(appSettings).reduce((groups: { [key: string]: any }, setting) => {
    const groupId = setting.group?.id;
    if (!groupId) return groups;
    const group = groups[groupId] || { ...setting.group, settings: [] };
    group.settings.push(setting);
    groups[groupId] = group;
    return groups;
  }, {});

  const sortedGroups = Object.values(groupedSettings).sort((a, b) => a.sortOrder - b.sortOrder);

  const [expanded, setExpanded] = useState(null);

  const handleChange = (panel: any) => (event: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <Card>
      <CardContent>
        {sortedGroups.map((group) => (
          <Accordion key={group.id} expanded={expanded === group.id} onChange={handleChange(group.id)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{group.name}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 0 }}>
              <List sx={{ pt: 0, pb: 0 }}>
                {group.settings
                  .sort((a: ISettingsOption, b: ISettingsOption) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  .map((setting: ISettingsOption) => (
                    <ListItem sx={{ pt: 0 }} key={setting.id}>
                      <ListItemText primary={setting.description} secondary={String(setting.data)} />
                    </ListItem>
                  ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserDeviceSettings;
