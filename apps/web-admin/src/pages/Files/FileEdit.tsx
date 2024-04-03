import { Box, CircularProgress, CardHeader } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import FileDetails from '../../components/file/FileDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import { fileActions, fileSelectors } from '../../store/file';

export type Params = {
  id: string;
};

const FileEdit = () => {
  const { id } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading, file } = useSelector((state) => state.files);

  const fileObject = fileSelectors.fileByIdAndFolder(id);

  // const fetchFile = useCallback(() => {
  //   dispatch(
  //     fileActions.fetchFile(
  //       id,
  //       // fileObject?.ext || '',
  //       fileObject?.folder || '',
  //       fileObject?.appSystem?.id || '',
  //       fileObject?.company?.id || '',
  //     ),
  //   );
  // }, [dispatch, fileObject?.appSystem?.id, fileObject?.company?.id, fileObject?.folder, id]);

  // useEffect(() => {
  //   // Загружаем данные при загрузке компонента.
  //   fetchFile();
  // }, [fetchFile]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: any) => {
    const res = await dispatch(
      fileActions.updateFile(
        id,
        values as any,
        fileObject?.folder || '',
        fileObject?.appSystem?.id || '',
        fileObject?.company?.id || '',
      ),
    );
    if (res.type === 'FILE/UPDATE_FILE_SUCCESS') {
      goBack();
    }
  };

  if (!file) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Файл не найден
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CardHeader title={'Редактирование файла'} />
        {loading && <CircularProgress size={40} />}
      </Box>
      <FileDetails file={file} loading={loading} onSubmit={handleSubmit} onCancel={goBack} />
    </Box>
  );
};

export default FileEdit;
