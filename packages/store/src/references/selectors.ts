import { useSelector } from '../';

const selectByName = (name: string) => {
  return useSelector((state) => state.references.list[name]);
};

export default { selectByName };
