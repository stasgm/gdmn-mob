import { Avatar, Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';

interface IProps {
  value: number;
}

const TotalCompanies = (props: IProps) => {
  const { value } = props;

  const { palette } = useTheme();

  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Всего компаний
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {value}
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

export default TotalCompanies;
