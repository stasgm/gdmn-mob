import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

type Props = {
  children?: React.ReactNode;
};

const withModalProvider = (Component: FC) => (props: Props) => {
  return (
    <BottomSheetModalProvider>
      <Component>{props.children}</Component>
    </BottomSheetModalProvider>
  );
};

export default withModalProvider;
