import { Feather } from '@expo/vector-icons';
import { evaluate, exp } from 'mathjs';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';

import globalColors from '../../styles/colors';

import { IKeyProps, Key } from './Key';

interface IProps {
  oldValue?: string;
  decDigitsForTotal?: number;
  onDismiss?: () => void;
  onApply: (newValue: string) => void;
}

const isDiv0 = (expression: string, number?: string) => Number(number) === 0 && expression.indexOf('/') >= 0;

const NumberKeypad = ({ oldValue, onDismiss, onApply, decDigitsForTotal }: IProps) => {
  const [expression, setExpression] = useState('');
  const [number, setNumber] = useState(oldValue);
  const [firstOperation, setFirstOperation] = useState(true);

  const calc = useCallback(
    (value: string) => {
      let roundValue = evaluate(value);
      if (decDigitsForTotal) {
        roundValue = roundValue.toFixed(decDigitsForTotal);
      }
      return parseFloat(roundValue).toString();
    },
    [decDigitsForTotal],
  );

  const handleNumberPress = ({ value }: { value: string }) => {
    //Если уже было число 0, без выражения, и не введена точка, то берем введеное число
    //иначе склеиваем к предыдущему числу введенное число
    let newValue = `${number === '0' && ((!expression && value !== '.') || value === '0') ? '' : number}${value}`;
    newValue = Number.isNaN(parseFloat(newValue)) ? '0.' : newValue ?? '0';
    const validNumber = new RegExp(/^([-+]?\d{1,6}(.))?\d{0,4}$/);
    const n = validNumber.test(newValue) ? newValue : number;
    setNumber(n);
    if (!isDiv0(expression, n)) {
      onApply(calc(`${expression}${n || '0'}`));
    }
  };

  const handleOperationPress = ({ value }: { value: string }) => {
    //Если введен оператор не с начала и есть число
    if (!firstOperation && number) {
      //Если деление на 0, то заменяем оператор, ноль не выводим
      //иначе добавляем оператор
      if (isDiv0(expression, number)) {
        //замена математического оператора
        setExpression((prev) => `${prev.trim().slice(0, -1)}${value} `);
      } else {
        setExpression(`${calc(`${expression}${number}`)} ${value} `);
      }
      setNumber('');
    } else {
      if (number) {
        //обычный случай
        setExpression((prev) => `${prev}${number} ${value} `);
        setNumber('');
        setFirstOperation(false);
      } else {
        //замена математического оператора
        setExpression((prev) => (firstOperation ? `0 ${value} ` : `${prev.trim().slice(0, -1)}${value} `));
        setFirstOperation(false);
      }
    }
  };

  const handleClear = () => {
    setExpression('');
    setNumber('');
    onApply('0');
    setFirstOperation(true);
  };

  const handleDelete = () => {
    if (number) {
      const newN = `${number.trim().slice(0, -1)}`;
      //Если удаляем и остается минус от числа, то обнуляем число, в выражение подставляем минус, выводим 0
      if (newN === '-') {
        setNumber('');
        setExpression('-');
        onApply('0');
        setFirstOperation(true);
      } else {
        setNumber(newN || '');
        if (newN && !isDiv0(expression, newN)) {
          onApply(calc(`${expression}${newN}`));
        } else {
          const newExpr = `${expression.trim().slice(0, -1)}`;
          onApply(newExpr ? calc(`${newExpr}`) : '0');
          if (!isDiv0(expression, newN)) {
            setFirstOperation(true);
          }
        }
      }
    } else {
      const newExpr = `${expression.trim().slice(0, -1).trim()}`;
      setNumber(newExpr);
      setExpression('');
      setFirstOperation(true);
      // onApply(number ? calc(`${newExpr}${number}`) : newExpr || '0');
      onApply(newExpr || '0');
    }
  };

  const keys: IKeyProps[][] = [
    [
      { title: 'C', onPress: () => handleClear(), operation: true },
      { title: '1', onPress: () => handleNumberPress({ value: '1' }) },
      { title: '4', onPress: () => handleNumberPress({ value: '4' }) },

      { title: '7', onPress: () => handleNumberPress({ value: '7' }) },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      { title: '', onPress: () => {} },
    ],
    [
      { title: '/', onPress: () => handleOperationPress({ value: '/' }), operation: true },
      { title: '2', onPress: () => handleNumberPress({ value: '2' }) },
      { title: '5', onPress: () => handleNumberPress({ value: '5' }) },
      { title: '8', onPress: () => handleNumberPress({ value: '8' }) },
      { title: '0', onPress: () => handleNumberPress({ value: '0' }) },
    ],
    [
      { title: '*', onPress: () => handleOperationPress({ value: '*' }), operation: true },
      { title: '3', onPress: () => handleNumberPress({ value: '3' }) },
      { title: '6', onPress: () => handleNumberPress({ value: '6' }) },
      { title: '9', onPress: () => handleNumberPress({ value: '9' }) },
      { title: '.', onPress: () => handleNumberPress({ value: '.' }) },
    ],
    [
      { title: '-', onPress: () => handleOperationPress({ value: '-' }), operation: true },
      { title: '+', onPress: () => handleOperationPress({ value: '+' }), grow: 2, operation: true },
      {
        title: '=',
        onPress: () => {
          setNumber(oldValue);
          setExpression('');
          onDismiss && onDismiss();
        },
        grow: 2,
        operation: true,
      },
    ],
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.input, { borderColor: globalColors.border, backgroundColor: globalColors.card }]}>
        <View>
          <Text style={styles.currentNumber}>
            {expression}
            {number}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Feather name="delete" size={24} color={globalColors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.keypad}>
        {keys.map((rowKeys, idx) => (
          <View key={idx} style={styles.keypadRow}>
            {rowKeys.map((keyProps) => (
              <Key key={keyProps.title} {...keyProps} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export { NumberKeypad };

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 2.6,
    minHeight: 300,
  },
  currentNumber: {
    fontSize: 17,
  },
  input: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 2,
    marginHorizontal: 2,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
  },
  keypad: {
    flex: 1,
    flexDirection: 'row',
  },
  keypadRow: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
});
