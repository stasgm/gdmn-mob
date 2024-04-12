import React from 'react';
import { Box } from '@mui/material';

import { ITabPanel, IToolBarButton } from '../types';

import ViewToolBar from './ViewToolBar';
import ViewTabs from './ViewTabs';
import CircularProgressWithContent from './CircularProgressWidthContent';

interface IProps {
  handleCancel: () => void;
  buttons: IToolBarButton[];
  loading: boolean;
  tabValue: number;
  handleChangeTab?: (event: React.SyntheticEvent, newValue: number) => void;
  tabs: ITabPanel[];
}

const ViewContainer = ({ handleCancel, buttons, loading, tabValue, handleChangeTab, tabs }: IProps) => {
  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <ViewToolBar handleCancel={handleCancel} buttons={buttons} disabled={loading} />
      {loading ? (
        <CircularProgressWithContent content={'Идет загрузка данных...'} />
      ) : (
        <ViewTabs tabValue={tabValue} handleChangeTab={handleChangeTab} tabs={tabs} />
      )}
    </Box>
  );
};

export default ViewContainer;
