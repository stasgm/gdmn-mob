import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import { TodoScreenNavigationProp } from '../navigation/TodoStack';
import { TodoStackParamList } from '../navigation/types';
import { Todo } from '../types';
import { createTodo, fetchTodo, deleteTodo, selectError, selectStatus, updateTodo } from '../store';

import { useAppDispatch, useAppSelector } from '../../../store';
import { styles } from '../../../styles';

type ProfileScreenRouteProp = RouteProp<TodoStackParamList, 'TodoAddEdit'>;

const TodoEdit = () => {
  const navigation = useNavigation<TodoScreenNavigationProp>();
  const route = useRoute<ProfileScreenRouteProp>();
  const index = route.params?.id;

  const dispatch = useAppDispatch();

  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const [title, onChangeTitle] = useState('');
  const [description, onChangeDescription] = useState('');
  const [todoItem, setTodoItem] = useState<Todo>();

  const fetchData = useCallback(
    async (id: string) => {
      try {
        const item = await dispatch(fetchTodo(id)).unwrap();
        item && setTodoItem(item);
        onChangeTitle(item?.title);
        onChangeDescription(item?.description);
      } catch (err) {
        // console.error(err);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!index) {
      return;
    }
    fetchData(index);
    // process when the component is unmounted
  }, [fetchData, index]);

  const addOrUpdateTodoItem = async () => {
    if (!title || !description) {
      return;
    }

    try {
      if (todoItem) {
        await dispatch(updateTodo({ ...todoItem, description, title }));
      } else {
        await dispatch(createTodo({ title, description }));
      }

      console.log('i am here');
      onChangeTitle('');
      onChangeDescription('');

      navigation.navigate('TodoList');
    } catch (err) {
      console.log('err', err);
    }
  };

  const deleteTodoItem = async () => {
    if (!todoItem) {
      return;
    }

    try {
      await dispatch(deleteTodo(todoItem.id));
      navigation.navigate('TodoList');
    } catch (err) {
      console.log('err', err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${index ? 'Edit' : 'Add'} todo item`,
      headerLeft: () => (
        <MaterialIcons name="arrow-back-ios" size={30} style={styles.menuButton} onPress={navigation.goBack} />
      ),
    });
  }, [index, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {status === 'loading' ? (
        <View style={styles.innerContainer}>
          <ActivityIndicator size={'large'} />
          <Text style={styles.textCaption}>Loading...</Text>
        </View>
      ) : status === 'error' ? (
        <View style={styles.innerContainer}>
          <Text style={styles.textCaption}>{JSON.stringify(error)}</Text>
        </View>
      ) : (
        <View style={styles.innerContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.textCaption}>Title:</Text>
            <TextInput style={styles.textInput} onChangeText={onChangeTitle} value={title} placeholder="Title" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textCaption}>Description:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeDescription}
              value={description}
              placeholder="Description"
            />
          </View>
          <TouchableOpacity style={styles.buttonContainer} onPress={addOrUpdateTodoItem} disabled={status !== 'idle'}>
            {status === 'posting' ? (
              <>
                <ActivityIndicator size={'small'} />
                <Text style={styles.buttonText}>Saving...</Text>
              </>
            ) : (
              <>
                <AntDesign name="save" size={24} color="white" />
                <Text style={styles.buttonText}>Save</Text>
              </>
            )}
          </TouchableOpacity>
          {todoItem && (
            <TouchableOpacity style={styles.buttonContainer} onPress={deleteTodoItem} disabled={status !== 'idle'}>
              {status === 'deleting' ? (
                <>
                  <ActivityIndicator size={'small'} />
                  <Text style={styles.buttonText}>Deleting...</Text>
                </>
              ) : (
                <>
                  <AntDesign name="delete" size={24} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('TodoList')}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.buttonText}>Back to List</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default TodoEdit;
