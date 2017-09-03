import { describe, it } from 'mocha';
import assert from 'assert';
import onScreenConsole from './onScreenConsole';


describe('Array', () => {
  describe('#indexOf()', () => {
    it('xx should return -1 when the value is not present', (done) => {
      onScreenConsole();
      const toggler = document.getElementById('DBUonScreenConsoleToggler');
      setTimeout(() => {
        toggler.click();
        setTimeout(() => {
          toggler.click();
          done();
        }, 1000);
      }, 500);

      const a = { ...{ h: 8 } };
      console.log(a);
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});
