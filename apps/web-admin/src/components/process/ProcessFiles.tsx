import { useState, useEffect } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { Box, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@material-ui/core';

interface IProps {
  files: string[];
  limitRows?: number;
}

const ProcessFiles = ({ files = [], limitRows = 0 }: IProps) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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
    const deviceList = files.slice(page * limit, page * limit + limit).map((file: string) => {
      return (
        <TableRow hover key={file}>
          <TableCell>{file}</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, files.length - page * limit);

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
        <Box sx={{ p: 1, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Файлы</TableCell>
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
        count={files.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default ProcessFiles;
