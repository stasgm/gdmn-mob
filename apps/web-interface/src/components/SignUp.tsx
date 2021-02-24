import { IUser } from "../types";
import React, { useState } from "react";
import { Stack, TextField, Label, PrimaryButton } from "office-ui-fabric-react";

interface ISignUpProps {
  user?: IUser;
  querying: boolean;
  errorMessage?: string;
  onSignUp: (userName: string, password: string, ) => void;
  onClearError: () => void;
};

export const SignUp = ({ user, querying, errorMessage, onSignUp, onClearError }: ISignUpProps) => {

  const [userName, setUserName] = useState(user?.userName || '');
  const [password, setPassword] = useState(user?.password || '');
  const [repeatPassword, setRepeatPassword] = useState<string>();

  return (
    <div>
      <Stack horizontalAlign='center'>
        <div style={{width: '250px'}}>
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
              {`Ошибка при регистрации пользователя на сервере: ${errorMessage}`}
            </Label>
          }
          <TextField
            label="User name:"
            value={userName}
            onChange={ (_, login) => login !== undefined ? setUserName(login) : undefined }
          />
          <TextField
            label="Password:"
            value={password}
            onChange={ (_, password) => password !== undefined ? setPassword(password) : undefined }
          />
          <TextField
            label="Repeat password:"
            value={repeatPassword}
            onChange={ (_, repeatPassword) => repeatPassword !== undefined ? setRepeatPassword(repeatPassword) : undefined }
          />
          <PrimaryButton
            text="Signup"
            style={{float: 'right', marginTop: '8px'}}
            disabled={ !userName || !password || querying || repeatPassword !== password}
            onClick={ () => {
              onClearError();
              onSignUp(userName, password)
            }}
          />
        </div>
      </Stack>
    </div>
  );
};