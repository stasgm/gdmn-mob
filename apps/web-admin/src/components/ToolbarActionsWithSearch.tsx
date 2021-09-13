import { Box, Card, TextField, InputAdornment, IconButton } from '@material-ui/core';

import { Search as SearchIcon } from 'react-feather';

import { IToolBarButton } from '../types';

import ToolBarActions from './ToolBarActions';

interface IProps {
  buttons: IToolBarButton[];
  searchTitle: string;
  //valueRef: any;
  updateInput: (value: string) => void;
  searchOnClick: () => void;
  keyPress: (key: string) => void;
  value?: string;
}

const ToolbarActionsWithSearch = ({
  buttons,
  searchTitle,
  updateInput,
  searchOnClick,
  keyPress,
  //valueRef,
  value,
}: IProps) => {
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
                <InputAdornment position="start" onClick={searchOnClick}>
                  <IconButton>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder={searchTitle}
            variant="outlined"
            onChange={(event) => updateInput(event.target.value)}
            onKeyPress={(event) => keyPress(event.key)}
            type="search"
            //inputRef={valueRef}
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
