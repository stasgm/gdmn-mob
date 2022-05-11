import { Context, ParameterizedContext } from 'koa';

import { ICompany, IUser, NewCompany } from '@lib/types';

import { companyService } from '../services';
import { created, ok } from '../utils/apiHelpers';
import { DataNotFoundException } from '../exceptions';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, city, appSystems, externalId } = ctx.request.body as NewCompany;

  const user = ctx.state.user as IUser;

  const newCompany = await companyService.addOne({
    name,
    admin: { id: user.id, name: user.name },
    externalId,
    city,
    appSystems,
  });

  created(ctx as Context, newCompany, `addCompany: company '${name}' is successfully created`);
};

const updateCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  //TODO редактировать только свои компании
  const companyData = ctx.request.body as Partial<ICompany>;

  const updatedCompany = await companyService.updateOne(companyId, companyData);

  ok(ctx as Context, updatedCompany, `updateCompany: company '${updatedCompany.id}' is successfully updated`);
};

const removeCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;
  //TODO удалить только свои компании
  await companyService.deleteOne(companyId);

  ok(ctx as Context, undefined, `removeCompany: company '${companyId}' is successfully removed`);
};

const getCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  const company = await companyService.findOne(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  ok(ctx as Context, company, `getCompany: company '${company.name}' is successfully received`);
};

const getCompanies = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, filterText, fromRecord, toRecord, adminId, name } = ctx.query;

  const params: Record<string, string> = {};

  if (companyId && typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (adminId && typeof adminId === 'string') {
    params.adminId = adminId;
  }

  if (typeof filterText === 'string') {
    params.filterText = filterText;
  }

  if (typeof fromRecord === 'string') {
    params.fromRecord = fromRecord;
  }

  if (typeof toRecord === 'string') {
    params.toRecord = toRecord;
  }

  if (name && typeof name === 'string') {
    params.name = name;
  }
  const companyList = await companyService.findAll(params);

  ok(ctx as Context, companyList, 'getCompanies: companies are successfully received');
};

export { addCompany, updateCompany, removeCompany, getCompany, getCompanies };
