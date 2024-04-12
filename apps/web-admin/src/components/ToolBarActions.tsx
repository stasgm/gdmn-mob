import { Button, Box, IconButton, Toolbar, Menu, MenuProps, MenuItemProps, Icon, styled } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import { useState } from 'react';

import { IToolBarButton } from '../types';
interface props {
  buttons: IToolBarButton[];
}

const StyledMenu = styled(Menu)(() => ({
  paper: {
    border: '1px solid #d3d4d5',
  },
}));

const MyMenu = (props: MenuProps) => (
  <StyledMenu
    elevation={0}
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
);

const ToolBarActions = ({ buttons }: props) => {
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
          disabled={button.disabled || false}
        >
          {button.name}
        </Button>
      ))}
    </>
  );

  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  }));

  const MyMenuItem = (props: MenuItemProps) => <StyledMenuItem {...props} />;

  const buttonsList = (
    <Box>
      {buttons.map((button: IToolBarButton) => (
        <MyMenuItem key={button.name} color="primary" onClick={button.onClick}>
          <Icon color="primary" sx={{ display: 'flex', marginRight: 1 }}>
            {button.icon}
          </Icon>
          <ListItemText primary={button.name} />
        </MyMenuItem>
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar>
      <Box sx={{ background: 'transparent', border: 'none', display: { sm: 'none', xs: 'block' } }}>
        <IconButton aria-controls="customized-menu" aria-haspopup="true" color="primary" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Box sx={{ background: 'transparent', border: 'none', display: { md: 'none', sm: 'block', xs: 'none' } }}>
        {iconButtonList}
      </Box>

      <Box
        sx={{
          border: 'none',
          display: { xs: 'none', md: 'block' },
        }}
      >
        {buttonList}
      </Box>
      <Box
        sx={{
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
          <MyMenu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose} onMouseLeave={handleClose}>
            {buttonsList}
          </MyMenu>
        </Box>
      </Box>
    </Toolbar>
  );
};

export default ToolBarActions;
