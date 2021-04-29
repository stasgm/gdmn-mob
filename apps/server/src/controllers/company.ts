import { ParameterizedContext } from 'koa';

import { ICompany, IResponse, NewCompany } from '@lib/types';

import log from '../utils/logger';
import { companyService } from '../services';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, externalId } = ctx.request.body;

  const { id: userId } = ctx.state.user;

  if (!name) {
    ctx.throw(400, 'Не указано название компании');
  }

  const company: NewCompany = { name, adminId: userId, externalId };

  try {
    const newCompany = await companyService.addOne(company);

    const result: IResponse<ICompany> = { result: true, data: newCompany };

    ctx.status = 201;
    ctx.body = result;

    log.info('addCompany: OK');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const updateCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;
  const companyData = ctx.request.body as Partial<ICompany>;

  if (!companyId) {
    ctx.throw(400, 'не указан идентификатор организации');
  }

  if (!companyData) {
    ctx.throw(400, 'не указана информация об организации');
  }

  try {
    const updatedCompany = await companyService.updateOne(companyId, companyData);

    const result: IResponse<ICompany> = { result: true, data: updatedCompany };

    ctx.status = 200;
    ctx.body = result;

    log.info('updateCompany: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const removeCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  if (!companyId) {
    ctx.throw(400, 'не указан идентификатор организации');
  }

  try {
    await companyService.deleteOne(companyId);

    const result: IResponse = { result: true };

    ctx.status = 200;
    ctx.body = result; // TODO передавать только код 204 без body

    log.info('removeCompany: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const getCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  if (!companyId) {
    ctx.throw(400, 'не указан идентификатор организации');
  }

  try {
    const company = await companyService.findOne(companyId);

    if (!company) {
      ctx.throw(404, 'компания не найдена');
    }

    const result: IResponse<ICompany> = { result: true, data: company };

    ctx.status = 200;
    ctx.body = result;

    log.info('getCompany: ok');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

/* const getUsersByCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  if (!companyId) {
    ctx.throw(400, 'не указан идентификатор организации');
  }

  try {
    const userList = await companyService.findUsers(companyId);

    const result: IResponse<IUserProfile[]> = { result: true, data: userList };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUsersByCompany: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
}; */

const getCompanies = async (ctx: ParameterizedContext): Promise<void> => {
  try {
    console.log('controller getCompanies');
    const companyList = await companyService.findAll();

    const result: IResponse<ICompany[]> = { result: true, data: companyList };

    ctx.status = 200;
    ctx.body = result;

    log.info('getCompanies: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

export { addCompany, updateCompany, getCompany, getCompanies, removeCompany };
