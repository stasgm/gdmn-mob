export interface IToolBarButton {
  name: string;
  onClick: () => void;
  sx?: any;
  color?: any;
  variant?: any;
  icon?: JSX.Element;
  disabled?: boolean;
}

// export interface IPageParams<T = IPageParam> {
//   [name: string]: T;
// }

export interface IPageParam {
  [name: string]: unknown;
}
