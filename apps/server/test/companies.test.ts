/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { getApp } from './_test-environment';

describe('testing /api/companies/', () => {
  let setCookies: string[] = [];
  const userName = 'admin';

  beforeAll(async () => {
    const resLogin = await request(getApp().callback()).post('/api/auth/login').query('deviceId=123').send({
      userName,
      password: 'admin',
    });
    setCookies = resLogin.header['set-cookie'];
  });

  describe('GET /api/companies/:id', () => {
    describe('SUCCESS: get company', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .get(`/api/companies/com`)
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
        expect(response.body.data).toHaveProperty('title');
        expect(response.body.data).toHaveProperty('admin');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.id).toBe('string');
        expect(typeof response.body.data.title).toBe('string');
        expect(typeof response.body.data.admin).toBe('string');
      });

      test('correct data length', () => {
        expect(Object.keys(response.body.data).length).toEqual(3);
      });
    });

    test('ERROR: no such company', async () => {
      const response = await request(getApp().callback())
        .get(`/api/companies/nimda`)
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`no such company`);
    });
  });

  describe('GET /api/companies/', () => {
    describe('SUCCESS: get all companies', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .get('/api/companies/')
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
          expect(response.body.data[0]).toHaveProperty('title');
          expect(response.body.data[0]).toHaveProperty('admin');
        }
      });

      test('correct type data', () => {
        if (response.body.data[0]) {
          expect(typeof response.body.data[0].id).toBe('string');
          expect(typeof response.body.data[0].title).toBe('string');
          expect(typeof response.body.data[0].admin).toBe('string');
        }
      });

      test('correct data length', () => {
        if (response.body.data[0]) {
          expect(Object.keys(response.body.data[0]).length).toEqual(3);
        }
      });
    });
  });

  describe('GET /api/companies/:id/users', () => {
    describe('SUCCESS: get users by company', () => {
      let response: request.Response;
      const id = 'com';

      beforeAll(async () => {
        response = await request(getApp().callback())
          .get(`/api/companies/${id}/users`)
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
          expect(response.body.data[0]).toHaveProperty('companies');
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
          expect(Array.isArray(response.body.data[0].companies)).toBe(true);
        }
      });

      test('correct value properties', () => {
        expect(response.body.data[0].companies.length).toBeGreaterThanOrEqual(1);
        expect(typeof response.body.data[0].companies[0]).toBe('string');
        expect((response.body.data[0].companies as string[]).some(company => company === id)).toBe(true);
      });

      let count = 0;

      test('correct optional fields', () => {
        if (response.body.data[0]) {
          const keys = Object.keys(response.body.data[0]);
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
          expect(Object.keys(response.body.data[0]).length).toBeLessThanOrEqual(count + 4);
        }
      });
    });
  });

  describe('POST /api/companies/', () => {
    describe('SUCCESS: create company', () => {
      let response: request.Response;
      const title = 'newCom';

      beforeAll(async () => {
        response = await request(getApp().callback())
          .post('/api/companies/')
          .query('deviceId=123')
          .set('Cookie', setCookies)
          .send({
            title,
          });
      });

      test('Status 201', () => {
        expect(response.status).toEqual(201);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('title');
        expect(response.body.data).toHaveProperty('admin');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.id).toBe('string');
        expect(typeof response.body.data.title).toBe('string');
        expect(typeof response.body.data.admin).toBe('string');
      });

      test('correct value properties', () => {
        expect(response.body.data.id).toBe(title);
        expect(response.body.data.title).toBe(title);
        expect(response.body.data.admin).toBe(userName);
      });

      test('correct data length', () => {
        expect(Object.keys(response.body.data).length).toEqual(3);
      });
    });

    test('ERROR: company exists', async () => {
      const title = 'com';
      const response = await request(getApp().callback())
        .post(`/api/companies/`)
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          title,
        });
      expect(response.status).toEqual(409);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`a company (${title}) already exists`);
    });
  });

  describe('PATCH /api/companies/:id', () => {
    describe('SUCCESS: edit company', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .patch('/api/companies/com')
          .query('deviceId=123')
          .set('Cookie', setCookies)
          .send({
            title: 'COM',
          });
      });

      test('Status 200', () => {
        expect(response.status).toEqual(200);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('title');
        expect(response.body.data).toHaveProperty('admin');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.id).toBe('string');
        expect(typeof response.body.data.title).toBe('string');
        expect(typeof response.body.data.admin).toBe('string');
      });

      test('correct value properties', () => {
        expect(response.body.data.id).toBe('com');
        expect(response.body.data.admin).not.toBe('COM');
      });

      test('correct data length', () => {
        expect(Object.keys(response.body.data).length).toEqual(3);
      });
    });

    describe('SUCCESS: not edit id, admin', () => {
      let response: request.Response;
      const id = 'com';
      const title = 'com1';
      beforeAll(async () => {
        response = await request(getApp().callback())
          .patch(`/api/companies/${id}`)
          .query('deviceId=123')
          .set('Cookie', setCookies)
          .send({
            id: '123',
            title,
            admin: '1',
          });
      });

      test('Status 200', () => {
        expect(response.status).toEqual(200);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('title');
        expect(response.body.data).toHaveProperty('admin');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.id).toBe('string');
        expect(typeof response.body.data.title).toBe('string');
        expect(typeof response.body.data.admin).toBe('string');
      });

      test('correct value properties', () => {
        expect(response.body.data.id).toBe(id);
        expect(response.body.data.title).toBe(title);
        expect(response.body.data.admin).not.toBe('1');
      });

      test('correct data length', () => {
        expect(Object.keys(response.body.data).length).toEqual(3);
      });
    });

    test('ERROR: not such all parameters', async () => {
      const response = await request(getApp().callback())
        .patch('/api/companies/nimda')
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          title: undefined,
        });
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe('not such all parameters');
    });

    test('ERROR: no such company', async () => {
      const title = 'NIMDA';
      const response = await request(getApp().callback())
        .patch('/api/companies/nimda')
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          title,
        });
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe('no such company');
    });
  });

  describe('DELETE /api/companies/:id', () => {
    test('SUCCESS: delete user', async () => {
      const response = await request(getApp().callback())
        .delete('/api/companies/org')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(204);
    });

    test('ERROR: no such company', async () => {
      const response = await request(getApp().callback())
        .delete(`/api/companies/123`)
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`no such company`);
    });
  });
});
