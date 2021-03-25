declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare module '*.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: any;
  export = styles;
}

declare module '*.scss' {
  const styles: { [className: string]: string };
  export = styles;
}
