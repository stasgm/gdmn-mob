import { useState, useEffect } from 'react';

const getMaxHeight = () => window.innerHeight - 144;

export const useDrawerResizeMaxHeight = () => {
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
