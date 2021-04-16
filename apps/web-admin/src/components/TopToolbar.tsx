import { Box, Button, TextField, InputAdornment, SvgIcon, Hidden, IconButton, Toolbar } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Search as SearchIcon } from 'react-feather';

import { IToolBarButton } from '../types';

interface props {
  buttons: IToolBarButton[];
  searchTitle: string;
}

const TopToolbar = ({ buttons, searchTitle }: props) => {
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
        <IconButton key={button.name} color="primary">
          {button.icon}
        </IconButton>
      ))}
    </>
  );

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ maxWidth: 500, minWidth: 200, flexGrow: 1 }}>
          <TextField
            fullWidth
            sx={{ backgroundColor: 'background.paper' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon fontSize="small" color="action">
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
            placeholder={searchTitle}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Toolbar>
            <Hidden smUp>
              <IconButton color="primary">
                <MoreVertIcon />
              </IconButton>
            </Hidden>
            <Hidden mdUp smDown>
              {iconButtonList}
            </Hidden>
            <Hidden mdDown>{buttonList}</Hidden>
          </Toolbar>
        </Box>
      </Box>
    </Box>
  );
};

export default TopToolbar;
