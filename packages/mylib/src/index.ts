import { hello, goodbye } from './messages';

type mesType = 'hello' | 'goodbye';

export const message = (name: string, mType: mesType): string => {
  if (mType === 'goodbye') {
    return goodbye(name);
  }
  return hello(name);
};
