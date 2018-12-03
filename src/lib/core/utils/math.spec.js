import { expect } from 'chai';
import { trunc } from './math';

describe('trunc', () => {
  it('truncates the number', () => {
    expect(trunc(2)(2 / 3)).to.equal(0.66);
  });
});
