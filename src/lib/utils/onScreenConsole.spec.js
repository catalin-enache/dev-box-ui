import { describe, it } from 'mocha';
import { expect } from 'chai';
import onScreenConsole from './onScreenConsole';


const firstMessage = `foo, bar, 5, , , Map ([[2,7]]), Set ([4,5]), [
  8,
  9,
  10
], function () {
      console.log('bla');
    }, {
  "a": {
    "b": {
      "c": [
        1,
        "function () {\\n            console.log('inline');\\n          }"
      ]
    }
  }
}`;


describe('onScreenConsole', () => {
  it('behaves as expected', (done) => {
    const consoleLog = console.log;
    const release = onScreenConsole();
    const toggler = document.getElementById('DBUonScreenConsoleToggler');

    expect(console.log).to.not.equal(consoleLog);

    setTimeout(() => {
      toggler.click();
      const consoleArea = document.getElementById('DBUonScreenConsole');
      expect(consoleArea).to.not.equal(null);

      const children = document.querySelectorAll('#DBUonScreenConsole pre');
      expect(children.length).to.equal(3);

      expect(children[0].innerHTML).to.equal(firstMessage);
      expect(children[1].innerHTML).to.equal('warning');
      expect(children[2].innerHTML).to.equal('error');

      expect(children[1].style.color).to.equal('orange');
      expect(children[2].style.color).to.equal('darkred');

      setTimeout(() => {
        toggler.click();

        const consoleArea = document.getElementById('DBUonScreenConsole');
        expect(consoleArea).to.equal(null);

        release();

        expect(console.log).to.equal(consoleLog);
        expect(document.getElementById('DBUonScreenConsoleToggler')).to.equal(null);

        done();
      }, 0);
    }, 0);

    console.log('foo', 'bar', 5, null, undefined, new Map([[2, 7]]), new Set([4, 5]), [8, 9, 10], function () { console.log('bla'); }, { a: { b: { c: [1, function () { console.log('inline'); }] } } });
    console.warn('warning');
    console.error('error');
  });
});
