import React, { useState } from "react";
import { Stack, TextField, Label, PrimaryButton } from "office-ui-fabric-react";

interface ILoginProps {
  userName?: string;
  password?: string;
  querying: boolean;
  errorMessage?: string;
  onLogin: (userName: string, password: string) => void;
  onSetSignUp: () => void;
  onClearError: () => void;
};

export const Login = ({ userName, password, querying, errorMessage, onLogin, onSetSignUp, onClearError }: ILoginProps) => {

  const [userName_state, setUserName] = useState(userName ?? '');
  const [password_state, setPassword] = useState(password ?? '');

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
              {`Ошибка при проверке пользователя на сервере: ${errorMessage}`}
            </Label>
          }
          <TextField
            label="Имя пользователя:"
            value={userName_state}
            onChange={ (_, userName) => userName !== undefined ? setUserName(userName) : undefined }
          />
          <TextField
            label="Пароль:"
            value={password_state}
            onChange={ (_, password) => password !== undefined ? setPassword(password) : undefined }
          />
          <PrimaryButton
            text="Войти"
            style={{float: 'right', margin: '8px 0'}}
            disabled={ !userName_state || !password_state || querying }
            onClick={ () => {
              onClearError();
              onLogin(userName_state, password_state);
            }}
          />
          <div
            onClick={ () => {
              onClearError();
              onSetSignUp();
            }}
            style={{width: '100%', float: 'right', textAlign: 'right', color: '#0366d6', textDecoration: 'underline', fontSize: '12px'}}
          >
            Зарегистрироваться
          </div>
        </div>
      </Stack>
    </div>
  );
};