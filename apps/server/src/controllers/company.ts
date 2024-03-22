import { Context, ParameterizedContext } from 'koa';

import { ICompany, IUser, NewCompany } from '@lib/types';

import { companyService } from '../services';
import { created, ok, prepareParams } from '../utils';
import { DataNotFoundException } from '../exceptions';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, city, appSystems, externalId, admin } = ctx.request.body as NewCompany;

  const user = ctx.state.user as IUser;

  const newCompany = companyService.addOne({
    name,
    admin: admin ? admin : { id: user.id, name: user.name },
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

  const updatedCompany = companyService.updateOne(companyId, companyData);

  ok(ctx as Context, updatedCompany, `updateCompany: company '${updatedCompany.id}' is successfully updated`);
};

const removeCompany = (ctx: ParameterizedContext): void => {
  const { id: companyId } = ctx.params;
  //TODO удалить только свои компании
  companyService.deleteOne(companyId);

  ok(ctx as Context, undefined, `removeCompany: company '${companyId}' is successfully removed`);
};

const getCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  const company = companyService.findOne(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  ok(ctx as Context, company, `getCompany: company '${company.name}' is successfully received`);
};

const getCompanies = async (ctx: ParameterizedContext): Promise<void> => {
  const params = prepareParams(ctx.query, ['companyId', 'adminId', 'name', 'filterText'], ['fromRecord', 'toRecord']);

  const companyList = companyService.findMany(params);

  ok(ctx as Context, companyList, 'getCompanies: companies are successfully received');
};

export { addCompany, updateCompany, removeCompany, getCompany, getCompanies };
