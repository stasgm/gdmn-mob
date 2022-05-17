import { createAsyncThunk } from '@reduxjs/toolkit';
// import { AxiosError } from "axios"

import { IErrorMessage } from '../../../services/api/types';
import { todosApi } from '../api';
import { Todo } from '../types';

// thunk
const fetchTodos = createAsyncThunk<Todo[], void, { rejectValue: IErrorMessage }>(
  'todos/fetchAll',
  async (_, thunkApi) => {
    try {
      const response = await todosApi.get();
      if (response.success) {
        return response.data;
      }
      // TODO infer data type
      return thunkApi.rejectWithValue(response.data as IErrorMessage);
    } catch (err) {
      return thunkApi.rejectWithValue({ error: err.message } as IErrorMessage);
    }
  },
);

const fetchTodo = createAsyncThunk<Todo, string, { rejectValue: IErrorMessage }>(
  'todos/fetchById',
  async (id: string, thunkApi) => {
    try {
      const response = await todosApi.find(id);

      if (response.success) {
        return response.data;
      }
      // TODO infer data type
      return thunkApi.rejectWithValue(response.data as IErrorMessage);
    } catch (err) {
      // console.error('action err', err)
      return thunkApi.rejectWithValue({ error: err.message } as IErrorMessage);
    }
  },
);

const updateTodo = createAsyncThunk<Todo, Todo, { rejectValue: IErrorMessage }>(
  'todos/updateById',
  async (item: Todo, thunkApi) => {
    try {
      const response = await todosApi.update(item.id, item);

      if (response.success) {
        return response.data;
      }
      // TODO infer data type
      return thunkApi.rejectWithValue(response.data as IErrorMessage);
    } catch (err) {
      // console.error('action err', err)
      return thunkApi.rejectWithValue({ error: err.message });
    }
  },
);

export type NewItem = Pick<Todo, 'title' | 'description'>;

const createTodo = createAsyncThunk<Todo, NewItem, { rejectValue: IErrorMessage }>(
  'todos/createOne',
  async (item: NewItem, thunkApi) => {
    try {
      const response = await todosApi.create(item);

      // console.log('response', response);
      if (response.success) {
        return response.data;
      }
      // TODO infer data type
      return thunkApi.rejectWithValue(response.data as IErrorMessage);
    } catch (err) {
      return thunkApi.rejectWithValue({ error: err?.data });
    }
  },
);

const deleteTodo = createAsyncThunk<null, string, { rejectValue: IErrorMessage }>(
  'todos/deleteById',
  async (id: string, thunkApi) => {
    try {
      await todosApi.remove(id);

      return null;
    } catch (err) {
      // console.error('action err', err)
      return thunkApi.rejectWithValue({ error: err.message } as IErrorMessage);
    }
  },
);

export { fetchTodo, fetchTodos, updateTodo, createTodo, deleteTodo };
