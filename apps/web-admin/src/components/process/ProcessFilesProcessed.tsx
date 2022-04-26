import { useState, useEffect } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { Box, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { IProcessedFiles, StatusType } from '@lib/types';

type IProcessedFilesArray = [string, StatusType];

interface IProps {
  processedFiles1?: IProcessedFiles;
  limitRows?: number;
}

const ProcessFilesProcessed = ({ processedFiles1 = {}, limitRows = 0 }: IProps) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const processedFiles = Object.entries(processedFiles1);

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (limitRows > 0) {
      setLimit(limitRows);
    }
  }, [limitRows]);

  const TableRows = () => {
    const deviceList = processedFiles.slice(page * limit, page * limit + limit).map((file: IProcessedFilesArray) => {
      return (
        <TableRow hover key={file[0]}>
          <TableCell>{file[0]}</TableCell>
          <TableCell>{file[1]}</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, processedFiles.length - page * limit);

    return (
      <>
        {deviceList}
        {emptyRows > 0 && page > 0 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={4} />
          </TableRow>
        )}
      </>
    );
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Обработанные файлы</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRows />
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={processedFiles.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default ProcessFilesProcessed;
