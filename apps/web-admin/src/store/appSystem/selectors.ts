import { IAppSystem } from '@lib/types';

import { useSelector } from '..';

const appSystemById = (id: string) => {
  return useSelector((state) => state.appSystems.list.find((d) => d.id === id));
};

const appSystemsByCompanyId = (companyId: string) => {
  return useSelector((state) => {
    const list = state.appSystems.list;
    return (
      state.companies.list
        .find((company) => company.id === companyId)
        ?.appSystems?.reduce((prev: IAppSystem[], cur) => {
          const appSystem = list.find((d) => d.id === cur.id);
          if (appSystem) {
            prev.push(appSystem);
          }
          return prev;
        }, []) || []
    );
  });
};

export default { appSystemById, appSystemsByCompanyId };
