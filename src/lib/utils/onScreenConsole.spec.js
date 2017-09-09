import { describe, it } from 'mocha';
import assert from 'assert';
import onScreenConsole from './onScreenConsole';


describe('onScreenConsole', () => {
  it('works', (done) => {
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
