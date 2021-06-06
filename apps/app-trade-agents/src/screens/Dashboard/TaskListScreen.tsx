import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TaskListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Задачи на сегодня:</Text>
      <Text style={styles.text}>На сегодня задач нет</Text>
    </View>
  );
};

export default TaskListScreen;

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
