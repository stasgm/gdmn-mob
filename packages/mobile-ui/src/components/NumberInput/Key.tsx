import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native-paper';

interface IKeyProps {
  title: string;
  grow?: number; //если надо вытянуть клавишу в 2 или больше раз
  operation?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}

const Key = ({ title, grow = 1, operation, icon, onPress }: IKeyProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        //styles.container,
        styles.bubble,
        styles.button,
        {
          flexGrow: grow,
          paddingBottom: grow > 1 ? grow : 0,
        },
      ]}
    >
      {icon ? (
        <MaterialCommunityIcons name={icon} size={24} color={operation ? Colors.blue600 : Colors.black} />
      ) : (
        <Text style={[styles.text, { color: operation ? Colors.blue600 : Colors.black }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export { Key, IKeyProps };

const styles = StyleSheet.create({
  bubble: {
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(200,200,200,0.3)',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    // elevation: 7,
  },
  button: {
    //marginTop: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    //marginHorizontal: 5,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    margin: 1,
  },
  text: {
    fontSize: 25,
  },
});
