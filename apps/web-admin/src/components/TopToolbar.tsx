import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

interface props {
  onLoad?: () => void;
  onAdd?: () => void;
}

const TopToolbar = ({ onLoad, onAdd, ...rest }: props) => {
  return (
    <Box {...rest}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={onLoad}>Load</Button>
        <Button>Import</Button>
        <Button sx={{ mx: 1 }}>Export</Button>
        <Button color="primary" variant="contained" onClick={onAdd}>
          Add company
        </Button>
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
