import { IColumn, DetailsList, SelectionMode } from 'office-ui-fabric-react';

import { ICompany } from '@lib/types';

import { IItem } from '../types';

export interface ICompaniesListProps {
  companies: ICompany[];
}

export const CompanyList = ({ companies }: ICompaniesListProps) => {
  const companyItems: IItem[] = companies.map((c) => ({ key: c.id, name: c.title })) || [];
  const companyColumns: IColumn[] = [
    {
      key: 'companyName',
      name: 'Организации пользователя',
      minWidth: 200,
      fieldName: 'name',
    },
  ];

  return (
    <DetailsList
      items={companyItems}
      columns={companyColumns}
      selectionMode={SelectionMode.none}
      isHeaderVisible={true}
    />
  );
};
