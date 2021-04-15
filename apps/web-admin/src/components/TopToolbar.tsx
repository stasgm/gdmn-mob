import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

interface props {
  onLoad?: () => void;
  onAdd?: () => void;
}

const TopToolbar = ({ onLoad, onAdd, ...rest }: props) => {
  interface IToolBarButton {
    name: string;
    onClick: () => void;
    sx?: any;
    color?: any;
    variant?: any;
  }

  const buttons: IToolBarButton[] = [
    {
      name: 'Load',
      onClick: () => {
        return;
      },
    },
    {
      name: 'Export',
      sx: { mx: 1 },
      onClick: () => {
        return;
      },
    },
    {
      name: ' Add company',
      color: 'primary',
      variant: 'contained',
      onClick: () => {
        return;
      },
    },
  ];

  const buttonList = (
    <>
      {buttons.map((button: IToolBarButton) => (
        <Button
          key={button.name}
          color={button.color || 'default'}
          variant={button.variant || 'text'}
          onClick={button.onClick}
          sx={button.sx}
        >
          {button.name}
        </Button>
      ))}
    </>
  );

  return (
    <Box {...rest}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {buttonList}
        {/* <Button onClick={onLoad}>Load</Button>
        <Button>Import</Button>
        <Button sx={{ mx: 1 }}>Export</Button>
        <Button color="primary" variant="contained" onClick={onAdd}>
          Add company
        </Button> */}
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TopToolbar;
