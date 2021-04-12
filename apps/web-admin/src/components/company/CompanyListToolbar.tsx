import { Box, Button, TextField, InputAdornment, SvgIcon, Hidden, IconButton, Toolbar } from '@material-ui/core';
// import { Add } from '@material-ui/icons/add';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { Search as SearchIcon } from 'react-feather';

interface props {
  onLoadCompanies: () => void;
  onAddCompany: () => void;
}

const CompanyListToolbar = ({ onLoadCompanies, onAddCompany, ...rest }: props) => {
  return (
    <Box {...rest}>
      {/* <Card> */}
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
            placeholder="Search company"
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
              <IconButton color="primary" onClick={onLoadCompanies}>
                <CachedIcon />
              </IconButton>
              <IconButton color="primary">
                <ImportExportIcon />
              </IconButton>
              <IconButton color="primary" onClick={onAddCompany}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Hidden>
            <Hidden mdDown>
              <Button sx={{ mx: 1 }} onClick={onLoadCompanies}>
                Load
              </Button>
              <Button>Import</Button>
              <Button sx={{ mx: 1 }}>Export</Button>
              <Button color="primary" variant="contained" onClick={onAddCompany}>
                Add company
              </Button>
            </Hidden>
          </Toolbar>
        </Box>
      </Box>
      {/* </Card> */}
    </Box>
  );
};

export default CompanyListToolbar;
