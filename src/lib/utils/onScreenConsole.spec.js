import { describe, it } from 'mocha';
import { expect } from 'chai';
import onScreenConsole from './onScreenConsole';

/* eslint no-console: 0 */
/* eslint func-names: 0 */

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
  it(`
  can capture console,
  can toggle on/off messages area,
  retains all messages and every message is shown in its own <pre> child,
  can release console and unmount from DOM
  `,
    (done) => {
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

      console.log('foo', 'bar', 5, null, undefined,
        new Map([[2, 7]]), new Set([4, 5]), [8, 9, 10],
        function () { console.log('bla'); },
        { a: { b: { c: [1, function () { console.log('inline'); }] } } }
      );
      console.warn('warning');
      console.error('error');
    });

  describe('showLastOnly', () => {
    it('only displays last message', (done) => {
      const release = onScreenConsole({
        options: {
          showLastOnly: true
        }
      });

      const toggler = document.getElementById('DBUonScreenConsoleToggler');
      toggler.click();

      let children = null;
      children = document.querySelectorAll('#DBUonScreenConsole pre');
      expect(children.length).to.equal(0);

      console.log('first');
      children = document.querySelectorAll('#DBUonScreenConsole pre');
      expect(children.length).to.equal(1);
      expect(children[0].innerHTML).to.equal('first');

      console.log('second');
      children = document.querySelectorAll('#DBUonScreenConsole pre');
      expect(children.length).to.equal(1);
      expect(children[0].innerHTML).to.equal('second');

      setTimeout(() => {
        toggler.click();
        release();
        done();
      }, 0);

    });
  });

});
