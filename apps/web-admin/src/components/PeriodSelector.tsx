import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import dayjs from 'dayjs';

enum Period {
  Today = 'Сегодня',
  Week = 'Неделя',
  Month = 'Месяц',
  Year = 'Год',
}

const PeriodSelector = ({ onPeriodChange }: { onPeriodChange: (period: any[]) => void }) => {
  // Состояние для выбранного периода
  const [selectedPeriod, setSelectedPeriod] = useState('Сегодня');

  // Функция для вычисления периода
  const getPeriodDates = (period: Period) => {
    const today = dayjs(); // Используем dayjs для работы с датами
    let startDate, endDate;

    switch (period) {
      case 'Сегодня':
        startDate = today.startOf('day');
        endDate = today.endOf('day');
        break;
      case 'Неделя':
        startDate = today.startOf('week');
        endDate = today.endOf('week');
        break;
      case 'Месяц':
        startDate = today.startOf('month');
        endDate = today.endOf('month');
        break;
      case 'Год':
        startDate = today.startOf('year');
        endDate = today.endOf('year');
        break;
      default:
        startDate = today.startOf('day');
        endDate = today.endOf('day');
    }

    return [startDate.toDate(), endDate.toDate()]; // Возвращаем обычные объекты Date
  };

  // Обработчик выбора периода
  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    const [startDate, endDate] = getPeriodDates(period);
    onPeriodChange([startDate, endDate]); // Передаём массив с датами через callback
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h6" gutterBottom>
        Выберите период:
      </Typography>

      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          onClick={() => handlePeriodChange(Period.Today)}
          variant={selectedPeriod === 'Сегодня' ? 'contained' : 'outlined'}
        >
          Сегодня
        </Button>
        <Button
          onClick={() => handlePeriodChange(Period.Week)}
          variant={selectedPeriod === 'Неделя' ? 'contained' : 'outlined'}
        >
          Неделя
        </Button>
        <Button
          onClick={() => handlePeriodChange(Period.Month)}
          variant={selectedPeriod === 'Месяц' ? 'contained' : 'outlined'}
        >
          Месяц
        </Button>
        <Button
          onClick={() => handlePeriodChange(Period.Year)}
          variant={selectedPeriod === 'Год' ? 'contained' : 'outlined'}
        >
          Год
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default PeriodSelector;
