import { extraPredicate } from '../helpers';

describe('Helpers.extraPredicate test suite', () => {
  it('should return true ', () => {
    const item = { name: 'Stas', gender: 'male' };
    const param = { gender: 'male' };
    const res = extraPredicate(item, param);
    expect(res).toBeTruthy();
  });

  it('should return false ', () => {
    const item = { name: 'Stas', gender: 'male' };
    const param = { gender: 'female' };
    const res = extraPredicate(item, param);
    expect(res).toBeFalsy();
  });
});
