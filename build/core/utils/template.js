'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = template;
/**
 * const t = template`${0} ${1} ${'two'} ${'three'}`;
 * const tr = t('a', 'b', { two: 'c', three: 'd' });
 * expect(tr).to.equal('a b c d');
 * @param strings
 * @param keys
 * @return {function(...[*])}
 */
function template(strings, ...keys) {
  return (...values) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}