import { useSelector } from '..';

const fileById = (id: string) => {
  return useSelector((state) => state.files.list.find((i) => i.id === id));
};

export default { fileById };
