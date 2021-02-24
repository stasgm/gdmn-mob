import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import { IUser, IUserCompany } from '../types';
import { User } from './User';
import { CompanyList } from './CompanyList';
import { DeviceList } from './DeviceList';
import { IDeviceInfo } from '../../../common';

export interface IProfileProps {
  user: IUser;
  companies?: IUserCompany[];
  devices?: IDeviceInfo[];
  isEditOK?: boolean;
  onClearEditOK?: () => void;
  onEditProfile: (user: Partial<IUser>) => void;
  onClearError: () => void;
  onRemoveDevices: (uIds: string[]) => void;
  onBlockDevices:  (uIds: string[], isUnBlock: boolean) => void;
  onGetCode: (deviceId: string) => void;
  isCanEditUser?: boolean;
  isCanEditDevices?: boolean;
}

export const Profile = ({ onEditProfile, user, companies, onClearError, isEditOK, devices,
  isCanEditUser, onRemoveDevices, onBlockDevices, onGetCode, isCanEditDevices }: IProfileProps) => {
  return (
    <Stack horizontalAlign='center'>
      <User
        key={user.id}
        isEditOK={isEditOK}
        user={user}
        mode={'editing'}
        onEditProfile={onEditProfile}
        onClearError={onClearError}
        isCanEditUser={isCanEditUser}
      />
      <Stack horizontalAlign='start'>
        {
          !!companies?.length   &&
          <CompanyList
            companies={companies}
          />
        }
        {
          !!devices?.length  &&
          <DeviceList
            devices={devices}
            onBlockDevices={onBlockDevices}
            onRemoveDevices={onRemoveDevices}
            onGetCode={onGetCode}
            onClearError={onClearError}
            isCanEditDevices={isCanEditDevices}
          />
        }
      </Stack>
    </Stack>
  )
}
