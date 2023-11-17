import { useState, useEffect } from 'react';

export const useWindowResizeMaxHeight = () => {
  const getMaxHeight = window.innerHeight - 268 < 200 ? 200 : window.innerHeight - 268;
  const [maxHeight, setMaxHeight] = useState(getMaxHeight);

  useEffect(() => {
    const updateDimension = () => {
      setMaxHeight(getMaxHeight);
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, []);

  return maxHeight;
};
