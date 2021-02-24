import { ICompany } from '../../../common';
import { companies, users } from './dao/db';
import { userService } from '.';
import { IUserProfile } from '../../../common/models';
import { makeProfile } from '../controllers/user';

/**
 * Добавление новой организации
 * @param {string} title - наименование организации
 * @return id, идентификатор организации
 * */
const addOne = async (company: ICompany): Promise<string> => {
  /*
    1. Проверяем что организация существует
    2. Добавляем организацию
    3. К текущему пользователю записываем созданную организацию
    4. К администратору добавляем созданную организацию
  */
  if (await companies.find(el => el.title === company.title)) {
    throw new Error('организация уже существует');
  }
  const id = await companies.insert(company);

  await userService.addCompanyToUser(company.admin, company.title);

  const userId = await users.find(i => i.userName === 'gdmn');

  if (userId.id) {
    await userService.addCompanyToUser(userId.id, company.title);
  }

  return id;
};

/**
 * Возвращает одну организацию
 * @param {string} id - идентификатор организации
 * @return company, организация
 * */
const findOne = async (id: string): Promise<ICompany> => {
  const company = await companies.find(id);

  if (!company) {
    throw new Error('организация не найдена');
  }

  return company;
};

/**
 * Возвращает одну организацию
 * @param {string} name - наименование организации
 * @return company, организация
 * */
const findOneByName = async (name: string): Promise<ICompany> => {
  const company = await companies.find(i => i.title === name);

  if (!company) {
    throw new Error('организация не найдена');
  }

  return company;
};

/**
 * Возвращает все органиции
 * @param {string} id - идентификатор организации
 * @return company, организация
 * */
const findAll = async (): Promise<ICompany[]> => {
  return companies.read();
};

/**
 * Обновляет одну организацию
 * @param {ICompany} company - организациия
 * @return id, идентификатор организации
 * */
const updateOne = async (company: ICompany): Promise<string> => {
  await companies.update(company);

  return company.id;
};

/**
 * Удаляет одну организацию
 * @param {string} id - идентификатор организации
 * */
const deleteOne = async (company: ICompany): Promise<void> => {
  /*
    1. Проверяем что организация существует
    2. Удаляем у пользователей организацию //TODO
    3. Удаляем организацию
  */
  if (!(await companies.find(company.id))) {
    throw new Error('организация не найдена');
  }

  await companies.delete(company.id);
};

/**
 * Возвращает пользователей организации
 * @param {string} id - идентификатор организации
 * @return users, пользователи
 * */
const findUsers = async (id: string): Promise<IUserProfile[]> => {
  const company = await companies.find(id);

  if (!company) {
    throw new Error('организация не найдена');
  }

  // TODO заменить на company.title на companyId
  return (await users.read()).filter(el => el.companies?.some(i => i === company.title)).map(el => makeProfile(el));
};

export { findOne, findAll, addOne, updateOne, deleteOne, findUsers, findOneByName };
