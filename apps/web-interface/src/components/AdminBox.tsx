 import React from 'react';
import { Stack, IColumn, DetailsList, SelectionMode, Link } from 'office-ui-fabric-react';
import { IItem, IUserCompany } from '../types';

export interface IAdminProps {
  companies: IUserCompany[];
  onSelectCompany: (companyId: string) => void;
  onClearError: () => void;
}

export const AdminBox = ({companies, onClearError, onSelectCompany}: IAdminProps) => {

  const items: IItem[] = companies.map(c => ({key: c.companyId, name: c.companyName}));
  const columns: IColumn[] = [{
    key: 'companyName',
    name: 'Мои организации',
    minWidth: 300,
    fieldName: 'name',
    onRender: item => (
      <Link
        key={item.key}
        onClick={() => {
          onClearError();
          onSelectCompany(item.key)
          }}>
        {item.name}
      </Link>
  )}];

  return (
    <Stack horizontalAlign='center'>
      <DetailsList
        items={items}
        columns={columns}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />
    </Stack>
  )
}