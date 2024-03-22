import { useState, useEffect } from 'react';

const getWidth = (coff: number) => (window.innerWidth - 256 < 900 ? '50%' : (window.innerWidth - 256) * coff);

export const useWindowResizeWidth = (coff: number) => {
  const [width, setWidth] = useState(getWidth(coff));

  useEffect(() => {
    const updateDimension = () => {
      setWidth(getWidth(coff));
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [coff]);

  return width;
};
