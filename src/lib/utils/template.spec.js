import { expect } from 'chai';
import template from './template';

describe('template', () => {
  it('interpolates values', () => {
    const t = template`${0} ${1} ${'two'} ${'three'}`;
    const tr = t('a', 'b', { two: 'c', three: 'd' });
    expect(tr).to.equal('a b c d');
  });
});
