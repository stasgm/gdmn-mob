/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { getApp } from './_test-environment';

describe('testing /api/messages/', () => {
  let setCookies: string[] = [];
  const userName = 'admin';

  beforeAll(async () => {
    const resLogin = await request(getApp().callback()).post('/api/auth/login').query('deviceId=123').send({
      userName,
      password: 'admin',
    });
    setCookies = resLogin.header['set-cookie'];
  });

  describe('GET /api/messages/', () => {
    describe('SUCCESS: get all messages', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(getApp().callback())
          .get('/api/messages/org')
          .query('deviceId=123')
          .set('Cookie', setCookies);
      });

      test('Status 200', () => {
        expect(response.status).toEqual(200);
      });

      test('correct structure message', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        if (response.body.data[0]) {
          expect(response.body.data[0]).toHaveProperty('head');
          expect(response.body.data[0]).toHaveProperty('body');
        }
      });

      test('correct structure head in message', () => {
        if (response.body.data[0]) {
          expect(response.body.data[0].head).toBeDefined();
          expect(response.body.data[0].head).toHaveProperty('id');
          expect(response.body.data[0].head).toHaveProperty('producer');
          expect(response.body.data[0].head).toHaveProperty('consumer');
          expect(response.body.data[0].head).toHaveProperty('dateTime');
        }
      });

      test('correct structure body in message', () => {
        if (response.body.data[0]) {
          expect(response.body.data[0].body).toBeDefined();
          expect(response.body.data[0].body).toHaveProperty('type');
          expect(response.body.data[0].body).toHaveProperty('payload');
          expect(response.body.data[0].body.payload).toBeDefined();
          expect(response.body.data[0].body).toHaveProperty('name');
          expect(response.body.data[0].body).toHaveProperty('params');
        }
      });

      test('correct type data', () => {
        if (response.body.data[0]) {
          expect(typeof response.body.data[0].head.id).toBe('string');
          expect(typeof response.body.data[0].head.producer).toBe('string');
          expect(typeof response.body.data[0].head.consumer).toBe('string');
          expect(typeof response.body.data[0].head.dateTime).toBe('string');
          expect(typeof response.body.data[0].body.type).toBe('string');
          expect(typeof response.body.data[0].body.payload.name).toBe('string');
          expect(Array.isArray(response.body.data[0].body.payload.params)).toBe(true);
          if (response.body.data[0].body.payload.params[0]) {
            expect(typeof response.body.data[0].body.payload.params[0]).toBe('string');
          }
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

    test('ERROR: message exists', async () => {
      const response = await request(getApp().callback())
        .get('/api/messages/orgCom')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(404);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe('file or directory not found');
    });
  });

  describe('POST /api/messages/', () => {
    describe('SUCCESS: create message', () => {
      let response: request.Response;

      beforeAll(async () => {
        response = await request(getApp().callback())
          .post('/api/messages/')
          .query('deviceId=123')
          .set('Cookie', setCookies)
          .send({
            head: {
              consumer: 'gdmn',
              companyId: 'com',
            },
            body: {
              type: 'cmd',
              payload: {
                name: 'get_references',
                params: ['documenttypes', 'goodgroups', 'goods', 'remains', 'contacts'],
              },
            },
          });
      });

      test('Status 201', () => {
        expect(response.status).toEqual(201);
      });

      test('correct structure body', () => {
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toHaveProperty('uid');
        expect(response.body.data).toHaveProperty('date');
      });

      test('correct type data', () => {
        expect(typeof response.body.data.uid).toBe('string');
        expect(typeof response.body.data.date).toBe('string');
      });
    });

    test('ERROR: The User does not belong to the Company', async () => {
      const companyId = 'fir';
      const response = await request(getApp().callback())
        .post(`/api/messages/`)
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          head: {
            consumer: 'gdmn',
            companyId,
          },
          body: {
            type: 'cmd',
            payload: {
              name: 'get_references',
              params: ['documenttypes', 'goodgroups', 'goods', 'remains', 'contacts'],
            },
          },
        });
      expect(response.status).toEqual(403);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`The User (${userName}) does not belong to the Company (${companyId})`);
    });

    test('ERROR: incorrect format message', async () => {
      const response = await request(getApp().callback())
        .post(`/api/messages/`)
        .query('deviceId=123')
        .set('Cookie', setCookies)
        .send({
          head: {
            consumer: 'gdmn',
            companyId: 'com',
          },
        });
      expect(response.status).toEqual(400);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe('incorrect format message');
    });
  });

  describe('DELETE /api/messages/:id', () => {
    test('SUCCESS: delete user', async () => {
      const response = await request(getApp().callback())
        .delete('/api/messages/com/4945c0bf-0436-46ad-a9c2-669cc33330a9')
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(204);
    });

    test('ERROR: could not delete file', async () => {
      const response = await request(getApp().callback())
        .delete(`/api/messages/comORG/4945c0bf-0436-46ad-a9c2-669cc33330a9`)
        .query('deviceId=123')
        .set('Cookie', setCookies);
      expect(response.status).toEqual(422);
      expect(response.body.result).toBeFalsy();
      expect(response.body.error).toBe(`could not delete file`);
    });
  });
});
