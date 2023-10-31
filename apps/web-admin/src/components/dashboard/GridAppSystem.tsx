import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { IAppSystem } from '@lib/types';

import selectors from '../../store/company/selectors';

interface IProps {
  appSystem: IAppSystem;

  onClick: () => void;

  selectedAppSystem: IAppSystem | undefined;
}

const GridAppSystem = ({ appSystem, onClick, selectedAppSystem }: IProps) => {
  const { palette } = useTheme();

  const list = selectors.companyByAppSystemID(appSystem.id);
  return (
    <Card onClick={onClick} sx={{ background: appSystem.id === selectedAppSystem?.id ? '#e0e0e0' : 'white' }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {appSystem.name}
            </Typography>
            <Typography color="textPrimary" variant="h4">
              Компаний: {list.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: palette.primary.main,
                height: 56,
                width: 56,
              }}
            >
              <BusinessCenterIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GridAppSystem;
