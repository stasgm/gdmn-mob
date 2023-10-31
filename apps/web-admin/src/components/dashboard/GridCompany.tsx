import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { ICompany } from '@lib/types';

import deviceSelectors from '../../store/device/selectors';

import userSelectors from '../../store/user/selectors';

interface IProps {
  company: ICompany;

  onClick: () => void;

  selectedCompany: ICompany | undefined;
}

const GridCompany = ({ company, onClick, selectedCompany }: IProps) => {
  const { palette } = useTheme();

  const users = userSelectors.usersByCompanyId(company.id);
  const device = deviceSelectors.deviceByCompanyId(company.id);

  return (
    <Card onClick={onClick} sx={{ background: company.id === selectedCompany?.id ? '#e0e0e0' : 'white' }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textPrimary" gutterBottom variant="h4">
              {company.name}
            </Typography>
            <Typography color="textSecondary" variant="h6">
              пользователей: {users.length}
            </Typography>
            <Typography color="textSecondary" variant="h6">
              устройств: {device.length}
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

export default GridCompany;
