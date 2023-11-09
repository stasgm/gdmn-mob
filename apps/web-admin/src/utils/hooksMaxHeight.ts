import { useState, useEffect } from 'react';

import { getMaxHeight } from './helpers';

export function setMaxHeight(maxHeightWindows: number) {
  const [maxHeight, setMaxHeight] = useState(maxHeightWindows);

  useEffect(() => {
    const updateDimension = () => {
      setMaxHeight(getMaxHeight());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [maxHeight]);
  return maxHeight;
}
