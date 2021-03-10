import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

const login = async (userName: string, password: string) => {
  const body = {
    userName,
    password,
  };

  return await api.post('/api/auth/', body);
};

export { login };
