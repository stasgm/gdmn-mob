import { apiProvider } from '../../../services/api/api';
import { NewItem } from '../store/asyncActions';
import { Todo } from '../types';

const todoProvider = apiProvider<Todo>('tasks');

export const todosApi = {
  get() {
    return todoProvider.getAll();
  },
  find(id: string) {
    return todoProvider.get(id);
  },
  create(item: NewItem) {
    return todoProvider.post(item);
  },
  update(id: string, item: Todo) {
    return todoProvider.patch(id, item);
  },
  remove(id: string) {
    return todoProvider.remove(id);
  },
};
