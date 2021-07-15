import { useSelector } from '..';

const activationCodeById = (id: string) => {
  return useSelector((state) => state.activationCodes.list.find((d) => d.id === id));
};

export default { activationCodeById };
