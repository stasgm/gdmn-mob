import { CardHeader, Grid, IconButton } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { IToolBarButton } from '../types';

import ToolBarAction from './ToolBarActions';

interface IProps {
  handleCancel: () => void;
  buttons: IToolBarButton[];
  disabled?: boolean;
}

const ViewToolBar = ({ handleCancel, buttons, disabled }: IProps) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {/* Кнопка "Назад" */}
      <Grid item display="flex" alignItems="center">
        <IconButton color="primary" onClick={handleCancel}>
          <ArrowBackIcon />
        </IconButton>
        <CardHeader title="Назад" />
      </Grid>

      {/* Кнопки в ToolBarAction */}
      <Grid item>
        <ToolBarAction buttons={buttons} />
      </Grid>
    </Grid>
  );
};

export default ViewToolBar;
