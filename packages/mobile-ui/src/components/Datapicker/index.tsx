import React, { useState, useEffect } from 'react';
import ModalDatepicker from 'react-native-datepicker';

import { View, Text } from 'react-native';

import styles from './styles';

interface IProps {
  label?: string;
}

const Datepicker: React.FC<IProps> = ({ label }) => {
  const [currentDate, setCurrentDate] = useState(Date());

  useEffect(() => {
    const getDate = new Date().getDate();
    const getMonth = new Date().getMonth();
    const getFullYear = new Date().getFullYear();

    setCurrentDate(`${getDate}/${getMonth}/${getFullYear}`);
  }, []);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <ModalDatepicker
        date={currentDate}
        style={styles.datapicker}
        mode="date"
        format="DD-MM-YYYY"
        androidMode="spinner"
        minDate="12/03/2012"
        maxDate={currentDate}
        confirmBtnText="Confirmar"
        cancelBtnText="Cancelar"
        customStyles={{
          dateInput: styles.dataInput,
          dateText: styles.dataText,
        }}
        onDateChange={setCurrentDate}
      />
    </View>
  );
};

export default Datepicker;
