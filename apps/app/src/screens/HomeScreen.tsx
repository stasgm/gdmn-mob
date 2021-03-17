import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { message } from '@lib/mylib';
import { requests } from '@lib/client-api';
import { Button } from 'react-native-paper';
// import { MainContainer } from '@lib/common-ui/primitives/AppView';
//import { CoolButton } from '@lib/common-ui';

/* interface ChatListProps {
  path?: string;
}
 */
/* const ChatList = (_props: ChatListProps) => {
  return (
    <MainContainer>
      <Heading1>ChatList</Heading1>
    </MainContainer>
  );
}; */

console.log('Home');

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message('you', 'hello')}</Text>
      <Text style={styles.title}>Задачи на сегодня:</Text>
      <Text style={styles.text}>На сегодня задач нет</Text>
      <Button onPress={() => console.log(requests.auth.login({ userName: 'Inna', password: '123' }))}>
        Подключение
      </Button>
      {/* <CoolButton /> */}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
