import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

const withModalProvider = (Component: FC) => () => {
  return (
    <BottomSheetModalProvider>
      <Component />
    </BottomSheetModalProvider>
  );
};

export default withModalProvider;
