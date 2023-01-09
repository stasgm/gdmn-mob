import { INamedEntity, IEntity, IDocument, MandateProps, IHead } from '@lib/types';

/*
 Сотрудники
*/
interface IEmployee extends INamedEntity {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  position: INamedEntity;
}

/*
 Свойства документа (шапка)
 ---
 Дата заявки
 Номер заявки
 -
 *Статус заявки INamedEntity - applStatus
 *Признак INamedEntity - purpose
 *Подразделение  INamedEntity - dept
 *Тип закупки INamedEntity - purchaseType
 Дата принятия на проверку Date  - verificationDate
 -
 Объект ВДА INamedEntity - vdaGood
 Объект учёта ОС INamedEntity - faGood
 Инвентарный номер ОС string - faGoodNumber
 -
 Системный заявитель INamedEntity (с должностью) - sysApplicant
 Заявитель INamedEntity (с должностью) - applicant
 Специалист предварительно согласовавший заявку INamedEntity (с должностью) - specPreAgree
 Специалист согласовавший со стороны инженерной службы заявку INamedEntity (с должностью) - specAgreeEngin
-
 Кто разрешил INamedEntity - specApprove
 Кто отклонил INamedEntity - specCancel
 -
 Обоснование необходимости закупки string - justification
 Причина отказа всей заявки string - cancelReason
 Примечание string - note
*/

interface IApplHead extends IHead {
  applStatus: INamedEntity;
  purpose: INamedEntity;
  headCompany: INamedEntity;
  dept: INamedEntity;
  purchaseType: INamedEntity;
  verificationDate?: string;
  vdaGood?: INamedEntity;
  faGood?: INamedEntity;
  faGoodNumber?: string;
  sysApplicant?: INamedEntity;
  applicant?: INamedEntity;
  specPreAgree?: INamedEntity;
  specAgreeEngin?: INamedEntity;
  justification?: string;
  cancelReason?: string;
  specApprove?: INamedEntity;
  specCancel?: INamedEntity;
  note?: string;
}

/*
  Свойства позиций документа
  ---
  Порядковый номер number - orderNum
  Наименование позиции string - goodName
  Кол-во по заявке - quantity
*/
interface IApplLine extends IEntity {
  orderNum: number;
  goodName: string;
  quantity: number;
  value: INamedEntity;
}

type IApplDocument = MandateProps<IDocument<IApplHead, IApplLine>, 'head' | 'lines'>;

export { IEmployee, IApplDocument, IApplLine, IApplHead };
