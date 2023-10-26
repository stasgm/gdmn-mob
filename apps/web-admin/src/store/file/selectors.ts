import { useSelector } from '..';

const fileById = (id: string) => {
  return useSelector((state) => state.files.list.find((i) => i.id === id));
};

const fileByIdAndFolder = (id: string, folder?: string) => {
  return useSelector((state) =>
    state.files.list.find((i) => (folder ? i.id === id && i.folder === folder : i.id === id)),
  );
};
export default { fileById, fileByIdAndFolder };
