/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { getApp } from './_test-environment';

describe('testing /api/users/', () => {
  let setCookies: string[] = [];

  beforeAll(async () => {
    const resLogin = await request(getApp().callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: 'admin',
    });
    setCookies = resLogin.header['set-cookie'];
  });

  describe('GET /api/users/:id', () => {
    describe('SUCCESS: get user', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .get(`/api/users/1`)
          .query('deviceId=123')
          .set('Cookie', setCookies);
      });

      test('Status 200', () => {
        expect(response.status).toEqual(200);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('creatorId');
      });

      test('do not fields: password', () => {
        expect(response.body.data).not.toHaveProperty('password');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.id).toBe('string');
        expect(typeof response.body.data.userName).toBe('string');
        expect(typeof response.body.data.creatorId).toBe('string');
      });

      let count = 0;

      test('correct optional fields', () => {
        const keys = Object.keys(response.body.data);
        if (keys.some(key => key === 'companies') && response.body.data.companies) {
          expect(Array.isArray(response.body.data.companies)).toBe(true);
          if (response.body.data.companies[0]) {
            expect(typeof response.body.data.companies[0]).toBe('string');
          }
          count++;
        }
        if (keys.some(key => key === 'firstName') && response.body.data['firstName']) {
          expect(typeof response.body.data['firstName']).toBe('string');
          count++;
        }
        if (keys.some(key => key === 'lastName') && response.body.data['lastName']) {
          expect(typeof response.body.data['lastName']).toBe('string');
          count++;
        }
        if (keys.some(key => key === 'phoneNumber') && response.body.data['phoneNumber']) {
          expect(typeof response.body.data['phoneNumber']).toBe('string');
          count++;
        }
      });

      test('correct data length', () => {
        expect(Object.keys(response.body.data).length).toBeLessThanOrEqual(count + 3);
      });
    });

    test('ERROR: no such user', async () => {
      const response = await request(getApp().callback())
        .get(`/api/users/nimda`)
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(404);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`no such user`);
    });
  });

  describe('GET /api/users/', () => {
    describe('SUCCESS: get all users', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .get('/api/users/')
          .query('deviceId=123')
          .set('Cookie', setCookies);
      });

      test('Status 200', () => {
        expect(response.status).toEqual(200);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        if (response.body.data[0]) {
          expect(response.body.data[0]).toHaveProperty('id');
          expect(response.body.data[0]).toHaveProperty('userName');
          expect(response.body.data[0]).toHaveProperty('creatorId');
        }
      });

      test('do not fields: password', () => {
        if (response.body.data[0]) {
          expect(response.body.data[0]).not.toHaveProperty('password');
        }
      });

      test('correct type data', () => {
        if (response.body.data[0]) {
          expect(typeof response.body.data[0].id).toBe('string');
          expect(typeof response.body.data[0].userName).toBe('string');
          expect(typeof response.body.data[0].creatorId).toBe('string');
        }
      });

      let count = 0;

      test('correct optional fields', () => {
        if (response.body.data[0]) {
          const keys = Object.keys(response.body.data[0]);
          if (keys.some(key => key === 'companies') && response.body.data[0].companies) {
            expect(Array.isArray(response.body.data[0].companies)).toBe(true);
            if (response.body.data[0].companies[0]) {
              expect(typeof response.body.data[0].companies[0]).toBe('string');
            }
            count++;
          }
          if (keys.some(key => key === 'firstName') && response.body.data[0].firstName) {
            expect(typeof response.body.data[0].firstName).toBe('string');
            count++;
          }
          if (keys.some(key => key === 'lastName') && response.body.data[0].lastName) {
            expect(typeof response.body.data[0].lastName).toBe('string');
            count++;
          }
          if (keys.some(key => key === 'phoneNumber') && response.body.data[0].phoneNumber) {
            expect(typeof response.body.data[0].phoneNumber).toBe('string');
            count++;
          }
        }
      });

      test('correct data length', () => {
        if (response.body.data[0]) {
          expect(Object.keys(response.body.data[0]).length).toBeLessThanOrEqual(count + 3);
        }
      });
    });
  });

  describe('GET /api/users/:id/devices', () => {
    test('SUCCESS: get devices by user', async () => {
      const response = await request(getApp().callback())
        .get('/api/users/1/devices')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(200);
      expect(response.body.result).toBeTruthy();
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data[0]) {
        expect(response.body.data[0]).toHaveProperty('uid');
        expect(typeof response.body.data[0].uid).toBe('string');
        expect(response.body.data[0]).toHaveProperty('state');
        expect(typeof response.body.data[0].state).toBe('string');
      }
    });
  });

  describe('PATCH /api/users/:id', () => {
    describe('SUCCESS: edit user', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .patch('/api/users/1')
          .query('deviceId=123')
          .set('Cookie', setCookies)
          .send({
            firstName: '123',
            lastName: '123',
          });
      });

      test('Status 200', () => {
        expect(response.status).toEqual(200);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('creatorId');
        expect(response.body.data).toHaveProperty('firstName');
        expect(response.body.data).toHaveProperty('lastName');
      });

      test('do not fields: password', () => {
        expect(response.body.data).not.toHaveProperty('password');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.id).toBe('string');
        expect(typeof response.body.data.userName).toBe('string');
        expect(typeof response.body.data.creatorId).toBe('string');
        expect(typeof response.body.data.firstName).toBe('string');
        expect(typeof response.body.data.lastName).toBe('string');
      });

      let count = 0;

      test('correct optional fields', () => {
        const keys = Object.keys(response.body.data);
        if (keys.some(key => key === 'companies') && response.body.data.companies) {
          expect(Array.isArray(response.body.data.companies)).toBe(true);
          if (response.body.data.companies[0]) {
            expect(typeof response.body.data.companies[0]).toBe('string');
          }
          count++;
        }
        if (keys.some(key => key === 'phoneNumber') && response.body.data['phoneNumber']) {
          expect(typeof response.body.data['phoneNumber']).toBe('string');
          count++;
        }
      });

      test('correct data length', () => {
        expect(Object.keys(response.body.data).length).toBeLessThanOrEqual(count + 5);
      });
    });

    describe('SUCCESS: not edit id, creator', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .patch('/api/users/1')
          .query('deviceId=123')
          .set('Cookie', setCookies)
          .send({
            id: '123',
            creatorId: '123',
            phoneNumber: '123',
          });
      });

      test('Status 200', () => {
        expect(response.status).toEqual(200);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('creatorId');
        expect(response.body.data).toHaveProperty('phoneNumber');
      });

      test('do not fields: password', () => {
        expect(response.body.data).not.toHaveProperty('password');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.id).toBe('string');
        expect(typeof response.body.data.userName).toBe('string');
        expect(typeof response.body.data.creatorId).toBe('string');
        expect(typeof response.body.data.phoneNumber).toBe('string');
      });

      test('correct value properties', () => {
        expect(response.body.data.id).toBe('1');
        expect(response.body.data.creatorId).not.toBe('123');
        expect(response.body.data.phoneNumber).toBe('123');
      });

      let count = 0;

      test('correct optional fields', () => {
        const keys = Object.keys(response.body.data);
        if (keys.some(key => key === 'companies') && response.body.data.companies) {
          expect(Array.isArray(response.body.data.companies)).toBe(true);
          if (response.body.data.companies[0]) {
            expect(typeof response.body.data.companies[0]).toBe('string');
          }
          count++;
        }
        if (keys.some(key => key === 'firstName') && response.body.data['firstName']) {
          expect(typeof response.body.data['firstName']).toBe('string');
          count++;
        }
        if (keys.some(key => key === 'lastName') && response.body.data['lastName']) {
          expect(typeof response.body.data['lastName']).toBe('string');
          count++;
        }
      });

      test('correct data length', () => {
        expect(Object.keys(response.body.data).length).toBeLessThanOrEqual(count + 4);
      });
    });

    describe('SUCCESS: edit conpanies', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .patch('/api/users/1')
          .query('deviceId=123')
          .set('Cookie', setCookies)
          .send({
            companies: ['com', 'org'],
          });
      });

      test('Status 200', () => {
        expect(response.status).toEqual(200);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('creatorId');
        expect(response.body.data).toHaveProperty('companies');
      });

      test('do not fields: password', () => {
        expect(response.body.data).not.toHaveProperty('password');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.id).toBe('string');
        expect(typeof response.body.data.userName).toBe('string');
        expect(typeof response.body.data.creatorId).toBe('string');
        expect(Array.isArray(response.body.data.companies)).toBe(true);
      });

      test('correct value properties', () => {
        expect(response.body.data.companies.length).toBe(2);
        expect(response.body.data.companies[0]).toBe('com');
        expect(response.body.data.companies[1]).toBe('org');
      });

      let count = 0;

      test('correct optional fields', () => {
        const keys = Object.keys(response.body.data);
        if (keys.some(key => key === 'firstName') && response.body.data['firstName']) {
          expect(typeof response.body.data['firstName']).toBe('string');
          count++;
        }
        if (keys.some(key => key === 'lastName') && response.body.data['lastName']) {
          expect(typeof response.body.data['lastName']).toBe('string');
          count++;
        }
        if (keys.some(key => key === 'phoneNumber') && response.body.data['phoneNumber']) {
          expect(typeof response.body.data['phoneNumber']).toBe('string');
          count++;
        }
      });

      test('correct data length', () => {
        expect(Object.keys(response.body.data).length).toBeLessThanOrEqual(count + 4);
      });
    });

    test('ERROR: no such user', async () => {
      const response = await request(getApp().callback())
        .patch('/api/users/nimda')
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          companies: ['com', 'org'],
        });
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe('no such user');
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('SUCCESS: delete user', async () => {
      const response = await request(getApp().callback())
        .delete('/api/users/2')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(204);
    });

    test('ERROR: no such user', async () => {
      const response = await request(getApp().callback())
        .delete(`/api/users/nimda`)
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`no such user`);
    });
  });
});
