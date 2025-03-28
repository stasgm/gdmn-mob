import { Avatar, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WidgetsIcon from '@mui/icons-material/Widgets';
import Grid from '@mui/system/Grid';

interface IProps {
  value: number;
}

const TotalAppSystems = (props: IProps) => {
  const { value } = props;

  const { palette } = useTheme();

  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Всего подсистем
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {value}
            </Typography>
          </Grid>
          <Grid>
            <Avatar
              sx={{
                backgroundColor: palette.primary.main,
                height: 56,
                width: 56,
              }}
            >
              <WidgetsIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalAppSystems;
