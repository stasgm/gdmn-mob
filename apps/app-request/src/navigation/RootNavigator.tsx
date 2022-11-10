/* import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';
import api from '@lib/client-api';
import { useDispatch, documentActions, referenceActions } from '@lib/store';

import { applDocuments, applRefs } from '../store/mock';

import ApplNavigator from './Root/ApplNavigator';

const navItems: INavItem[] = [
  {
    name: 'Appl',
    title: 'Заявки',
    icon: 'clipboard-list-outline',
    component: ApplNavigator,
  },
];

const RootNavigator = () => {
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);

  const handleSync = async () => {
    console.log('sync');
    setLoading(true);

    await dispatch(referenceActions.deleteAllReferences());
    await dispatch(documentActions.deleteDocuments());

    await dispatch(referenceActions.addReferences(applRefs));
    await dispatch(documentActions.addDocuments(applDocuments));

    setLoading(false);
  };

  return (
    <DrawerNavigator
      items={navItems}
      onSyncClick={api.config.debug?.isMock ? handleSync : undefined}
      syncing={api.config.debug?.isMock ? isLoading : undefined}
    />
  );
};

export default RootNavigator;
*/
