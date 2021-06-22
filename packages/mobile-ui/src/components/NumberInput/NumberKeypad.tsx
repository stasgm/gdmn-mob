import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { evaluate } from 'mathjs';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { IKeyProps, Key } from './Key';

interface IProps {
  oldValue?: string;
  visibleOperation: boolean;
  handelDismiss: () => void;
  handelApply: (newValue: string) => void;
}

const NumberKeypad = ({ oldValue, visibleOperation, handelDismiss, handelApply }: IProps) => {
  const [expression, setExpression] = useState('');
  const [number, setNumber] = useState(oldValue || '');
  const [firstOperation, setFirstOperation] = useState(true);

  const handleNumberPress = ({ value }: { value: string }) => {
    setNumber((prev) => {
      value = `${prev}${value}`;
      value = Number.isNaN(parseFloat(value)) ? '0' : value ?? '0';

      const validNumber = new RegExp(/^(\d{1,6}(.))?\d{0,4}$/);
      return validNumber.test(value) ? value : prev;
    });
  };

  const handleOperationPress = ({ value }: { value: string }) => {
    if (!firstOperation && number) {
      const result = evaluate(`${expression}${number}`).toFixed(3).toString();
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
      } else {
        //замена математического оператора
        setExpression((prev) => `${prev.slice(0, -1)}${value}`);
      }
    }
  };

  const handleClear = () => {
    setExpression('');
    setNumber('');
    setFirstOperation(true);
  };

  const handleDelete = () => {
    if (number) {
      setNumber((prev) => `${prev.slice(0, -1)}`);
    } else {
      setNumber(`${expression.slice(0, -1)}`);
      setExpression('');
      setFirstOperation(true);
    }
  };

  useEffect(() => {
    !visibleOperation && handelApply(number);
  }, [number]);

  const keys: IKeyProps[][] = visibleOperation
    ? [
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
              handelApply(
                evaluate(`${expression}${number || '0'}`)
                  .toFixed(3)
                  .toString(),
              );
              handelDismiss();
            },
            grow: 2,
            operation: true,
          },
        ],
      ]
    : [
        [
          { title: '7', onPress: () => handleNumberPress({ value: '7' }) },
          { title: '4', onPress: () => handleNumberPress({ value: '4' }) },
          { title: '1', onPress: () => handleNumberPress({ value: '1' }) },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          { title: '.', onPress: () => handleNumberPress({ value: '.' }) },
        ],
        [
          { title: '8', onPress: () => handleNumberPress({ value: '8' }) },
          { title: '5', onPress: () => handleNumberPress({ value: '5' }) },
          { title: '2', onPress: () => handleNumberPress({ value: '2' }) },
          { title: '0', onPress: () => handleNumberPress({ value: '0' }) },
        ],
        [
          { title: '9', onPress: () => handleNumberPress({ value: '9' }) },
          { title: '6', onPress: () => handleNumberPress({ value: '6' }) },
          { title: '3', onPress: () => handleNumberPress({ value: '3' }) },
          {
            title: '=',
            onPress: () => {
              handelApply(number);
              handelDismiss();
            },
            //grow: 2,
            operation: true,
          },
        ],
        [
          { title: 'C', onPress: () => handleClear(), operation: true },
          { title: 'DEL', onPress: () => handleDelete(), operation: true },
        ],
      ];

  return (
    <View style={styles.container}>
      {visibleOperation && (
        <View style={styles.input}>
          <View style={styles.flex1}>
            <Text style={styles.currentNumber}>
              {expression}
              {number}
            </Text>
          </View>
          <TouchableOpacity style={{}} onPress={handleDelete}>
            <Feather name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.keypad}>
        {keys.map((columnKeys, idx) => (
          <View key={idx} style={styles.keypadColumn}>
            {columnKeys.map((keyProps) => (
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
    //zIndex: 1,
  },
  currentNumber: {
    fontSize: 18,
  },
  flex1: {
    flex: 1,
  },
  input: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.grey300,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
  },
  keypad: {
    // backgroundColor: Colors.grey300,
    flex: 1,
    flexDirection: 'row',
  },
  keypadColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    //zIndex: 1,
  },
});
