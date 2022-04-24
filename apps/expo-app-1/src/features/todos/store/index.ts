import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { v4 as uuidv4 } from 'uuid';

import { Todo, TodoStatus } from '../types';

import { RootState } from '../../../store';
import { IErrorMessage } from '../../../services/api/types';

import { fetchTodos, fetchTodo, updateTodo, createTodo, deleteTodo } from './asyncActions';

type TodosState = {
  status: 'loading' | 'error' | 'idle' | 'posting' | 'deleting';
  error: string | null;
  list: Todo[];
};

const initialState = {
  list: [],
  status: 'idle',
  error: null,
} as TodosState;

// interface RejectedAction extends Action {
//   error: Error;
// }

// type StartedAction = Action;

// function isRejectedAction(action: AnyAction): action is RejectedAction {
//   return action.type.endsWith('rejected')
// }

// function isStrtedAction(action: AnyAction): action is StartedAction {
//   return action.type.endsWith('pending') && action.
// }

// Slice
const slice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearStatus(state) {
      state.error = null;
      state.status = 'idle';
    },
    addTodos(state, action: PayloadAction<Todo[]>) {
      state.list = action.payload;
    },
    removeTodos(state) {
      state.list = [];
    },
    // addTodo: {
    //   reducer: (state, action: PayloadAction<Todo>) => {
    //     state.list.unshift(action.payload);
    //   },
    //   prepare: (title: string, description?: string) => ({
    //     payload: {
    //       id: uuidv4(),
    //       title,
    //       description,
    //       status: TodoStatus.OPEN,
    //     } as Todo,
    //   }),
    // },
    // removeTodo(state, action: PayloadAction<string>) {
    //   const index = state.list.findIndex((todo) => todo.id === action.payload);
    //   state.list.splice(index, 1);
    // },
    setTodoStatus(state, action: PayloadAction<{ status: TodoStatus; id: string }>) {
      const index = state.list.findIndex((todo) => todo.id === action.payload.id);
      state.list[index].status = action.payload.status;
    },
    // editTodo(state, action: PayloadAction<Todo>) {
    //   const index = state.list.findIndex((todo) => todo.id === action.payload.id);
    //   state.list[index] = action.payload;
    // },
    // startLoading(state) {
    //   state.status = 'loading';
    //   state.error = null;
    // }
  },
  extraReducers: (builder) => {
    // Fetch all
    builder.addCase(fetchTodos.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.list = action.payload;
      state.status = 'idle';
      state.error = null;
    });
    builder.addCase(fetchTodo.pending, (state) => {
      // Fetch one
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchTodo.fulfilled, (state, action) => {
      const index = state.list.findIndex((todo) => todo.id === action.payload.id);
      state.list[index] = action.payload;
      state.status = 'idle';
      state.error = null;
    });
    // Update one
    builder.addCase(updateTodo.pending, (state) => {
      state.status = 'posting';
      state.error = null;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      const index = state.list.findIndex((todo) => todo.id === action.payload.id);
      state.list[index] = action.payload;
      state.status = 'idle';
      state.error = null;
    });
    // Update one
    builder.addCase(createTodo.pending, (state) => {
      state.status = 'posting';
      state.error = null;
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.list.unshift(action.payload);
      state.status = 'idle';
      state.error = null;
    });
    builder.addCase(createTodo.rejected, (state, { payload }) => {
      const error = payload?.error as unknown as IErrorMessage;
      state.status = 'error';
      state.error = error?.message?.join() || error?.error || 'Unknown error';
    });
    // Delete one
    builder.addCase(deleteTodo.pending, (state) => {
      state.status = 'deleting';
      state.error = null;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      const index = state.list.findIndex((todo) => todo.id === action.payload);
      state.list.splice(index, 1);
      state.status = 'idle';
      state.error = null;
    });
    // Add one
    // builder.addMatcher(isStrtedAction, (state) => {
    //   state.status = 'loading';
    //   state.error = null;
    // }),
    // builder.addMatcher(isRejectedAction, (state, { error }) => { state.error = error.message; });
  },
});

// selectors
export const selectStatus = (state: RootState) => state.todos.status;
export const selectError = (state: RootState) => state.todos.error;

// Actions
export const { removeTodos, setTodoStatus, clearStatus } = slice.actions;

// Async Actions
export { fetchTodos, fetchTodo, updateTodo, createTodo, deleteTodo };

// Reducer
export default slice.reducer;
