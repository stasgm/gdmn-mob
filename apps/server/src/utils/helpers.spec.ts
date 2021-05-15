import { extraPredicate } from './helpers';

describe('extraPredicate test suit', () => {
  it('should return true ', () => {
    const item = { name: 'Stas', sex: 'male' };
    const param = { sex: 'male' };
    const res = extraPredicate(item, param);
    expect(res).toBeTruthy();
  });

  it('should return false ', () => {
    const item = { name: 'Stas', sex: 'male' };
    const param = { sex: 'female' };
    const res = extraPredicate(item, param);
    expect(res).toBeFalsy();
  });
});
