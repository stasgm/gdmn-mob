// import { readFile } from '../utils/workWithFile';
// import dev from '../../config/dev';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
// import { IGood, IContact, IDocument, IRemain, IResponse, IRefData } from '../../../common';

/* const PATH_GOODS = `${dev.FILES_PATH}\\Goods.json`;
const PATH_DOCUMENT_TYPE = `${dev.FILES_PATH}\\GD_DocumentType.json`;
const PATH_CONTACT = `${dev.FILES_PATH}\\GD_Contact.json`;
const PATH_DOCUMENT = `${dev.FILES_PATH}\\Document.json`;
const PATH_REMAINS = `${dev.FILES_PATH}\\Remains.json`; */

/* interface IAllData {
  goods?: IGood[];
  remains?: IRemain[];
  documenttypes?: IRefData[];
  contacts?: IContact[];
  docs?: IDocument[];
} */

const getAllData = (ctx: ParameterizedContext) => {
  /*   const goods: IGood[] | undefined = await readFile(PATH_GOODS);
  const documenttypes: IRefData[] | undefined = await readFile(PATH_DOCUMENT_TYPE);
  const contacts: IContact[] | undefined = await readFile(PATH_CONTACT);
  const docs: IDocument[] | undefined = await readFile(PATH_DOCUMENT);
  const remains: IRemain[] | undefined = await readFile(PATH_REMAINS);
  const result: IResponse<IAllData> = { result: true, data: { goods, remains, documenttypes, contacts, docs } }; */
  ctx.status = 200;
  ctx.body = { result: 'ok' };
  log.info('get all data');
};

export { getAllData };
