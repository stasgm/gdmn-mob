import Datastore from 'nedb';

export const remove = (db: Datastore<any>, query: any, multi = true): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.remove(query, { multi }, (err: Error | null, num: number) => {
      rejectOrResolve(reject, err, resolve, num);
    });
  });
};

export const findOne = (db: Datastore<any>, query: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.findOne(query, (err: Error | null, item: any) => {
      rejectOrResolve(reject, err, resolve, item);
    });
  });
};

export const insert = (db: Datastore<any>, item: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.insert(item, (err: any) => {
      if (err) {
        if (err.errorType == 'uniqueViolated') {
          db.update({ _id: item._id }, item, {}, (err1) => {
            rejectOrResolve(reject, err1, resolve, 'replace');
          });
        } else {
          reject(err);
        }
      } else {
        resolve('insert');
      }
    });
  });
};

const rejectOrResolve = (reject: any, err: Error | any, resolve?: any, res?: any) => {
  if (err instanceof Error) {
    reject(err);
  } else if (resolve) {
    resolve(res);
  }
};
