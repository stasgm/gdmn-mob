import { useState } from 'react';
import { NavLink } from 'react-router-dom';

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
} from '@material-ui/core';
import { ICompany } from '@lib/types';

interface props {
  companies: ICompany[];
}

const CompanyListTable = ({ companies = [], ...rest }: props) => {
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<any>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedCompanyIds;

    if (event.target.checked) {
      newSelectedCompanyIds = companies.map((company: any) => company.id);
    } else {
      newSelectedCompanyIds = [];
    }

    setSelectedCompanyIds(newSelectedCompanyIds);
  };

  const handleSelectOne = (_event: any, id: any) => {
    const selectedIndex = selectedCompanyIds.indexOf(id);
    let newSelectedCompanyIds: any = [];

    if (selectedIndex === -1) {
      newSelectedCompanyIds = newSelectedCompanyIds.concat(selectedCompanyIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCompanyIds = newSelectedCompanyIds.concat(selectedCompanyIds.slice(1));
    } else if (selectedIndex === selectedCompanyIds.length - 1) {
      newSelectedCompanyIds = newSelectedCompanyIds.concat(selectedCompanyIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCompanyIds = newSelectedCompanyIds.concat(
        selectedCompanyIds.slice(0, selectedIndex),
        selectedCompanyIds.slice(selectedIndex + 1),
      );
    }

    setSelectedCompanyIds(newSelectedCompanyIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  const TableRows = () => {
    const companyList = companies.slice(0, limit).map((company: ICompany) => (
      <TableRow hover key={company.id} selected={selectedCompanyIds.indexOf(company.id) !== -1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedCompanyIds.indexOf(company.id) !== -1}
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
            <NavLink to={`/app/companies/${company.id}`}>
              <Typography color="textPrimary" variant="body1" key={company.id}>
                {company.name}
              </Typography>
            </NavLink>
          </Box>
        </TableCell>
        <TableCell>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <NavLink to={`/app/users/${company.admin.id}`}>
              <Typography color="textPrimary" variant="body1" key={company.admin.id}>
                {company.admin.name}
              </Typography>
            </NavLink>
          </Box>
        </TableCell>
      </TableRow>
    ));
    return <>{companyList}</>;
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCompanyIds.length === companies.length}
                    color="primary"
                    indeterminate={selectedCompanyIds.length > 0 && selectedCompanyIds.length < companies.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Администратор</TableCell>
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

export default CompanyListTable;
