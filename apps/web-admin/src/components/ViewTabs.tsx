import { Box, Tabs, Tab } from '@mui/material';

import { ITabPanel } from '../types';

interface IProps {
  tabValue: number;
  handleChangeTab?: (event: React.SyntheticEvent, newValue: number) => void;
  tabs: ITabPanel[];
}

const ViewTabs = ({ tabValue, handleChangeTab, tabs }: IProps) => {
  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChangeTab}>
        {tabs.map((tab, index) => (
          <Tab key={`Tab${index}`} label={tab.name} />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <Box key={`Panel${index}`} role="tabpanel" hidden={tabValue !== index} aria-labelledby={`tabpanel-${index}`}>
          {tab.component}
        </Box>
      ))}
    </Box>
  );
};

export default ViewTabs;
