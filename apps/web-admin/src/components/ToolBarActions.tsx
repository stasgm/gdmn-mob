import React from 'react';
import { Button, Box, IconButton, Toolbar, Drawer } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { IToolBarButton } from '../types';

interface props {
  buttons: IToolBarButton[];
}

const ToolBarActions = ({ buttons /*, onButtonsOpen */ }: props) => {
  const buttonList = (
    <>
      {buttons.map((button: IToolBarButton) => (
        <Button
          key={button.name}
          color={button.color}
          variant={button.variant}
          onClick={button.onClick}
          sx={button.sx}
          startIcon={button.icon}
        >
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar>
      <Box sx={{ background: 'transparent', border: 'none', display: { sm: 'none', xs: 'block' } }}>
        <IconButton
          aria-controls="customized-menu"
          aria-haspopup="true"
          // /* variant="contained"*/
          color="primary"
          onClick={handleClick}
        >
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
      <Box
        sx={{ background: 'transparent', border: 'none', display: { xl: 'none', md: 'none', sm: 'none', xs: 'block' } }}
      >
        <Drawer
          /*anchorEl={anchorEl} keepMounted  anchor="right"*/

          id="customized-menu"
          variant="temporary"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          /*  PaperProps={{
            /*sx: {
              /*width:  ?isCompact 70 : 256,
              top: 100,
              /*height: 'calc(100% - 64px)',
              transitionProperty: 'width, transform !important',
              transitionDuration: '0.3s !important',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1) !important',
            },
            sx: { mx: 1 }
          }}*/
        >
          {buttonList}
        </Drawer>
      </Box>
    </Toolbar>
  );
};

export default ToolBarActions;
