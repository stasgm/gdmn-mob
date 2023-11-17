import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

interface IProps {
  callBack: (period: string[]) => void;
}

const PeriodList = ({ callBack }: IProps) => {
  const [timePeriod, setTimePeriod] = useState('');
  const dateFrom = new Date();
  const dateTo = new Date();

  const handleSetPeriod = (period: string) => {
    period == '30'
      ? dateFrom.setMonth(dateFrom.getMonth() - 1)
      : dateFrom.setDate(dateFrom.getDate() - Number(period) + 1);
    const dateList = [
      String(dateFrom.getFullYear()) + '.' + String(dateFrom.getMonth() + 1) + '.' + String(dateFrom.getDate()),
      String(dateTo.getFullYear()) + '.' + String(dateTo.getMonth() + 1) + '.' + String(dateTo.getDate()),
    ];
    setTimePeriod(period);
    callBack(dateList);
  };

  return (
    <Box sx={{ width: 85 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel>Период</InputLabel>
        <Select
          value={timePeriod}
          onChange={(event) => {
            handleSetPeriod(event.target.value);
          }}
        >
          <MenuItem value={1}>День</MenuItem>
          <MenuItem value={7}>Неделя</MenuItem>
          <MenuItem value={30}>Месяц</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default PeriodList;
