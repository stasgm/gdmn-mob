import { Button, Box, IconButton, Toolbar } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { IToolBarButton } from '../types';

interface props {
  buttons: IToolBarButton[];
}

const ToolBarActions = ({ buttons }: props) => {
  const buttonList = (
    <>
      {buttons.map((button: IToolBarButton) => (
        <Button key={button.name} color={button.color} variant={button.variant} onClick={button.onClick} sx={button.sx}>
          {button.name}
        </Button>
      ))}
    </>
  );

  const iconButtonList = (
    <>
      {buttons.map((button: IToolBarButton) => (
        <IconButton key={button.name} color="primary" onClick={button.onClick}>
          {button.icon}
        </IconButton>
      ))}
    </>
  );

  return (
    <Toolbar>
      <Box sx={{ background: 'transparent', border: 'none', display: { sm: 'none', xs: 'block' } }}>
        <IconButton color="primary">
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Box
        // component="button"
        sx={{ background: 'transparent', border: 'none', display: { md: 'none', sm: 'block', xs: 'none' } }}
      >
        {iconButtonList}
      </Box>
      <Box sx={{ background: 'transparent', border: 'none', display: { xs: 'none', md: 'block' } }}>{buttonList}</Box>
    </Toolbar>
  );
};

export default ToolBarActions;
