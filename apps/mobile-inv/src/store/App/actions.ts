/* eslint-disable @typescript-eslint/no-explicit-any */
import { IHead, ILine, IDocument, IReference } from '../../../../common';
import { IModel, IViewParam } from '../../../../common/base';
import { IAppSettings, ICompanySettings, IForms, IViewParams } from '../../model/types';
import { createActionPayload, ActionsUnion, createAction } from '../utils';

// eslint-disable-next-line no-shadow
export enum ActionAppTypes {
  ADD_DOCUMENT = 'ADD_DOCUMENT',
  UPDATE_DOCUMENT_HEAD = 'UPDATE_DOCUMENT_HEAD',
  UPDATE_DOCUMENT_STATUS = 'UPDATE_DOCUMENT_STATUS',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
  DELETE_ALL_DOCUMENTS = 'DELETE_ALL_DOCUMENTS',
  DOCUMENT_ADD_LINE = 'DOCUMENT_ADD_LINE',
  DOCUMENT_DELETE_LINE = 'DOCUMENT_DELETE_LINE',
  DOCUMENT_UPDATE_LINE = 'DOCUMENT_UPDATE_LINE',
  SET_SETTINGS = 'SET_SETTINGS',
  SET_COMPANY_SETTINGS = 'SET_COMPANY_SETTINGS',
  SET_REFERENCE = 'SET_REFERENCE',
  SET_REFERENCES = 'SET_REFERENCES',
  SET_DOCUMENTS = 'SET_DOCUMENTS',
  SET_FORM = 'SET_FORM',
  CLEAR_FORM = 'CLEAR_FORM',
  SET_MODEL = 'SET_MODEL',
  SET_MODELS = 'SET_MODELS',
  SET_VIEWPARAM = 'SET_VIEWPARAM',
  SET_VIEWPARAMS = 'SET_VIEWPARAM',
  CLEAR_VIEWPARAM = 'CLEAR_VIEWPARAM',
}

export const AppActions = {
  addDocument: createActionPayload<ActionAppTypes.ADD_DOCUMENT, IDocument>(ActionAppTypes.ADD_DOCUMENT),
  updateDocument: createActionPayload<ActionAppTypes.UPDATE_DOCUMENT_HEAD, { id: number; head: IHead }>(
    ActionAppTypes.UPDATE_DOCUMENT_HEAD,
  ),
  updateDocumentStatus: createActionPayload<ActionAppTypes.UPDATE_DOCUMENT_STATUS, { id: number; status: number }>(
    ActionAppTypes.UPDATE_DOCUMENT_STATUS,
  ),
  deleteDocument: createActionPayload<ActionAppTypes.DELETE_DOCUMENT, number>(ActionAppTypes.DELETE_DOCUMENT),
  deleteAllDocuments: createAction<ActionAppTypes.DELETE_ALL_DOCUMENTS>(ActionAppTypes.DELETE_ALL_DOCUMENTS),
  addLine: createActionPayload<ActionAppTypes.DOCUMENT_ADD_LINE, { docId: number; line: ILine }>(
    ActionAppTypes.DOCUMENT_ADD_LINE,
  ),
  deleteLine: createActionPayload<ActionAppTypes.DOCUMENT_DELETE_LINE, { docId: number; lineId: number }>(
    ActionAppTypes.DOCUMENT_DELETE_LINE,
  ),
  editLine: createActionPayload<ActionAppTypes.DOCUMENT_UPDATE_LINE, { docId: number; line: ILine }>(
    ActionAppTypes.DOCUMENT_UPDATE_LINE,
  ),
  setSettings: createActionPayload<ActionAppTypes.SET_SETTINGS, IAppSettings>(ActionAppTypes.SET_SETTINGS),
  setCompanySettings: createActionPayload<ActionAppTypes.SET_COMPANY_SETTINGS, ICompanySettings>(
    ActionAppTypes.SET_COMPANY_SETTINGS,
  ),
  setReference: createActionPayload<ActionAppTypes.SET_REFERENCE, IReference<any>>(ActionAppTypes.SET_REFERENCE),
  setReferences: createActionPayload<ActionAppTypes.SET_REFERENCES, { [name: string]: IReference }>(
    ActionAppTypes.SET_REFERENCES,
  ),
  setModel: createActionPayload<ActionAppTypes.SET_MODEL, IModel<any>>(ActionAppTypes.SET_MODEL),
  setModels: createActionPayload<ActionAppTypes.SET_MODELS, { [name: string]: IModel }>(ActionAppTypes.SET_MODELS),
  setDocuments: createActionPayload<ActionAppTypes.SET_DOCUMENTS, IDocument[]>(ActionAppTypes.SET_DOCUMENTS),
  setForm: createActionPayload<ActionAppTypes.SET_FORM, IForms>(ActionAppTypes.SET_FORM),
  clearForm: createActionPayload<ActionAppTypes.CLEAR_FORM, string>(ActionAppTypes.CLEAR_FORM),
  setViewParam: createActionPayload<ActionAppTypes.SET_VIEWPARAM, IViewParams>(ActionAppTypes.SET_VIEWPARAM),
  setViewParams: createActionPayload<ActionAppTypes.SET_VIEWPARAMS, { [name: string]: IViewParam }>(
    ActionAppTypes.SET_VIEWPARAMS,
  ),
};

export type TAppActions = ActionsUnion<typeof AppActions>;
