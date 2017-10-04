import { describe, it } from 'mocha';
import { expect } from 'chai';
import assert from 'assert';
import onScreenConsole from './onScreenConsole';


describe('onScreenConsole', () => {
  it('works', (done) => {
    const consoleLog = console.log;
    const release = onScreenConsole();
    const toggler = document.getElementById('DBUonScreenConsoleToggler');

    expect(console.log).to.not.equal(consoleLog);

    setTimeout(() => {
      toggler.click();
      setTimeout(() => {
        toggler.click();
        release();

        expect(console.log).to.equal(consoleLog);
        expect(document.getElementById('DBUonScreenConsoleToggler')).to.equal(null);

        done();
      }, 1000);
    }, 500);

    const a = { ...{ h: 8 } };
    console.log(a);
    assert.equal(-1, [1, 2, 3].indexOf(4));
  });
});
