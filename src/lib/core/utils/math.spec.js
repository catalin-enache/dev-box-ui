import { expect } from 'chai';
import { trunc, getStep } from './math';

describe('trunc', () => {
  it('truncates the number', () => {
    expect(trunc(2)(2 / 3)).to.equal(0.66);
  });
});

describe('getStep', () => {
  describe('when steps is undefined or less than 2', () => {
    it('returns { value, percent }', () => {
      const res = getStep(-10, 90, 40);
      expect(res).to.eql({ value: 40, percent: 0.5 });
    });
  });
  describe('when steps >= 2', () => {
    it('returns { value, index, percent }', () => {
      const res = getStep(-10, 90, 40, 3);
      expect(res).to.eql({ value: 40, percent: 0.5, index: 1 });
    });
  });
});
