import { Context, ParameterizedContext } from 'koa';

import { ICompany, NewCompany } from '@lib/types';

import log from '../utils/logger';
import { companyService } from '../services';
import { created, ok } from '../utils/apiHelpers';
import { DataNotFoundException } from '../exceptions';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, externalId } = ctx.body as NewCompany;

  const { id: userId } = ctx.state.user;

  const company: NewCompany = { name, adminId: userId, externalId };

  const newCompany = await companyService.addOne(company);

  created(ctx as Context, newCompany);

  log.info(`addCompany: company '${name}' is successfully created`);
};

const updateCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;
  console.log(1, companyId);

  const companyData = ctx.body as Partial<ICompany>;

  console.log(2, companyData);

  const updatedCompany = await companyService.updateOne(companyId, companyData);

  console.log(3, updatedCompany);

  ok(ctx as Context, updatedCompany);

  log.info(`updateCompany: company '${updatedCompany.id}' is successfully updated`);
};

const removeCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

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
  const params: Record<string, string> = {};

  const { id: adminId } = ctx.state.user;

  params.adminId = adminId;

  const companyList = await companyService.findAll(params);

  ok(ctx as Context, companyList);

  log.info('getCompanies: companies are successfully received');
};

export { addCompany, updateCompany, removeCompany, getCompany, getCompanies };
