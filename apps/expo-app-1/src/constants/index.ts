import { Dimensions } from 'react-native';

const services = {
  baseUrl: 'https://task-management-app-back.herokuapp.com',
};

const { width: deviceWidth } = Dimensions.get('window');

const theme = {
  background: '#465775',
  primary: '#261',
  secondary: '#246',
  active: '#F4F7FB',
  inactive: '#ADB6C4',
  disabled: 'grey',
  text: 'black',
  lightText: '#fff',
  border: '#ccc',
};

export { services, deviceWidth, theme };
