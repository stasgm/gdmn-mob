import { Box, Card, TextField, InputAdornment, IconButton } from '@mui/material';

import { Search as SearchIcon, X as ClearIcon } from 'react-feather';

import { IToolBarButton } from '../types';

import ToolBarActions from './ToolBarActions';

interface IProps {
  buttons: IToolBarButton[];
  searchTitle: string;
  updateInput: (value: string) => void;
  searchOnClick: () => void;
  clearOnClick?: () => void;
  keyPress: (key: string) => void;
  value?: string;
  disabled?: boolean;
}

const ToolbarActionsWithSearch = ({
  buttons,
  searchTitle,
  updateInput,
  searchOnClick,
  clearOnClick,
  keyPress,
  value,
  disabled = false,
}: IProps) => {
  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <Box sx={{ maxWidth: 500, minWidth: 200, flexGrow: 1, alignSelf: 'center' }}>
          <TextField
            fullWidth
            sx={{ p: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" onClick={searchOnClick}>
                  <IconButton>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: value ? (
                <InputAdornment position="end" onClick={clearOnClick}>
                  <IconButton>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            placeholder={searchTitle}
            variant="outlined"
            onChange={(event) => updateInput(event.target.value)}
            onKeyDown={(event) => keyPress(event.key)}
            type="text"
            id="search"
            name="search"
            value={value || ''}
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
