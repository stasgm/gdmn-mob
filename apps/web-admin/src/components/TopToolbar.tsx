import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

interface props {
  buttons: IToolBarButton[];
  onLoad?: () => void;
  onAdd?: () => void;
}

export interface IToolBarButton {
  name: string;
  onClick: () => void;
  sx?: any;
  color?: any;
  variant?: any;
}

const TopToolbar = ({ onLoad, onAdd, buttons, ...rest }: props) => {
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
