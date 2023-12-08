import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

interface IProps {
  callBack: (period: string[]) => void;
  quarter: boolean;
  halfYear: boolean;
  year: boolean;
}

const PeriodList = ({ callBack, quarter, halfYear, year }: IProps) => {
  const option = [
    { name: 'День', period: 1, visible: true },
    { name: 'Неделя', period: 7, visible: true },
    { name: 'Месяц', period: 30, visible: true },
    { name: 'Квартал', period: 90, visible: quarter },
    { name: 'Полугодие', period: 180, visible: halfYear },
    { name: 'Год', period: 360, visible: year },
  ];

  const [timePeriod, setTimePeriod] = useState('7');
  const dateFrom = new Date();
  const dateTo = new Date();

  const handleSetPeriod = (period: string) => {
    switch (period.toString()) {
      case '7':
        dateFrom.setDate(dateFrom.getDate() - 6);
        break;
      case '30':
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        break;
      case '90':
        dateFrom.setMonth(dateFrom.getMonth() - 3);
        break;
      case '180':
        dateFrom.setMonth(dateFrom.getMonth() - 6);
        break;
      case '360':
        dateFrom.setMonth(dateFrom.getMonth() - 12);
    }

    const dateList = [
      String(dateFrom.getFullYear()) + '.' + String(dateFrom.getMonth() + 1) + '.' + String(dateFrom.getDate()),
      String(dateTo.getFullYear()) + '.' + String(dateTo.getMonth() + 1) + '.' + String(dateTo.getDate()),
    ];
    setTimePeriod(period);
    callBack(dateList);
  };

  return (
    <Box sx={{ width: 105 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel>Период</InputLabel>
        <Select
          value={timePeriod}
          onChange={(event) => {
            handleSetPeriod(event.target.value);
          }}
        >
          {option.map((item, index) =>
            item.visible ? (
              <MenuItem key={index} value={item.period}>
                {item.name}
              </MenuItem>
            ) : null,
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default PeriodList;
