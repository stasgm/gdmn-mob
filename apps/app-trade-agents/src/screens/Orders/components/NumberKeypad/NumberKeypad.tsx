import { Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { evaluate } from 'mathjs';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { IKeyProps, Key } from './Key';

interface IProps {
  oldValue?: string;
  handelDismiss?: () => void;
  handelApply: (newValue: string) => void;
}

const NumberKeypad = ({ oldValue, handelDismiss, handelApply }: IProps) => {
  const [expression, setExpression] = useState('');
  const [number, setNumber] = useState(oldValue);
  const [firstOperation, setFirstOperation] = useState(true);
  const { colors } = useTheme();

  const handleNumberPress = ({ value }: { value: string }) => {
    if (value === '0' && expression.slice(-1) === '/') {
      return;
    }
    //Если уже было число 0, без выражения, и не введена точка, то берем введеное число
    //иначе склеиваем к предыдущему числу введенное число
    let newValue = `${number === '0' && !expression && value !== '.' ? '' : number}${value}`;
    // //Если получившееся
    newValue = Number.isNaN(parseFloat(newValue)) ? '0.' : newValue ?? '0';

    const validNumber = new RegExp(/^(\d{1,6}(.))?\d{0,4}$/);

    const n = validNumber.test(newValue) ? newValue : number;

    setNumber(n);

    //Если вводим после операции деления 0, то выводим 0
    handelApply(parseFloat(evaluate(`${expression}${n || '0'}`).toFixed(3)).toString());
  };

  const handleOperationPress = ({ value }: { value: string }) => {
    if (!firstOperation && number) {
      const result = parseFloat(evaluate(`${expression}${number}`).toFixed(3)).toString();
      setExpression(`${result}${value}`);
      setNumber('');
    } else {
      if (!expression && !!oldValue && !number) {
        //если введен с самого начала оператор
        setExpression((prev) => `${prev}${oldValue}${value}`);
        setFirstOperation(false);
      } else if (number) {
        //обычный случай
        setExpression((prev) => `${prev}${number}${value}`);
        setNumber('');
        setFirstOperation(false);
        //Если ввели оператор после числа, то выводим 0
        handelApply('0');
      } else {
        //замена математического оператора
        setExpression((prev) => `${firstOperation ? '0' : ''}${prev.slice(0, -1)}${value}`);
        setFirstOperation(false);
      }
    }
  };

  const handleClear = () => {
    setExpression('');
    setNumber('');
    handelApply('0');
    setFirstOperation(true);
  };

  const handleDelete = () => {
    if (number) {
      const newN = `${number.slice(0, -1)}`;
      //Если удаляем и остается минус от числа, то обнуляем число, в выражение подставляем минус, выводим 0
      if (newN === '-') {
        setNumber('');
        setExpression('-');
        handelApply('0');
        setFirstOperation(true);
      } else {
        setNumber(newN || '');
        handelApply(newN ? parseFloat(evaluate(`${expression}${newN}`).toFixed(3)).toString() : '0');
        setFirstOperation(!!newN);
      }
    } else {
      const newExpr = `${expression.slice(0, -1)}`;
      setNumber(newExpr);
      setExpression('');
      setFirstOperation(true);
      handelApply(number ? parseFloat(evaluate(`${newExpr}${number}`).toFixed(3)).toString() : newExpr || '0');
    }
  };

  const keys: IKeyProps[][] = [
    [
      { title: 'C', onPress: () => handleClear(), operation: true },
      { title: '7', onPress: () => handleNumberPress({ value: '7' }) },
      { title: '4', onPress: () => handleNumberPress({ value: '4' }) },
      { title: '1', onPress: () => handleNumberPress({ value: '1' }) },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      { title: '', onPress: () => {} },
    ],
    [
      { title: '/', onPress: () => handleOperationPress({ value: '/' }), operation: true },
      { title: '8', onPress: () => handleNumberPress({ value: '8' }) },
      { title: '5', onPress: () => handleNumberPress({ value: '5' }) },
      { title: '2', onPress: () => handleNumberPress({ value: '2' }) },
      { title: '0', onPress: () => handleNumberPress({ value: '0' }) },
    ],
    [
      { title: '*', onPress: () => handleOperationPress({ value: '*' }), operation: true },
      { title: '9', onPress: () => handleNumberPress({ value: '9' }) },
      { title: '6', onPress: () => handleNumberPress({ value: '6' }) },
      { title: '3', onPress: () => handleNumberPress({ value: '3' }) },
      { title: '.', onPress: () => handleNumberPress({ value: '.' }) },
    ],
    [
      { title: '-', onPress: () => handleOperationPress({ value: '-' }), operation: true },
      { title: '+', onPress: () => handleOperationPress({ value: '+' }), grow: 2, operation: true },
      {
        title: '=',
        onPress: () => {
          const newValue =
            number === '0' && expression.slice(-1) === '/'
              ? '0'
              : parseFloat(evaluate(`${expression}${number || '0'}`).toFixed(3)).toString();
          setNumber(newValue);
          setExpression('');
          handelDismiss && handelDismiss();
        },
        grow: 2,
        operation: true,
      },
    ],
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <View>
          <Text style={styles.currentNumber}>
            {expression}
            {number}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Feather name="delete" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={[styles.keypad]}>
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
    height: 360,
  },
  currentNumber: {
    fontSize: 17,
  },
  input: {
    alignItems: 'center',
    padding: 8,
    marginTop: 2,
    marginHorizontal: 2,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    height: 60,
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
