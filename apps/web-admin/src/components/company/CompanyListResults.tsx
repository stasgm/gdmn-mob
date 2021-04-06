import { useState } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { ICompany } from '@lib/types';

interface props {
  companies?: ICompany[];
}

const CompanyListResults = ({ companies = [], ...rest }: props) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<any>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = companies.map((company: any) => company.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (_event: any, id: any) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds: any = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1),
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  const YourTableBody = () => {
    const companyList = companies.slice(0, limit).map((company: any) => (
      <TableRow hover key={company.id} selected={selectedCustomerIds.indexOf(company.id) !== -1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedCustomerIds.indexOf(company.id) !== -1}
            onChange={(event) => handleSelectOne(event, company.id)}
            value="true"
          />
        </TableCell>
        <TableCell>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            {/* <Avatar src={company.avatarUrl} sx={{ mr: 2 }}>
                        {getInitials(company.title)}
                      </Avatar> */}
            <Typography color="textPrimary" variant="body1">
              {company.title}
            </Typography>
          </Box>
        </TableCell>
        {/* <TableCell>{company.email}</TableCell>
                  <TableCell>
                    {`${company.address.city},
                    ${company.address.state},
                    ${company.address.country}`}
                  </TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{moment(company.createdAt).format('DD/MM/YYYY')}</TableCell> */}
      </TableRow>
    ));
    return <>{companyList}</>;
  };

  const Spinner = () => (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
      }}
    >
      <CircularProgress />
      {/* <span style={{ marginLeft: '20px' }}>Загружается. Пожалуйста, подождите...</span> */}
    </Box>
  );

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === companies.length}
                    color="primary"
                    indeterminate={selectedCustomerIds.length > 0 && selectedCustomerIds.length < companies.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Наименование</TableCell>
                {/* <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Registration date</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>{true ? <Spinner /> : <YourTableBody />}</TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={companies.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default CompanyListResults;
