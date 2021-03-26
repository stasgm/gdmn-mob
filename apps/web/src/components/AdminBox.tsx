import React from 'react';
import { Stack, IColumn, DetailsList, SelectionMode, Link } from 'office-ui-fabric-react';

import { ICompany } from '@lib/common-types';

import { IItem } from '../types';

export interface IAdminProps {
  companies: ICompany[];
  onSelectCompany: (companyId: string) => void;
  onClearError: () => void;
}

export const AdminBox = ({ companies, onClearError, onSelectCompany }: IAdminProps) => {
  const items: IItem[] = companies.map(c => ({ key: c.id, name: c.title }));

  const linkComponent = (item: IItem) => (
    <Link
      key={item.key}
      onClick={() => {
        onClearError();
        onSelectCompany(item.key);
      }}
    >
      {item.name}
    </Link>
  );

  linkComponent.displayName = 'companyName';

  const columns: IColumn[] = [
    {
      key: 'companyName',
      name: 'Мои организации',
      minWidth: 300,
      fieldName: 'name',
      onRender: linkComponent,
    },
  ];

  return (
    <Stack horizontalAlign="center">
      <DetailsList items={items} columns={columns} selectionMode={SelectionMode.none} isHeaderVisible={true} />
    </Stack>
  );
};
