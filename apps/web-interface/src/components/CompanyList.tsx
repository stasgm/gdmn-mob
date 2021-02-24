import React from 'react';
import { IColumn, DetailsList, SelectionMode } from 'office-ui-fabric-react';
import { IUserCompany, IItem } from '../types';

export interface ICompaniesListProps {
  companies: IUserCompany[];
}

export const CompanyList = ({ companies }: ICompaniesListProps) => {

  const companyItems: IItem[] = companies.map(c => ({key: c.companyName, name: c.companyName})) || [];
  const companyColumns: IColumn[] = [{
    key: 'companyName',
    name: 'Организации пользователя',
    minWidth: 200,
    fieldName: 'name',
  }];

  return (
    <DetailsList
      items={companyItems}
      columns={companyColumns}
      selectionMode={SelectionMode.none}
      isHeaderVisible={true}
    />
  )
}
