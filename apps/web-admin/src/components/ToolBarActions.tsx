import React from 'react';
import { Button, Box, IconButton, Toolbar, Menu, MenuProps, Icon } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import { withStyles } from '@mui/styles';

import { IToolBarButton } from '../types';
interface props {
  buttons: IToolBarButton[];
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    /*getContentAnchorEl={null}*/
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

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

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  }))(MenuItem);

  const buttonsList = (
    <Box>
      {buttons.map((button: IToolBarButton) => (
        <StyledMenuItem key={button.name} color="primary" onClick={button.onClick}>
          <Icon color="primary" sx={{ display: 'flex', marginRight: 1 }}>
            {button.icon}
          </Icon>
          <ListItemText primary={button.name} />
        </StyledMenuItem>
      ))}
    </Box>
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

      <Box
        sx={{
          /*background: 'transparent',*/
          border: 'none',
          display: { xs: 'none', md: 'block' },
        }}
      >
        {buttonList}
      </Box>
      <Box
        sx={{
          /*background: 'transparent',*/
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            background: 'transparent',
            border: 'none',
            display: { xl: 'none', md: 'none', sm: 'none', xs: 'block' },
          }}
        >
          <StyledMenu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose} onMouseLeave={handleClose}>
            {buttonsList}
          </StyledMenu>
        </Box>
      </Box>
    </Toolbar>
  );
};

export default ToolBarActions;
