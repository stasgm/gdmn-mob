import React, { useEffect } from 'react';

import { IContact, IDocument, IGood, IRemains } from '../../../../common';
import { IMDGoodRemain, IModel, IModelData } from '../../../../common/base';
import config from '../../config';
import { rlog } from '../../helpers/log';
import { appStorage, getRemainsModel } from '../../helpers/utils';
import {
  IAppContextProps,
  IAppState,
  IAppSettings,
  IReferences,
  ICompanySettings,
  IViewParams,
} from '../../model/types';
import { useStore as useServiceStore } from '../Service/store';
import { useTypesafeActions } from '../utils';
import { AppActions } from './actions';
import { middleware } from './middleware';
import { reducer, initialState } from './reducer';

const defaultAppState: IAppContextProps = {
  state: initialState,
  actions: AppActions,
};

const sections = {
  SETTINGS: 'SETTINGS',
  COMPANYSETTINGS: 'COMPANYSETTINGS',
  REFERENCES: 'REFERENCES',
  DOCUMENTS: 'DOCUMENTS',
  MODELS: 'MODELS',
  VIEWPARAMS: 'VIEWPARAMS',
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IAppContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    const {
      state: { storagePath, isLoading },
      actions: { setLoading },
    } = useServiceStore();

    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        const storageSettings: IAppSettings = await appStorage.getItem(`${storagePath}/${sections.SETTINGS}`);
        actions.setSettings(storageSettings);
        // настройки компании
        const storageCompanySettings: ICompanySettings = await appStorage.getItem(
          `${storagePath}/${sections.COMPANYSETTINGS}`,
        );
        const weightSettings = storageCompanySettings?.weightSettings ?? config.system[0].weightSettings;
        actions.setCompanySettings(
          storageCompanySettings
            ? {
                ...storageCompanySettings,
                weightSettings,
              }
            : { weightSettings },
        );
        // Справочники
        const references = (await appStorage.getItem(`${storagePath}/${sections.REFERENCES}`)) as IReferences;
        actions.setReferences(references);

        if (references?.contacts?.data && references?.goods?.data) {

          const remainsModel: IModel<IModelData<IMDGoodRemain>> = await getRemainsModel(
            references?.contacts?.data as IContact[],
            references?.goods?.data as IGood[],
            (references?.remains?.data as unknown) as IRemains[],
          );
          rlog('getRemainsModel', 'Окончание построения модели');
          actions.setModel(remainsModel);
        }
        // документы
        const documents = (await appStorage.getItem(`${storagePath}/${sections.DOCUMENTS}`)) as IDocument[];
        actions.setDocuments(documents);

        // viewParams
        const viewParams = (await appStorage.getItem(`${storagePath}/${sections.VIEWPARAMS}`)) as IViewParams;
        actions.setViewParams(viewParams);

        setLoading(false);
      };

      if (storagePath) {
        loadData();
      }
    }, [actions, setLoading, storagePath]);

    /*  Сохранение справочников в storage при их изменении */
    useEffect(() => {
      const saveReferences = async () => {
        await appStorage.setItem(`${storagePath}/${sections.REFERENCES}`, state.references);

        if (state.references?.contacts?.data && state.references?.goods?.data) {
          const remainsModel: IModel<IModelData<IMDGoodRemain>> = await getRemainsModel(
            state.references?.contacts?.data as IContact[],
            state.references?.goods?.data as IGood[],
            (state.references?.remains?.data as unknown) as IRemains[],
          );
          actions.setModel(remainsModel);
        }
      };

      if (state.references && storagePath && !isLoading) {
        saveReferences();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.references, storagePath]);

    /*  Сохранение настроек в storage при их изменении */
    useEffect(() => {
      const saveSettings = async () => {
        // console.log('saveSettings');
        await appStorage.setItem(`${storagePath}/${sections.SETTINGS}`, state.settings);
      };

      if (state.settings && storagePath && !isLoading) {
        saveSettings();
      }
    }, [state.settings, storagePath]);

    /*  Сохранение настроек компании в storage при их изменении */
    useEffect(() => {
      const saveCompanySettings = async () => {
        await appStorage.setItem(`${storagePath}/${sections.COMPANYSETTINGS}`, state.companySettings);
      };

      if (state.companySettings && storagePath && !isLoading) {
        saveCompanySettings();
      }
    }, [state.companySettings, storagePath]);

    /*  Сохранение документов в storage при их изменении */
    useEffect(() => {
      const saveDocuments = async () => {
        // console.log('saveDocuments');
        await appStorage.setItem(`${storagePath}/${sections.DOCUMENTS}`, state.documents);
      };

      if (state.documents && storagePath && !isLoading) {
        saveDocuments();
      }
    }, [state.documents, storagePath]);

    /*  Сохранение viewParams в storage при их изменении */
    useEffect(() => {
      const saveViewParams = async () => {
        await appStorage.setItem(`${storagePath}/${sections.VIEWPARAMS}`, state.viewParams);
      };
      if (state.viewParams && storagePath && !isLoading) {
        saveViewParams();
      }
    }, [state.viewParams, storagePath]);

    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useAppStore = () => React.useContext(StoreContext);

  return { StoreProvider, useAppStore };
};

export const { StoreProvider, useAppStore } = createStoreContext();
