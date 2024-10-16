import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CardHeader,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Typography,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';

import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useSelector, useDispatch } from '../../store';
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import fileSelectors from '../../store/file/selectors';
import SnackBar from '../../components/SnackBar';

import FileDetailsView from '../../components/file/FileDetailsView';
import FileContentView from '../../components/file/FileContentView';
import fileActions from '../../store/file';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import { adminPath } from '../../utils/constants';
import RadioGroup from '../../components/RadioGoup';

export type Params = {
  id: string;
};

const FileView = () => {
  const { id } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, errorMessage, file, list, pageParams, folders } = useSelector((state) => state.files);

  const fetchFile = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(fileActions.fetchFile(id));
    },
    [dispatch, id],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchFile(pageParams?.filterText as string);
  }, [fetchFile, pageParams?.filterText]);

  const process = fileSelectors.fileById(id);

  const fetchFolders = useCallback(() => {
    if (process && process.company && process.appSystem) {
      dispatch(fileActions.fetchFolders(process.company.id, process.appSystem.id));
    }
  }, [dispatch, process]);

  const [open, setOpen] = useState(false);
  const [openFolder, setOpenFolder] = useState(false);

  const handleGetFolders = () => {
    if (process?.appSystem?.id && process?.company?.id) {
      setOpenFolder(true);
      fetchFolders();
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/files/${id}/edit`);
  };

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(fileActions.removeFile(id));
    if (res.type === 'FILE/REMOVE_FILE_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(fileActions.fetchFile(id));
  }, [dispatch, id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseMovingDialog = () => {
    setOpenFolder(false);
  };

  const handleMoveFiles = () => {
    setOpenFolder(false);
    if (selectedFolder && process?.id) {
      dispatch(fileActions.moveFiles([process?.id], selectedFolder));
    }
    handleCancel();
  };

  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);

  const handleClearError = () => {
    dispatch(fileActions.fileSystemActions.clearError());
  };

  if (!process) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        {loading ? <CircularProgressWithContent content={'Идет загрузка данных...'} /> : 'Сообщение не найдено'}
      </Box>
    );
  }

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: refreshData,
      icon: <CachedIcon />,
    },
    {
      name: 'Редактировать',
      sx: { marginRight: 1 },
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: handleEdit,
      icon: <EditIcon />,
    },
    {
      name: 'Переместить',
      sx: { marginRight: 1 },
      color: 'secondary',
      variant: 'contained',
      onClick: handleGetFolders,
      icon: <DriveFileMoveOutlinedIcon />,
    },
    {
      name: 'Удалить',
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: handleClickOpen,
      icon: <DeleteIcon />,
    },
  ];

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить файл?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary" variant="contained">
              Удалить
            </Button>
            <Button onClick={handleClose} color="secondary" variant="contained">
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <RadioGroup
        contentText="Выберите нужную папку:"
        checked={selectedFolder || undefined}
        isOpen={openFolder}
        okLabel="Переместить"
        onCancel={handleCloseMovingDialog}
        onChange={(folder) => setSelectedFolder(folder)}
        onClose={handleCloseMovingDialog}
        onOk={handleMoveFiles}
        values={folders}
      />
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
            <IconButton color="primary" onClick={handleCancel}>
              <ArrowBackIcon />
            </IconButton>
            <CardHeader title={'Назад'} />
            {loading && <CircularProgress size={40} />}
          </Box>
          <Box
            sx={{
              justifyContent: 'right',
            }}
          >
            <ToolBarAction buttons={buttons} />
          </Box>
        </Box>
        {file ? (
          <>
            <Box
              sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
              }}
            >
              <FileDetailsView list={process} />
            </Box>

            <Box>
              <CardHeader sx={{ mx: 2 }} />
              <FileContentView file={file} />
            </Box>
          </>
        ) : (
          <Box>
            <CardHeader sx={{ mx: 2 }} />
            <Grid item>
              <Typography variant="subtitle1" gutterBottom>
                Данный файл не является файлом формата JSON
              </Typography>
            </Grid>
          </Box>
        )}
      </Box>

      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default FileView;
