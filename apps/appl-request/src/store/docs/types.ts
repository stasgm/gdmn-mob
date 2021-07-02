import { INamedEntity, IEntity, IDocument, MandateProps, IHead, IReferenceData } from '@lib/types';

//Организации
export interface IContact extends INamedEntity, IReferenceData {
  contractNumber: string; // Номер договора
  contractDate: string; // Дата договора
  paycond: string; // Условие оплаты
  phoneNumber: string; // Номер телефона
}

/*
 Дата заявки
 Номер заявки
 -----------
 *Статус заявки INamedEntity - applStatus
 *Признак INamedEntity - purpose
 *Подразделение  INamedEntity - dept
 *Тип закупки INamedEntity - purchaseType
 Дата принятия на проверку Date  - verificationDate
 --
 Объект ВДА INamedEntity - vdaGood
 Объект учёта ОС INamedEntity - faGood
 Инвентарный номер ОС string - faGoodNumber
 ----
 Системный заявитель INamedEntity (с должностью) - sysApplicant
 Заявитель INamedEntity (с должностью) - applicant
 Специалист предварительно согласовавший заявку INamedEntity (с должностью) - specPreAgree
 Специалист согласовавший со стороны инженерной службы заявку INamedEntity (с должностью) - specAgreeEngin
 ----------
 Обоснование необходимости закупки string - justification
 Причина отказа всей заявки string - cancelReason
 Примечание string - note
*/

export interface IApplHead extends IHead {
  applStatus: INamedEntity;
  purpose: INamedEntity;
  dept: INamedEntity;
  purchaseType: INamedEntity;
  verificationDate?: Date;
  vdaGood?: INamedEntity;
  faGood?: INamedEntity;
  faGoodNumber?: string;
  sysApplicant?: INamedEntity;
  applicant?: INamedEntity;
  specPreAgree?: INamedEntity;
  specAgreeEngin?: INamedEntity;
  justification?: string;
  cancelReason?: string;
  note?: string;
}

/*
  Порядковый номер number - orderNum
  Наименование позиции string - goodName
  Кол-во по заявке - quantity
*/
export interface IApplLine extends IEntity {
  orderNum: number;
  goodName: string;
  quantity: number;
}

export type IApplDocument = MandateProps<IDocument<IApplHead, IApplLine[]>, 'head' | 'lines'>;
