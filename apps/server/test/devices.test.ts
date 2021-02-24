/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { getApp } from './_test-environment';

describe('testing /api/devices/', () => {
  let setCookies: string[] = [];

  beforeAll(async () => {
    const resLogin = await request(getApp().callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: 'admin',
    });
    setCookies = resLogin.header['set-cookie'];
  });

  describe('GET /api/devices/:id', () => {
    test('SUCCESS: get device', async () => {
      const uid = '123';
      const response = await request(getApp().callback()).get(`/api/devices/${uid}`).query('deviceId=123');
      expect(response.status).toEqual(200);
      expect(response.body.result).toBeTruthy();
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('uid');
      expect(typeof response.body.data.uid).toBe('string');
      expect(response.body.data).toHaveProperty('user');
      expect(typeof response.body.data.user).toBe('string');
      expect(response.body.data).toHaveProperty('blocked');
      expect(typeof response.body.data.blocked).toBe('boolean');
    });

    test('ERROR: the device is not assigned to the user', async () => {
      const uid = 'asd123';
      const response = await request(getApp().callback())
        .get(`/api/devices/${uid}`)
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          userName: '1',
        });
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`the device (${uid}) is not assigned to the user`);
    });

    test('SUCCESS: get device', async () => {
      const uid = '123';
      const response = await request(getApp().callback())
        .get(`/api/devices/${uid}`)
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(200);
      expect(response.body.result).toBeTruthy();
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('uid');
      expect(typeof response.body.data.uid).toBe('string');
      expect(response.body.data).toHaveProperty('user');
      expect(typeof response.body.data.user).toBe('string');
      expect(response.body.data).toHaveProperty('blocked');
      expect(typeof response.body.data.blocked).toBe('boolean');
    });

    test('ERROR: device does not exist', async () => {
      const uid = '123qwe';
      const response = await request(getApp().callback())
        .get(`/api/devices/${uid}`)
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe('device does not exist');
    });
  });

  describe('GET /api/devices/', () => {
    test('SUCCESS: get device', async () => {
      const response = await request(getApp().callback())
        .get('/api/devices/')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(200);
      expect(response.body.result).toBeTruthy();
    });
  });

  describe('GET /api/devices/:id/currentuser', () => {
    test('SUCCESS: get device for current user', async () => {
      const response = await request(getApp().callback())
        .get('/api/devices/qwe/currentuser')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(200);
      expect(response.body.result).toBeTruthy();
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('uid');
      expect(typeof response.body.data.uid).toBe('string');
      expect(response.body.data).toHaveProperty('user');
      expect(typeof response.body.data.user).toBe('string');
      expect(response.body.data).toHaveProperty('blocked');
      expect(typeof response.body.data.blocked).toBe('boolean');
    });

    test('ERROR: device does not exist', async () => {
      const response = await request(getApp().callback())
        .get('/api/devices/asd/currentuser')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe('device does not exist');
    });
  });

  describe('GET /api/devices/:id/users', () => {
    test('SUCCESS: get users by device', async () => {
      const response = await request(getApp().callback())
        .get('/api/devices/qwe/users')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(200);
      expect(response.body.result).toBeTruthy();
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data[0]) {
        expect(response.body.data[0]).toHaveProperty('user');
        expect(typeof response.body.data[0].user).toBe('string');
        expect(response.body.data[0]).toHaveProperty('state');
        expect(typeof response.body.data[0].state).toBe('string');
      }
    });
  });

  describe('POST /api/devices/', () => {
    test('SUCCESS: second login', async () => {
      const response = await request(getApp().callback())
        .post('/api/devices/')
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          uid: 'qwe',
          userId: '1',
        });
      expect(response.status).toEqual(201);
      expect(response.body.result).toBeTruthy();
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('uid');
      expect(typeof response.body.data.uid).toBe('string');
      expect(response.body.data).toHaveProperty('user');
      expect(typeof response.body.data.user).toBe('string');
      expect(response.body.data).toHaveProperty('blocked');
      expect(typeof response.body.data.blocked).toBe('boolean');
    });

    test('ERROR: the device is assigned to the user', async () => {
      const uid = '123';
      const userId = 'admin';
      const response = await request(getApp().callback())
        .post('/api/devices/')
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          uid,
          userId,
        });
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`the device(${uid}) is assigned to the user(${userId})`);
    });
  });

  describe('PATCH /api/devices/:id/users/:userId', () => {
    test('SUCCESS: edit device', async () => {
      const response = await request(getApp().callback())
        .patch('/api/devices/123/user/1')
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          blocked: true,
        });
      expect(response.status).toEqual(200);
      expect(response.body.result).toBeTruthy();
    });

    test('ERROR: no such device', async () => {
      const response = await request(getApp().callback())
        .patch('/api/devices/123qwe/user/1')
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          blocked: true,
        });
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe('no such device');
    });
  });

  describe('DELETE /api/devices/:id', () => {
    test('SUCCESS: second login', async () => {
      const response = await request(getApp().callback())
        .delete('/api/devices/123')
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          userId: '1',
        });
      expect(response.status).toEqual(204);
    });

    test('ERROR: the device is assigned to the user', async () => {
      const uid = '123qwe';
      const userId = '1';
      const response = await request(getApp().callback())
        .delete(`/api/devices/${uid}`)
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          userId,
        });
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`the device(${uid}) is not assigned to the user(${userId})`);
    });
  });
});
