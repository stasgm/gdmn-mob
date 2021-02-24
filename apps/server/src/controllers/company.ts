import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { ICompany, IResponse, IUserProfile } from '../../../common';
import { companyService } from '../services';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { title, externalId } = ctx.request.body;

  const { id: userId } = ctx.state.user;

  if (!title) {
    ctx.throw(400, 'не указано название организации');
  }

  const company: ICompany = { id: title, title, admin: userId, externalId };

  try {
    const companyId = await companyService.addOne({ ...company, admin: userId });

    const result: IResponse<string> = { result: true, data: companyId };

    ctx.status = 201;
    ctx.body = result;

    log.info(`addCompany: OK`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  if (!companyId) {
    ctx.throw(400, 'не указан идентификатор организации');
  }

  try {
    const company = await companyService.findOne(companyId);

    const result: IResponse<ICompany> = { result: true, data: company };

    ctx.status = 200;
    ctx.body = result;

    log.info(`getCompany: ok`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const updateCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;
  const company = ctx.request.body as Partial<ICompany>;

  if (!companyId) {
    ctx.throw(400, 'не указан идентификатор организации');
  }

  if (!company) {
    ctx.throw(400, 'не указана информация об организации');
  }

  const oldCompany: ICompany | undefined = await companyService.findOne(companyId); //companies.find(company.id);

  /*if (!oldCompany) {
    oldCompany = await companyService.findOneByName(company.title);
  }*/

  if (!oldCompany) {
    ctx.throw(400, 'организация не найдена');
  }

  // Удаляем поля которые нельзя перезаписывать
  //company.admin = undefined;

  try {
    const id = await companyService.updateOne({ ...oldCompany, ...company, id: companyId });
    const result: IResponse<string> = { result: true, data: id };

    ctx.status = 200;
    ctx.body = result;

    log.info('updateCompany: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const getUsersByCompany = async (ctx: ParameterizedContext): Promise<void> => {
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
};

const getCompanies = async (ctx: ParameterizedContext): Promise<void> => {
  try {
    const companyList = await companyService.findAll();

    const result: IResponse<ICompany[]> = { result: true, data: companyList };

    ctx.status = 200;
    ctx.body = result;

    log.info('getCompanies: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const deleteCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  if (!companyId) {
    ctx.throw(400, 'не указан идентификатор организации');
  }

  try {
    await companyService.deleteOne(companyId);

    const result: IResponse<void> = { result: true };

    ctx.status = 200;
    ctx.body = result; //TODO передавать только код 204 без body

    log.info('deleteCompany: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

export { addCompany, updateCompany, getCompany, getUsersByCompany, getCompanies, deleteCompany };
