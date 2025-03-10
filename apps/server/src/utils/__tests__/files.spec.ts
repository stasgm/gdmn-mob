/* eslint-disable import/first */

import { stat } from 'fs/promises';
import path from 'path';

jest.mock('../../services/dao/db', () => {
  const mockDb = {
    getDb: () => ({
      devices: { data: [{ uid: 'deviceUid', id: 'deviceId', name: 'deviceName' }] },
      users: {
        getNamedItem: (id: string) => (id === 'badProducerId' ? undefined : { id, name: 'UserName' }),
      },
      companies: {
        getNamedItem: (id: string) => (id === 'badcompanyId' ? undefined : { id, name: 'CompanyName' }),
      },
      appSystems: {
        findByField: (fieldName: string, value: string) =>
          value === 'badAppSystemName' ? undefined : { id: 'systemId', fieldName: value },
      },
    }),
  };

  return mockDb;
});

import { splitFilePath } from '../../services/fileUtils';
import { BYTES_PER_KB } from '../constants';

const dbPath = 'c:/DB/.DB';

jest.mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'),
  stat: jest.fn(),
}));

const fileStat = {
  size: 1024,
  birthtime: new Date('2024-02-22T12:00:00Z'),
  mtime: new Date('2024-02-22T14:30:00Z'),
};

const mockStat = stat as jest.Mock;

mockStat.mockImplementation((filename) => {
  if (filename.includes('errorCondition')) {
    throw new Error('Error: File name contains an error condition');
  }
  return Promise.resolve(fileStat);
});

describe('splitFilePath', () => {
  test('correct new message filePath with command', async () => {
    const fileName = 'messageId_from_producerId_to_consumerId_dev_deviceUid__get_user_settings.json';
    const folderPath = path.join(dbPath, 'db_companyId/gdmn-sales-representative/messages');
    const testFilePath = path.join(folderPath, fileName);

    await expect(splitFilePath(testFilePath)).resolves.toEqual({
      id: fileName,
      date: fileStat.birthtime.toString(),
      size: fileStat.size / BYTES_PER_KB,
      path: folderPath,
      mdate: fileStat.mtime.toString(),
      producer: { id: 'producerId', name: 'UserName' },
      consumer: { id: 'consumerId', name: 'UserName' },
      device: { id: 'deviceId', name: 'deviceName' },
      company: { id: 'companyId', name: 'CompanyName' },
      appSystem: { id: 'systemId', name: 'gdmn-sales-representative' },
      folder: 'messages',
    });
  });

  test('correct old message filePath without command', async () => {
    const fileName = 'messageId_from_producerId_to_consumerId_dev_deviceUid.json';
    const folderPath = path.join(dbPath, 'db_companyId/gdmn-sales-representative/messages');
    const testFilePath = path.join(folderPath, fileName);

    await expect(splitFilePath(testFilePath)).resolves.toEqual({
      id: fileName,
      date: fileStat.birthtime.toString(),
      size: fileStat.size / BYTES_PER_KB,
      path: folderPath,
      mdate: fileStat.mtime.toString(),
      producer: { id: 'producerId', name: 'UserName' },
      consumer: { id: 'consumerId', name: 'UserName' },
      device: { id: 'deviceId', name: 'deviceName' },
      company: { id: 'companyId', name: 'CompanyName' },
      appSystem: { id: 'systemId', name: 'gdmn-sales-representative' },
      folder: 'messages',
    });
  });

  test('correct deviceLog filePath', async () => {
    const fileName = 'from_producerId_dev_deviceUid.json';
    const folderPath = path.join(dbPath, 'db_companyId/gdmn-sales-representative/deviceLogs');
    const filePath = path.join(folderPath, fileName);

    await expect(splitFilePath(filePath)).resolves.toEqual({
      id: fileName,
      date: fileStat.birthtime.toString(),
      size: fileStat.size / BYTES_PER_KB,
      path: folderPath,
      mdate: fileStat.mtime.toString(),
      producer: { id: 'producerId', name: 'UserName' },
      consumer: undefined,
      device: { id: 'deviceId', name: 'deviceName' },
      company: { id: 'companyId', name: 'CompanyName' },
      appSystem: { id: 'systemId', name: 'gdmn-sales-representative' },
      folder: 'deviceLogs',
    });
  });

  test('deviceLog filePath with incorrect format', async () => {
    const fileName = 'from_producerId_de_deviceUid.json';
    const folderPath = path.join(dbPath, 'db_companyId/gdmn-sales-representative/deviceLogs');
    const filePath = path.join(folderPath, fileName);

    await expect(splitFilePath(filePath)).resolves.toEqual({
      id: fileName,
      date: fileStat.birthtime.toString(),
      size: fileStat.size / BYTES_PER_KB,
      path: folderPath,
      mdate: fileStat.mtime.toString(),
      producer: undefined,
      consumer: undefined,
      device: undefined,
      company: { id: 'companyId', name: 'CompanyName' },
      appSystem: { id: 'systemId', name: 'gdmn-sales-representative' },
      folder: 'deviceLogs',
    });
  });

  test('correct filePath (not message)', async () => {
    const fileName = 'testFile.json';
    const filePath = path.join(dbPath, 'testFile.json');

    await expect(splitFilePath(filePath)).resolves.toEqual({
      id: fileName,
      date: fileStat.birthtime.toString(),
      size: fileStat.size / BYTES_PER_KB,
      path: path.dirname(filePath),
      mdate: fileStat.mtime.toString(),
    });
  });

  test('filePath with incorrect producerId', async () => {
    const fileName = 'messageId_from_badProducerId_to_consumerId_dev_deviceUid.json';
    const folderPath = path.join(dbPath, 'db_companyId/gdmn-sales-representative/messages');
    const filePath = path.join(folderPath, fileName);
    await expect(splitFilePath(filePath)).resolves.toEqual({
      id: fileName,
      date: fileStat.birthtime.toString(),
      size: fileStat.size / BYTES_PER_KB,
      path: folderPath,
      mdate: fileStat.mtime.toString(),
      producer: undefined,
      consumer: { id: 'consumerId', name: 'UserName' },
      device: { id: 'deviceId', name: 'deviceName' },
      company: { id: 'companyId', name: 'CompanyName' },
      appSystem: { id: 'systemId', name: 'gdmn-sales-representative' },
      folder: 'messages',
    });
  });

  test('incorrect non-existent file', async () => {
    const fileName = 'errorCondition';
    const folderPath = path.join(dbPath, 'db_companyId/appSystemName/deviceLogs');
    const filePath = path.join(folderPath, fileName);

    await expect(splitFilePath(filePath)).rejects.toThrow(/Error/);
  });
});
