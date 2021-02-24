import { TAppActions } from './App/actions';
import { TAuthActions } from './Auth/actions';
import { TServiceActions } from './Service/actions';

export { AuthActions } from './Auth/actions';
export { useStore as useAuthStore, StoreProvider as AuthStoreProvider } from './Auth/store';
export { AppActions } from './App/actions';
export { useStore as useAppStore, StoreProvider as AppStoreProvider } from './App/store';
export { ServiceActions } from './Service/actions';
export { useStore as useServiceStore, StoreProvider as ServiceStoreProvider } from './Service/store';

export type TActions = TServiceActions | TAppActions | TAuthActions;
