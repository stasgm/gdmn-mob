import { Context, ParameterizedContext } from 'koa';

import { ICompany, NewCompany } from '@lib/types';

import log from '../utils/logger';
import { companyService } from '../services';
import { created, ok } from '../utils/apiHelpers';
import { DataNotFoundException, ForbiddenException } from '../exceptions';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  //TODO только для админа или суперадмина
  const { name, externalId } = ctx.request.body;

  const { id: userId, role } = ctx.state.user;

  if (role !== 'Admin' && role !== 'SuperAdmin') {
    throw new ForbiddenException('Нет прав для создания компании');
  }

  const company: NewCompany = { name, adminId: userId, externalId };

  const newCompany = await companyService.addOne(company);

  created(ctx as Context, newCompany);

  log.info(`addCompany: company '${name}' is successfully created`);
};

const updateCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  //TODO редактировать только свои компании
  const companyData = ctx.request.body as Partial<ICompany>;

  const updatedCompany = await companyService.updateOne(companyId, companyData);

  ok(ctx as Context, updatedCompany);

  log.info(`updateCompany: company '${updatedCompany.id}' is successfully updated`);
};

const removeCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;
  //TODO удалить только свои компании
  const res = await companyService.deleteOne(companyId);

  ok(ctx as Context, res);

  log.info(`removeCompany: company '${companyId}' is successfully removed`);
};

const getCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  const company = await companyService.findOne(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  ok(ctx as Context, company);

  log.info(`getCompany: company '${company.name}' is successfully received`);
};

const getCompanies = async (ctx: ParameterizedContext): Promise<void> => {
  const { name } = ctx.params;

  const params: Record<string, string> = {};

  const { id: adminId } = ctx.state.user;

  if (typeof adminId === 'string') {
    params.adminId = adminId;
  }

  if (typeof name === 'string') {
    params.name = name;
  }

  const companyList = await companyService.findAll(params);

  ok(ctx as Context, companyList);

  log.info('getCompanies: companies are successfully received');
};

export { addCompany, updateCompany, removeCompany, getCompany, getCompanies };
