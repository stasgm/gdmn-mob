import { useState, useEffect } from 'react';

import { getMaxHeight } from './helpers';

export const useWindowResizeMaxHeight = (initialMaxHeight: number) => {
  const [maxHeight, setMaxHeight] = useState(initialMaxHeight);

  useEffect(() => {
    const updateDimension = () => {
      setMaxHeight(getMaxHeight());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, []);

  return maxHeight;
};
