/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { getApp } from './_test-environment';

describe('Middleware: auth', () => {
  test('SUCCESS: authenticated', async () => {
    const resLogin = await request(getApp().callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: 'admin',
    });

    const response = await request(getApp().callback())
      .get('/api/users/')
      .query('deviceId=123')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(200);
  });

  test('ERROR: not authenticated', async () => {
    const response = await request(getApp().callback()).get('/api/users/').query('deviceId=123');
    expect(response.status).toEqual(401);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not authenticated');
  });
});

describe('Middleware: device', () => {
  let resLogin: request.Response;

  test('SUCCESS: authenticated', async () => {
    resLogin = await request(getApp().callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: '1',
      password: '1',
    });

    const response = await request(getApp().callback())
      .get('/api/users/')
      .query('deviceId=123')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(200);
  });

  test('ERROR: not such all parameters', async () => {
    const response = await request(getApp().callback()).get('/api/users/').set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(422);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not such all parameters');
  });

  test('ERROR: not such device', async () => {
    const response = await request(getApp().callback())
      .get('/api/users/')
      .query('deviceId=123qwe')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not such device');
  });

  test('ERROR: does not have access', async () => {
    resLogin = await request(getApp().callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: 'admin',
    });

    const response = await request(getApp().callback())
      .get('/api/users/')
      .query('deviceId=qwe')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(401);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('does not have access');
  });
});
