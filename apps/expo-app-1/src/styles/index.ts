import { StyleSheet } from 'react-native';

import { deviceWidth, theme } from '../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: deviceWidth,
    flexDirection: 'column',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '90%',
    marginTop: 30,
    marginBottom: 20,
  },
  text: {
    color: theme.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  textInput: {
    marginVertical: 5,
    height: 50,
    width: '100%',
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 17,
  },
  textCaption: {
    marginHorizontal: 5,
    marginVertical: 5,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    margin: 10,
    backgroundColor: theme.background,
    borderRadius: 8,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '100%',
  },
  buttonText: {
    margin: 10,
    fontSize: 15,
    color: theme.lightText,
  },
  menuButton: {
    marginHorizontal: 10,
    color: '#fff',
  },
});
