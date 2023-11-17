import { useState, useEffect } from 'react';

import { getMaxHeight } from './helpers';

export const useWindowResizeMaxHeight = () => {
  const [maxHeight, setMaxHeight] = useState(getMaxHeight());

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
