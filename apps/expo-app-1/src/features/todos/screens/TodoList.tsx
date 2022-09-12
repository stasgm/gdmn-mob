import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { AddButton, navBackDrawer } from '@lib/mobile-ui';

import { TodoScreenNavigationProp } from '../navigation/TodoStack';
import { deleteTodo, fetchTodos, selectStatus, setTodoStatus } from '../store';
import { Todo, TodoStatus } from '../types';

import { useAppDispatch, useAppSelector } from '../../../store';
import { styles } from '../../../styles';
import { deviceWidth } from '../../../constants';

const TodoList = () => {
  const navigation = useNavigation<TodoScreenNavigationProp>();

  const dispatch = useAppDispatch();

  const list = useAppSelector((state) => state.todos.list);
  const status = useAppSelector(selectStatus);

  const toggleTaskStatus = (item: Todo) => {
    const newStatus =
      item.status === TodoStatus.OPEN
        ? TodoStatus.IN_PROGRESS
        : item.status === TodoStatus.IN_PROGRESS
        ? TodoStatus.DONE
        : TodoStatus.OPEN;
    dispatch(setTodoStatus({ id: item.id, status: newStatus }));
  };
  const deleteTask = async (item: Todo) => {
    try {
      await dispatch(deleteTodo(item.id));
    } catch (err) {
      console.log('err', err);
    }
  };
  // const deleteTasks = () => dispatch(removeTodos());
  const fetchData = useCallback(async () => {
    try {
      await dispatch(fetchTodos()).unwrap();
    } catch (err) {
      console.log('err', err);
    }
  }, [dispatch]);

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      // headerLeft: () => <MaterialIcons name="menu" size={30} style={styles.menuButton} onPress={openDrawer} />,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        // <MaterialIcons
        <AddButton
          // name="add"
          // size={30}
          // style={styles.menuButton}
          onPress={() => navigation.navigate('TodoAddEdit')}
          // disabled={status === 'loading'}
        />
      ),
    });
  }, [navigation, openDrawer, status]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={<RefreshControl onRefresh={fetchData} refreshing={status === 'loading'} title="Loading..." />}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View style={{ borderBottomWidth: StyleSheet.hairlineWidth }} />}
        renderItem={({ item }) => (
          <View style={localStyles.todoItem}>
            <TouchableOpacity onPress={() => toggleTaskStatus(item)} style={localStyles.todoDescription}>
              <MaterialIcons
                name={
                  item.status === TodoStatus.DONE
                    ? 'check-circle'
                    : item.status === TodoStatus.IN_PROGRESS
                    ? 'radio-button-on'
                    : 'radio-button-unchecked'
                }
                size={30}
                color={
                  item.status === TodoStatus.DONE
                    ? '#28a745'
                    : item.status === TodoStatus.IN_PROGRESS
                    ? '#0035dd'
                    : '#dc3545'
                }
              />
              <Text
                style={[localStyles.todoItemText, item.status === TodoStatus.DONE ? localStyles.todoItemDone : null]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
            <View style={localStyles.itemButtonsContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('TodoAddEdit', { id: item.id })}>
                <AntDesign name="edit" size={30} color="black" style={localStyles.itemButton} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item)}>
                <AntDesign name="delete" size={30} color="#dc3545" style={localStyles.itemButton} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.innerContainer}>
        {/* <TouchableOpacity style={styles.buttonContainer} onPress={deleteTasks} disabled={status === 'loading'}>
          <AntDesign name="delete" size={24} color="white" />
          <Text style={styles.buttonText}>Delete todos</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  todoItem: {
    justifyContent: 'space-between',
    alignContent: 'center',
    flexDirection: 'row',
    width: deviceWidth - 20,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 5,
    paddingRight: 5,
  },
  todoItemText: {
    lineHeight: 22,
    fontSize: 17,
  },
  todoItemDone: {
    textDecorationLine: 'line-through',
  },
  todoDescription: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemButtonsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemButton: {
    padding: 4,
  },
});

export default TodoList;
