import { ICommandBarItemProps, Stack, CommandBar, Label } from "office-ui-fabric-react";
import React from "react";

export interface IMenuProps {
  isAdmin?: boolean;
  querying: boolean;
  errorMessage?: string;
  onEditProfile: () => void;
  onGetCompanies?: () => void;
  onLogOut: () => void;
  onClearError: () => void;
  onCreateCompany: () => void;
  onCreateUser?: () => void;
  onAddUserFromSystem?: () => void;
  onCreateDevice?: () => void;
}

export const Menu = ({ onEditProfile, onLogOut, querying, errorMessage, onClearError, onCreateCompany, isAdmin, onGetCompanies, onCreateUser, onCreateDevice, onAddUserFromSystem }: IMenuProps) => {

  const _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      iconProps: { iconName: 'Add' },
      subMenuProps: {
        items: [
          {
            key: 'createCompany',
            text: 'Создать организацию..',
            iconProps: { iconName: 'Org' },
            onClick: () => {
              onClearError();
              onCreateCompany();
            }
          },
          {
            key: 'createUser',
            text: 'Добавить пользователя..',
            disabled: !isAdmin || !onCreateUser,
            iconProps: { iconName: 'AddFriend' },
            onClick: () => {
              onClearError();
              onCreateUser && onCreateUser();
            }
          },
          {
            key: 'addUser',
            text: 'Добавить пользователя из системы..',
            disabled: !isAdmin || !onAddUserFromSystem,
            iconProps: { iconName: 'PeopleAdd' },
            onClick: () => {
              onClearError();
              onAddUserFromSystem && onAddUserFromSystem();
            }
          },
          {
            key: 'createDevice',
            text: 'Добавить устройство',
            disabled: !isAdmin || !onCreateDevice,
            iconProps: { iconName: 'Devices3' },
            onClick: () => {
              onClearError();
              onCreateDevice  && onCreateDevice();
            }
          }
        ]
      }
    },
    {
      key: 'settings',
      iconProps: { iconName: 'AccountManagement'},
      subMenuProps: {
        items: [
          {
            key: 'editProfile',
            text: 'Редактировать профиль..',
            iconProps: { iconName: 'Settings' },
            onClick: () => {
              onClearError();
              onEditProfile()
            }
          },
          {
            key: 'profile',
            text: 'Мои организации',
            iconProps: { iconName: 'Org' },
            disabled: !isAdmin,
            onClick: () => {
              onClearError();
              onGetCompanies && onGetCompanies()
            }
          },
          {
            key: 'logOut',
            text: 'Выйти',
            iconProps: { iconName: 'SignOut' },
            onClick: () => {
              onClearError();
              onLogOut();
            }
          }
        ]
      }
    }
  ];

  return (
    <div style={{height: '44px', padding: '8px', borderBottom: '1px solid #dadce0'}}>
      <Stack horizontalAlign='end'>
        <CommandBar
          items={_items}
        />
        <div>
          {
            querying
            ?
              <Label>
                Идет запрос к серверу...
              </Label>
            :
              null
          }
          {
            errorMessage &&
            <Label>
              {`Ошибка на сервере: ${errorMessage}`}
            </Label>
          }
        </div>
      </Stack>
    </div>
  )
}
