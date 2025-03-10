import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import { checkDateFormat } from '../utils/helpers';

import * as urlValidation from './url';

const invalidRequestBodyErrorMessage =
  'Некорректный формат запроса. Body должно содержать или массив идентификаторов файлов ' +
  'или массив объектов с идентификаторами файлов, компанией, системой и папкой';

const getFolders: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    query: Joi.object({
      ...urlValidation.checkURL,
      companyId: Joi.string().optional(),
      appSystemId: Joi.string().optional(),
    }),
  },
};

const getFiles: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    query: Joi.alternatives()
      .try(
        Joi.object({
          ...urlValidation.checkURL,
          fileName: Joi.string().optional(),
          filterText: Joi.string().optional(),
          dateFrom: Joi.string().custom(checkDateFormat).optional(),
          dateTo: Joi.string().custom(checkDateFormat).optional(),
          mDateFrom: Joi.string().custom(checkDateFormat).optional(),
          mDateTo: Joi.string().custom(checkDateFormat).optional(),
          searchQuery: Joi.string().optional(),
          fromRecord: Joi.number().optional(),
          toRecord: Joi.number().optional(),
        }),
        Joi.object({
          ...urlValidation.checkURL,
          companyId: Joi.string()
            .required()
            .error(new InvalidParameterException('Не указано наименование организации')),
          appSystemId: Joi.string().optional(),
          folder: Joi.string().optional(),
          fileName: Joi.string().optional(),
          producerId: Joi.string().optional(),
          consumerId: Joi.string().optional(),
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

const getFile: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла')),
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
          'Некорректный формат параметров запроса. В параметрах должны быть указаны id компании, id системы и папка',
        ),
      ),
  },
};

const updateFile: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла')),
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
          'Некорректный формат параметров запроса. В параметрах должны быть указаны id компании, id системы и папка',
        ),
      ),
    type: 'json',
    body: Joi.alternatives()
      .try(Joi.object(), Joi.array(), Joi.string())
      .required()
      .error(new InvalidParameterException('Некорректный формат содержимого файла')),
  },
};

const deleteFile: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла')),
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
          folder: Joi.string().required(),
        }),
      )
      .error(new InvalidParameterException(invalidRequestBodyErrorMessage)),
  },
};

const deleteFiles: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    type: 'json',
    body: Joi.alternatives()
      .try(
        Joi.object({
          files: Joi.array().items(
            Joi.object({
              id: Joi.string().required(),
            }),
          ),
        }),
        Joi.object({
          files: Joi.array().items(
            Joi.object({
              id: Joi.string().required(),
              companyId: Joi.string().required(),
              appSystemId: Joi.string().required(),
              folder: Joi.string().required(),
            }),
          ),
        }),
      )
      .error(new InvalidParameterException(invalidRequestBodyErrorMessage)),
  },
};

const moveFiles: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    type: 'json',
    body: Joi.alternatives()
      .try(
        Joi.object({
          files: Joi.array().items(
            Joi.object({
              id: Joi.string().required(),
            }),
          ),
          toFolder: Joi.string().required(),
        }),
        Joi.object({
          files: Joi.array().items(
            Joi.object({
              id: Joi.string().required(),
              companyId: Joi.string().required(),
              appSystemId: Joi.string().required(),
              folder: Joi.string().required(),
            }),
          ),
          toFolder: Joi.string().required(),
        }),
      )
      .error(new InvalidParameterException(invalidRequestBodyErrorMessage)),
  },
};

export { getFolders, getFiles, getFile, updateFile, deleteFile, deleteFiles, moveFiles };
