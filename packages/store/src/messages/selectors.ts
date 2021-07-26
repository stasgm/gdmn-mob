import { useSelector } from '../';

const selectById = (id: string) => {
  return useSelector((state) => state.messages.data.find((i) => i.id === id));
};

export default { selectById };
