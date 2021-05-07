import { ParameterizedContext } from 'koa';

import { ICompany, IResponse, NewCompany } from '@lib/types';

import log from '../utils/logger';
import { companyService } from '../services';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, externalId } = ctx.request.body;

  if (!name) {
    ctx.throw(400, 'Не указано название компании');
  }

  const { id: userId } = ctx.state.user;

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

const getCompanies = async (ctx: ParameterizedContext): Promise<void> => {
  const params: Record<string, string> = {};

  const { id: adminId } = ctx.state.user;

  params.adminId = adminId;

  try {
    const companyList = await companyService.findAll(params);

    const result: IResponse<ICompany[]> = { result: true, data: companyList };

    ctx.status = 200;
    ctx.body = result;

    log.info('getCompanies: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

export { addCompany, updateCompany, removeCompany, getCompany, getCompanies };
