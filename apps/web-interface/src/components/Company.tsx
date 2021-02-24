import React, { useState } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';

export interface ICompanyProps {
  companyName?: string;
  onUpdateCompany: (name: string) => void;
  onClearError: () => void;
}

export const Company = ({ onUpdateCompany, onClearError, companyName }: ICompanyProps) => {
  const [nameComp, setName] = useState(companyName || '');

  return (
    <Stack horizontalAlign='center' >
      <Stack.Item>
        <TextField
          label="Наименование организации:"
          value={nameComp}
          onChange={ (_, nameComp) => setName(nameComp || '') }
        />
        <PrimaryButton
          text="Сохранить"
          style={{marginTop: '10px', float: 'right'}}
          disabled={!nameComp
            || nameComp === companyName}
          onClick={() => {
            onClearError();
            onUpdateCompany(nameComp)
          }}
        />
      </Stack.Item>
    </Stack>
  )
}