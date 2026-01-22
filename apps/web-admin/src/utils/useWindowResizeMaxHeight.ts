import { useState, useEffect } from 'react';

const getMaxHeight = () => (window.innerHeight - 268 < 200 ? 200 : window.innerHeight - 268);

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
