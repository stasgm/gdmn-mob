import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IDocument } from '@lib/types';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import { styles } from '../styles';
import { DocumentsTabsStackParamsList } from '../../../navigation/Root/types';

interface IField {
  name: keyof IDocument;
  type: typeValue;
}

interface IFields {
  typeDoc?: IField;
  number: IField;
  important?: IField;
  addition1?: IField;
  addition2?: IField;
}

type typeValue = 'number' | 'date' | 'INamedEntity' | 'string';

const DocumentItem = ({ item, fields }: { item: IDocument; fields: IFields }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<DocumentsTabsStackParamsList>>();

  //TODO вынести в отдельное место от компонента
  //функция для приведения других типов к строке
  const toString = ({ value, type }: { value: any; type: typeValue }) => {
    if (type === 'number') {
      return value.toString();
    }
    if (type === 'date') {
      const date = new Date(value);
      return `${('0' + date.getDate()).toString().slice(-2, 3)}.${('0' + (date.getMonth() + 1).toString()).slice(
        -2,
        3,
      )}.${date.getFullYear()}`;
    }
    if (type === 'INamedEntity') {
      return value.name;
    }
    return value;
  };

  const docInfo = () => {
    const res = fields.typeDoc ? toString({ value: item[fields.typeDoc.name], type: fields.typeDoc.type }) : '';

    return `${res} №${toString({ value: item[fields.number.name], type: fields.number.type })}`;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DocumentView', { id: item.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={[styles.name, { color: colors.text }]}>{docInfo()}</Text>
            {fields.important ? (
              <Text style={[styles.name, { color: colors.text }]}>
                {toString({ value: item[fields.important.name], type: fields.important.type })}
              </Text>
            ) : null}
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.number, styles.field, { color: colors.text }]}>
              {fields.addition1 && toString({ value: item[fields.addition1.name], type: fields.addition1.type })}
            </Text>
            <Text style={[styles.number, styles.field, { color: colors.text, alignItems: 'flex-end' }]}>
              {fields.addition2 && toString({ value: item[fields.addition2.name], type: fields.addition2.type })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentItem;
