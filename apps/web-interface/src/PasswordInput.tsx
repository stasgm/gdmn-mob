import React, { useState } from 'react';
import { ITextFieldProps, TextField } from 'office-ui-fabric-react/lib/components/TextField';
import { FontIcon } from 'office-ui-fabric-react/lib/components/Icon';

// interface IPasswordInputState {
//   passwVisible?: boolean;
// }

export const PasswordInput = (props: ITextFieldProps) => {
  const [passwVisible, setPasswVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={passwVisible ? 'text' : 'password'}
      onRenderSuffix={() => (
        <FontIcon
          iconName="RedEye"
          onClick={() => {
            setPasswVisible(true);
            setTimeout(() => setPasswVisible(false), 400);
          }}
        />
      )}
    />
  );
}
