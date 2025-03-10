import { Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { ServerInfo } from '@lib/types';

import MemoryIcon from '@mui/icons-material/Memory';
import CpuIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/AccessTime';

const ServerInfoCard = ({ serverInfo }: { serverInfo: ServerInfo }) => {
  const { palette } = useTheme();

  return (
    <Grid container spacing={2} mb={2}>
      {/* Карточка с использованием памяти */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h5" display="flex" alignItems="center">
              <MemoryIcon
                sx={{ color: palette.primary.main, marginRight: 1, marginBottom: 1, height: 30, width: 30 }}
              />
              Использование памяти
            </Typography>
            <Typography variant="h6" color="textSecondary">
              RSS: {(serverInfo.memoryUsage.rss / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Heap Total: {(serverInfo.memoryUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Heap Used: {(serverInfo.memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            <Typography variant="h6" color="textSecondary">
              External: {(serverInfo.memoryUsage.external / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Array Buffers: {(serverInfo.memoryUsage.arrayBuffers / (1024 * 1024)).toFixed(2)} MB
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Карточка с использованием CPU */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h5" display="flex" alignItems="center">
              <CpuIcon sx={{ color: palette.primary.main, marginRight: 1, marginBottom: 1, height: 30, width: 30 }} />
              Использование CPU
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Пользовательский режим: {serverInfo.cpuUsage.user}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Системный режим: {serverInfo.cpuUsage.system}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Карточка с информацией о времени работы */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h5" display="flex" alignItems="center">
              <TimerIcon sx={{ color: palette.primary.main, marginRight: 1, marginBottom: 1, height: 30, width: 30 }} />
              Время работы
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {serverInfo.processUptime}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ServerInfoCard;
