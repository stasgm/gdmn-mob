import React, { useState } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';

export interface IDeviceProps {
  title?: string;
  onUpdateDevice: (name: string) => void;
  onClearError: () => void;
}

export const Device = ({ onUpdateDevice, onClearError, title }: IDeviceProps) => {
  const [name, setName] = useState(title || '');

  return (
    <Stack horizontalAlign='center' >
      <Stack.Item>
        <TextField
          label="Наименование устройства:"
          value={name}
          onChange={ (_, name) => setName(name || '') }
        />
        <PrimaryButton
          text="Сохранить"
          style={{marginTop: '10px', float: 'right'}}
          disabled={!name
            || name === title}
          onClick={() => {
            onClearError();
            onUpdateDevice(name)
          }}
        />
      </Stack.Item>
    </Stack>
  )
}
