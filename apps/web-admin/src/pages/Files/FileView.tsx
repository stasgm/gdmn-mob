import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useNavigate, useParams } from 'react-router-dom';

import { useSelector, useDispatch } from '../../store';
import { IFileFilter, IFilterTable, IToolBarButton } from '../../types';

import FileDetailsView from '../../components/file/FileDetailsView';
import FileContentView from '../../components/file/FileContentView';
import { fileActions, fileSelectors } from '../../store/file';
import { adminPath } from '../../utils/constants';
import RadioGroup from '../../components/RadioGoup';
import ConfirmDialog from '../../components/ConfirmDialog';
import ViewContainer from '../../components/ViewContainer';

export type Params = {
  id: string;
};

const FileView = () => {
  const { id } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, file, folders, list, pageParams } = useSelector((state) => state.files);

  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const fileObject = fileSelectors.fileByIdAndFolder(id);

  const fetchFiles = useCallback(
    (filesFilters?: IFileFilter, filterText?: string, fromRecord?: number, toRecord?: number) => {
      if (filesFilters) {
        const ff: IFilterTable = Object.entries(filesFilters).reduce((prev: IFilterTable, [item, value]) => {
          if (value) {
            prev[item] = value;
          }
          return prev;
        }, {});
        dispatch(fileActions.fetchFiles(ff as IFileFilter, filterText, fromRecord, toRecord));
      } else {
        dispatch(fileActions.fetchFiles(filesFilters, filterText, fromRecord, toRecord));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (fileObject) {
      dispatch(fileActions.fetchFile(id, fileObject.folder, fileObject.appSystem?.id, fileObject.company?.id));
    }
  }, [dispatch, id, fileObject]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchFiles(pageParams?.filesFilters);
  }, [fetchFiles, pageParams?.filesFilters]);

  const fetchFolders = useCallback(() => {
    if (fileObject && fileObject.company && fileObject.appSystem) {
      dispatch(fileActions.fetchFolders(fileObject.company.id, fileObject.appSystem.id));
    }
  }, [dispatch, fileObject]);

  const [open, setOpen] = useState(false);
  const [openFolder, setOpenFolder] = useState(false);

  const handleGetFolders = useCallback(() => {
    if (fileObject?.appSystem?.id && fileObject?.company?.id) {
      setOpenFolder(true);
      fetchFolders();
    }
  }, [fileObject, fetchFolders]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/files/${id}/edit`);
  }, [navigate, id]);

  const handleDelete = useCallback(async () => {
    setOpen(false);
    const res = await dispatch(
      fileActions.deleteFile(
        id,
        fileObject?.folder || '',
        fileObject?.appSystem?.id || '',
        fileObject?.company?.id || '',
      ),
    );
    if (res.type === 'FILE/REMOVE_FILE_SUCCESS') {
      navigate(-1);
    }
  }, [dispatch, fileObject, id, navigate]);

  // const refreshData = useCallback(() => {
  //   dispatch(
  //     fileActions.fetchFile(
  //       id,
  //       fileObject?.ext || '',
  //       fileObject?.folder || '',
  //       fileObject?.appSystem?.id || '',
  //       fileObject?.company?.id || '',
  //     ),
  //   );
  // }, [dispatch, fileObject, id]);

  // useEffect(() => {
  //   refreshData();
  // }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseMovingDialog = () => {
    setOpenFolder(false);
  };

  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);

  const handleMoveFiles = useCallback(() => {
    setOpenFolder(false);

    if (selectedFolder && fileObject?.id) {
      dispatch(
        fileActions.moveFiles(
          [
            {
              id: id,
              appSystemId: fileObject.appSystem?.id || '',
              companyId: fileObject.company?.id || '',
              folder: fileObject.folder || '',
            },
          ],
          selectedFolder,
        ),
      );
    }
    handleCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fileObject, id, selectedFolder]);

  // const handleClearError = () => {
  //   dispatch(fileActions.clearError());
  // };

  const encode = (s: string) => {
    const out = [];
    for (let i = 0; i < s.length; i++) {
      out[i] = s.charCodeAt(i);
    }
    return new Uint16Array(out);
  };

  const handleDownload = useCallback(async () => {
    setOpen(false);
    const fileStr = JSON.stringify(file);
    const bufferArray = encode(fileStr);
    const blob = new Blob([bufferArray], {
      type: 'application/octet-stream',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileObject?.id || '';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [file, fileObject]);

  const buttons: IToolBarButton[] = useMemo(() => {
    return tabValue === 0
      ? [
          {
            name: 'Обновить',
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: fetchFiles,
            icon: <CachedIcon />,
          },

          {
            name: 'Переместить',
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: handleGetFolders,
            icon: <DriveFileMoveOutlinedIcon />,
          },
          {
            name: 'Скачать',
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: handleDownload,
            icon: <ArrowDownwardIcon />,
          },
          {
            name: 'Удалить',
            color: 'secondary',
            variant: 'contained',
            onClick: handleClickOpen,
            icon: <DeleteIcon />,
          },
        ]
      : [
          {
            name: 'Обновить',
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: fetchFiles,
            icon: <CachedIcon />,
          },
          {
            name: 'Редактировать',
            sx: { marginRight: 1 },
            color: 'primary',
            variant: 'contained',
            onClick: handleEdit,
            icon: <EditIcon />,
          },
        ];
  }, [fetchFiles, handleDownload, handleEdit, handleGetFolders, tabValue]);

  if (!fileObject && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Сообщение не найдено
      </Box>
    );
  }

  const tabs = [
    { name: 'Общая информация', component: fileObject ? <FileDetailsView list={fileObject} /> : null },
    { name: 'Содержимое', component: <FileContentView file={file} /> },
  ];

  return (
    <Box>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        questionText={'Вы действительно хотите удалить файл?'}
      />
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
      <ViewContainer
        handleCancel={handleCancel}
        buttons={buttons}
        loading={loading}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        tabs={tabs}
      />
    </Box>
  );
};

export default FileView;
