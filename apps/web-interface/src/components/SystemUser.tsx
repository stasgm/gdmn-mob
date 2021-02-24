import React, { useState } from 'react';
import { PrimaryButton, Stack, VirtualizedComboBox, IComboBoxOption} from 'office-ui-fabric-react';
import { IUser } from '../types';

export interface ISystemUserProps {
  allUsers?: IUser[];
  companyUsers?: IUser[];
  onAddUser: (userId: string) => void;
  onClearError: () => void;
}

export const SystemUser = ({ onClearError, onAddUser, allUsers, companyUsers }: ISystemUserProps) => {
  const [user, setUser] = useState<string | number| undefined>();
  const users: IComboBoxOption[] = allUsers?.map(u => ({key: u.id, text: u.userName, disabled: companyUsers?.find(cu => cu.id === u.id)} as IComboBoxOption)) || []

  return (
    <Stack horizontalAlign='center' >

      <Stack.Item>
        <VirtualizedComboBox
          styles={{ root: { maxWidth: '300px' } }}
          selectedKey={user}
          label="Пользователи системы"
          allowFreeform={true}
          autoComplete="on"
          options={users}
          dropdownMaxWidth={200}
          useComboBoxAsMenuWidth={true}
          onChange={(ev, option) => setUser(option?.key)}
        />

        <PrimaryButton
          text="Добавить"
          style={{marginTop: '10px', float: 'right'}}
          disabled={false}
          onClick={() => {
            onClearError();
            onAddUser(user as string);
          }}
        />

      </Stack.Item>
    </Stack>
  )}

