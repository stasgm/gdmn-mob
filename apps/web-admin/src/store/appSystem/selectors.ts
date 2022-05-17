import { useSelector } from '..';

const appSystemById = (id: string) => {
  return useSelector((state) => state.appSystems.list.find((d) => d.id === id));
};

export default { appSystemById };
