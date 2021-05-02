import { Box, Card, TextField, InputAdornment, SvgIcon } from '@material-ui/core';

import { Search as SearchIcon } from 'react-feather';

import { IToolBarButton } from '../types';

import ToolBarActions from './ToolBarActions';

interface props {
  buttons: IToolBarButton[];
  searchTitle: string;
}

const ToolbarActionsWithSearch = ({ buttons, searchTitle }: props) => {
  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ maxWidth: 500, minWidth: 200, flexGrow: 1, alignSelf: 'center' }}>
          <TextField
            fullWidth
            // size='small'
            sx={{ p: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon fontSize="small">
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
          <ToolBarActions buttons={buttons} />
        </Box>
      </Box>
    </Card>
  );
};

export default ToolbarActionsWithSearch;
