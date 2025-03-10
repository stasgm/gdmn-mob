import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import { checkDateFormat } from '../utils';

import * as urlValidation from './url';

const addDeviceLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    type: 'json',
    body: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор организации')),
      appSystemId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор подсистемы')),
      deviceLog: Joi.array().items(
        Joi.object({
          name: Joi.string().required().error(new InvalidParameterException('Не указан наименование метода')),
          date: Joi.string().required().error(new InvalidParameterException('Не указана дата ошибки')),
          id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор')),
          message: Joi.string().required().error(new InvalidParameterException('Не указан текст ошибки')),
          processId: Joi.string().optional(),
        }),
      ),
      appVersion: Joi.string().optional(),
      appSettings: Joi.object().optional(),
    }),
  },
};

const deleteDeviceLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла лога ошибок')),
    }),
    query: Joi.object({
      ...urlValidation.checkURL,
      companyId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор организации')),
      appSystemId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор подсистемы')),
      folder: Joi.string().optional(),
    }),
  },
};

const deleteDeviceLogs: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    type: 'json',
    body: Joi.object({
      files: Joi.array().items(
        Joi.object({
          id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла')),
          companyId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор компании')),
          appSystemId: Joi.string()
            .required()
            .error(new InvalidParameterException('Не указан идентификатор подсистемы')),
          folder: Joi.string().optional(),
        }),
      ),
    }),
  },
};

const getDeviceLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла логов ошибок')),
    }),
    query: Joi.alternatives()
      .try(
        Joi.object({
          ...urlValidation.checkURL,
        }),
        Joi.object({
          ...urlValidation.checkURL,
          companyId: Joi.string().required(),
          appSystemId: Joi.string().required(),
          folder: Joi.string().optional(),
        }),
      )
      .error(
        new InvalidParameterException(
          'Некорректный формат параметров запроса. В параметрах должны быть указаны id компании и id системы',
        ),
      ),
  },
};

const getDeviceLogs: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    query: Joi.alternatives()
      .try(
        Joi.object({
          ...urlValidation.checkURL,
        }),
        Joi.object({
          ...urlValidation.checkURL,
          companyId: Joi.string()
            .required()
            .error(new InvalidParameterException('Не указано наименование организации')),
          appSystemId: Joi.string().optional(),
          folder: Joi.string().optional(),
          producerId: Joi.string().optional(),
          uid: Joi.string().optional(),
          deviceId: Joi.string().optional(),
          filterText: Joi.string().optional(),
          dateFrom: Joi.string().custom(checkDateFormat).optional(),
          dateTo: Joi.string().custom(checkDateFormat).optional(),
          mDateFrom: Joi.string().custom(checkDateFormat).optional(),
          mDateTo: Joi.string().custom(checkDateFormat).optional(),
          searchQuery: Joi.string().optional(),
          fromRecord: Joi.number().optional(),
          toRecord: Joi.number().optional(),
        }),
      )
      .error(new InvalidParameterException('Некорректный формат параметров запроса')),
  },
};

export { addDeviceLog, deleteDeviceLog, getDeviceLog, deleteDeviceLogs, getDeviceLogs };
