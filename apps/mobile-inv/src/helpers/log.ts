import Reactotron from 'reactotron-react-native';

export const rlog = (name: string, value: string): void => {
  if (__DEV__) {
    // console.log('Service action: ', JSON.stringify(action));
    Reactotron.display({
      name,
      value,
      important: false,
    });
  }
};
