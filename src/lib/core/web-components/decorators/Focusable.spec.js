import { expect } from 'chai';
import getDBUIWebComponentCore from '../components/DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../internals/ensureSingleRegistration';
import inIframe from '../../../../../testUtils/inIframe';
import Focusable from '../decorators/Focusable';
import { sendTapEvent } from '../../../../../testUtils/simulateEvents';
// import onScreenConsole from '../../utils/onScreenConsole';

/* eslint camelcase: 0 */
/* eslint max-len: 0 */

const dummyOneRegistrationName = 'dummy-one';
function getDummyOne(win) {
  return ensureSingleRegistration(win, dummyOneRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    class DummyOne extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyOneRegistrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
            :host {
              all: initial; 
              display: inline-block;
              width: 100%;
              height: 300px;
              padding: 0px;
              font-size: 18px;
              background-color: rgba(255, 100, 0, 0.2);
              unicode-bidi: bidi-override;
              box-sizing: border-box;
              border: none;
            }
            
            :host [tabindex] {
              width: 100%;
              height: 50px;
              line-height: 50px;
              border: none;
              margin: 5px 0px 0px 0px;
              padding: 0px;
              background-color: rgba(0, 0, 0, .2);
              border-radius: 0px;
              box-sizing: border-box;
              unicode-bidi: bidi-override;
            }
            
            :host [tabindex]:focus {
              background-color: rgba(255, 0, 0, .4);
              outline: none;
            }
      
            :host([focused]) {
              background-color: rgba(0, 255, 0, .4);
            }
            
            :host([disabled]) {
              background-color: rgba(0, 0, 0, .4);
            }
      
            :host([hidden]) {
              display: none;
            }
      
            :host([dir=rtl]) {
            
            }
            
            :host([dir=ltr]) {
            
            }
          </style>
          <div>
            <div>dummy one</div>
            <div contenteditable="true" tabindex="0"></div>
            <div contenteditable="true" tabindex="0"></div>
            <input type="text" tabindex="0"/>
            <input type="text" tabindex="0"/>
          </div>
        `;
      }

    }

    return Registerable(
      Focusable(
        defineCommonStaticMethods(
          DummyOne
        )
      )
    );
  });
}
getDummyOne.registrationName = dummyOneRegistrationName;

describe('Focusable', () => {
  it('can be styled with [focused] or :focus-within', (done) => {
    inIframe({
      headStyle: `
        dummy-one {
          border: 1px solid rgba(0, 0, 0, 0);
        }
        #one:focus-within {
          border: 1px solid red;
        }
        #two[focused] {
          border: 1px solid red;
        }
        #three[disabled] {
          border: 1px solid black;
        }
      `,
      bodyHTML: `
      <dummy-one id="one"></dummy-one>
      <dummy-one id="two"></dummy-one>
      <dummy-one id="three" disabled></dummy-one>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        let activeElement = null;
        contentWindow.document.addEventListener('focus', () => {
          activeElement = contentWindow.document.activeElement;
        }, true);
        contentWindow.document.addEventListener('blur', () => {
          activeElement = null;
        }, true);

        const dummyOne = contentWindow.document.querySelector('#one');
        const dummyTwo = contentWindow.document.querySelector('#two');
        const dummyThree = contentWindow.document.querySelector('#three');

        const DummyOne = getDummyOne(contentWindow);
        contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

          expect(activeElement).to.equal(null);
          expect(contentWindow.getComputedStyle(dummyOne).borderLeftColor).to.equal('rgba(0, 0, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyTwo).borderLeftColor).to.equal('rgba(0, 0, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyThree).borderLeftColor).to.equal('rgb(0, 0, 0)');

          dummyOne.focus();

          expect(activeElement).to.equal(dummyOne);
          expect(contentWindow.getComputedStyle(dummyOne).borderLeftColor).to.equal('rgb(255, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyTwo).borderLeftColor).to.equal('rgba(0, 0, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyThree).borderLeftColor).to.equal('rgb(0, 0, 0)');

          dummyTwo.focus();

          expect(activeElement).to.equal(dummyTwo);
          expect(contentWindow.getComputedStyle(dummyOne).borderLeftColor).to.equal('rgba(0, 0, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyTwo).borderLeftColor).to.equal('rgb(255, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyThree).borderLeftColor).to.equal('rgb(0, 0, 0)');

          dummyThree.focus();

          // no focus change as dummyThree is disabled
          expect(activeElement).to.equal(dummyTwo);
          expect(contentWindow.getComputedStyle(dummyOne).borderLeftColor).to.equal('rgba(0, 0, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyTwo).borderLeftColor).to.equal('rgb(255, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyThree).borderLeftColor).to.equal('rgb(0, 0, 0)');

          dummyTwo.blur();

          expect(activeElement).to.equal(null);
          expect(contentWindow.getComputedStyle(dummyOne).borderLeftColor).to.equal('rgba(0, 0, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyTwo).borderLeftColor).to.equal('rgba(0, 0, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyThree).borderLeftColor).to.equal('rgb(0, 0, 0)');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DummyOne.registerSelf();
      }
    });
  });

  it('defines tabindex by default if not defined by user in which case the value is NOT overridden', (done) => {
    inIframe({
      headStyle: `
      `,
      bodyHTML: `
      <dummy-one id="one"></dummy-one>
      <dummy-one id="two" tabindex="-1"></dummy-one>
      `,
      onLoad: ({ contentWindow, iframe }) => {

        const dummyOne = contentWindow.document.querySelector('#one');
        const dummyTwo = contentWindow.document.querySelector('#two');

        const DummyOne = getDummyOne(contentWindow);
        contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

          expect(dummyOne.tabIndex).to.equal(0);
          expect(dummyOne.getAttribute('tabindex')).to.equal('0');
          expect(dummyTwo.tabIndex).to.equal(-1);
          expect(dummyTwo.getAttribute('tabindex')).to.equal('-1');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DummyOne.registerSelf();
      }
    });
  });

  describe('when focused, when blurred', () => {
    it(`
    when focused, if not disabled, will focus the first inner focusable,
    when blurred, if previously focused, will blur first inner focusable 
    `, (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dummy-one id="one"></dummy-one>
        <dummy-one id="two" disabled></dummy-one>
        
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const dummyOne = contentWindow.document.querySelector('#one');
          const dummyTwo = contentWindow.document.querySelector('#two');

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            const dummyOneFirstInnerFocusable = dummyOne._firstInnerFocusable;
            const dummyTwoFirstInnerFocusable = dummyTwo._firstInnerFocusable;

            // const release = onScreenConsole({ win: contentWindow });

            // if (!(navigator.vendor === 'Apple Computer, Inc.' && navigator.platform === 'MacIntel')) {
            expect(contentWindow.getComputedStyle(dummyOneFirstInnerFocusable).backgroundColor).to.equal('rgba(0, 0, 0, 0.2)');

            dummyOne.focus();

            expect(contentWindow.getComputedStyle(dummyOneFirstInnerFocusable).backgroundColor).to.equal('rgba(255, 0, 0, 0.4)');

            dummyOne.blur();

            expect(contentWindow.getComputedStyle(dummyOneFirstInnerFocusable).backgroundColor).to.equal('rgba(0, 0, 0, 0.2)');
            expect(contentWindow.getComputedStyle(dummyTwoFirstInnerFocusable).backgroundColor).to.equal('rgba(0, 0, 0, 0.2)');

            dummyTwo.focus();

            // no change as dummyTwo is disabled
            expect(contentWindow.getComputedStyle(dummyTwoFirstInnerFocusable).backgroundColor).to.equal('rgba(0, 0, 0, 0.2)');

            dummyTwo.blur();

            // } else {
            //   console.log('"when focused, when blurred" test skipped for Safari on Mac');
            // }

            setTimeout(() => {
              // release();
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('when becoming disabled', () => {
    it(`
    it removes tabindex attr but preserve the value to restore it when re-enabled
    `, (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dummy-one id="one" tabindex="-1"></dummy-one>
        <dummy-one id="two"></dummy-one>
        <dummy-one id="three" tabindex="1" disabled></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const dummyOne = contentWindow.document.querySelector('#one');
          const dummyTwo = contentWindow.document.querySelector('#two');
          const dummyThree = contentWindow.document.querySelector('#three');
          dummyOne.disabled = true;
          dummyTwo.tabIndex = 1;

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(dummyOne.getAttribute('tabindex')).to.equal(null);
            expect(dummyTwo.getAttribute('tabindex')).to.equal('1');
            expect(dummyThree.getAttribute('tabindex')).to.equal(null);

            dummyTwo.disabled = true;

            expect(dummyOne.getAttribute('tabindex')).to.equal(null);
            expect(dummyTwo.getAttribute('tabindex')).to.equal(null);
            expect(dummyThree.getAttribute('tabindex')).to.equal(null);

            dummyOne.disabled = false;
            dummyTwo.disabled = false;
            dummyThree.disabled = false;

            expect(dummyOne.getAttribute('tabindex')).to.equal('-1');
            expect(dummyTwo.getAttribute('tabindex')).to.equal('1');
            expect(dummyThree.getAttribute('tabindex')).to.equal('1');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('when moved around', () => {
    it('preserves current tabindex/disabled values', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div id="wrapper"></div>
        <dummy-one id="one" tabindex="-1"></dummy-one>
        <dummy-one id="two" tabindex="1"></dummy-one>
        <dummy-one id="three" tabindex="1" disabled></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const wrapper = contentWindow.document.querySelector('#wrapper');
          const dummyOne = contentWindow.document.querySelector('#one');
          const dummyTwo = contentWindow.document.querySelector('#two');
          const dummyThree = contentWindow.document.querySelector('#three');

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(dummyOne.getAttribute('tabindex')).to.equal('-1');
            expect(dummyTwo.getAttribute('tabindex')).to.equal('1');
            expect(dummyThree.getAttribute('tabindex')).to.equal(null);

            wrapper.appendChild(dummyOne);
            wrapper.appendChild(dummyTwo);
            wrapper.appendChild(dummyThree);

            expect(dummyOne.getAttribute('tabindex')).to.equal('-1');
            expect(dummyTwo.getAttribute('tabindex')).to.equal('1');
            expect(dummyThree.getAttribute('tabindex')).to.equal(null);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('when moved around after being focused', () => {
    it('loses focus', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div id="wrapper"></div>
        <dummy-one id="one"></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const wrapper = contentWindow.document.querySelector('#wrapper');
          const dummyOne = contentWindow.document.querySelector('#one');

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(dummyOne.focused).to.equal(false);

            dummyOne.focus();

            expect(dummyOne.focused).to.equal(true);

            wrapper.appendChild(dummyOne);

            expect(dummyOne.focused).to.equal(false);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('when disabled then enabled', () => {
    it('remembers previous tabindex value', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dummy-one id="one" tabindex="2"></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const dummyOne = contentWindow.document.querySelector('#one');

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(dummyOne.getAttribute('tabindex')).to.equal('2');
            expect(dummyOne.tabIndex).to.equal(2);

            dummyOne.disabled = true;

            expect(dummyOne.getAttribute('tabindex')).to.equal(null);
            expect(dummyOne.tabIndex).to.equal(-1);

            dummyOne.disabled = false;

            expect(dummyOne.getAttribute('tabindex')).to.equal('2');
            expect(dummyOne.tabIndex).to.equal(2);


            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('when disabled, moved around then enabled', () => {
    it('remembers previous tabindex value', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div id="wrapper"></div>
        <dummy-one id="one" tabindex="2"></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const wrapper = contentWindow.document.querySelector('#wrapper');
          const dummyOne = contentWindow.document.querySelector('#one');

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(dummyOne.getAttribute('tabindex')).to.equal('2');
            expect(dummyOne.tabIndex).to.equal(2);

            dummyOne.disabled = true;

            expect(dummyOne.getAttribute('tabindex')).to.equal(null);
            expect(dummyOne.tabIndex).to.equal(-1);

            wrapper.appendChild(dummyOne);

            expect(dummyOne.getAttribute('tabindex')).to.equal(null);
            expect(dummyOne.tabIndex).to.equal(-1);

            dummyOne.disabled = false;

            expect(dummyOne.getAttribute('tabindex')).to.equal('2');
            expect(dummyOne.tabIndex).to.equal(2);


            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('when user defines both disabled and tabindex', () => {
    it('tabindex is removed but remembered when component is re-enabled', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dummy-one id="one" tabindex="2" disabled></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const dummyOne = contentWindow.document.querySelector('#one');

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(dummyOne.getAttribute('tabindex')).to.equal(null);
            expect(dummyOne.tabIndex).to.equal(-1);

            dummyOne.disabled = false;

            expect(dummyOne.getAttribute('tabindex')).to.equal('2');
            expect(dummyOne.tabIndex).to.equal(2);


            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('when user focuses directly some inner focusable (ex: by click)', () => {
    it('first inner focusable will not get focus - to preserve the focus on the node being focused', (done) => {
      inIframe({
        done,
        headStyle: `
        `,
        bodyHTML: `
        <dummy-one id="one"></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const dummyOne = contentWindow.document.querySelector('#one');

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            const dummyOneFirstInnerFocusable = dummyOne._innerFocusables[0];
            const dummyOneSecondInnerFocusable = dummyOne._innerFocusables[1];

            // if (!(navigator.vendor === 'Apple Computer, Inc.' && navigator.platform === 'MacIntel')) {
            expect(contentWindow.getComputedStyle(dummyOne).backgroundColor).to.equal('rgba(255, 100, 0, 0.2)');
            expect(contentWindow.getComputedStyle(dummyOneFirstInnerFocusable).backgroundColor).to.equal('rgba(0, 0, 0, 0.2)');

            dummyOne.focus();

            expect(contentWindow.getComputedStyle(dummyOne).backgroundColor).to.equal('rgba(0, 255, 0, 0.4)');
            expect(contentWindow.getComputedStyle(dummyOneFirstInnerFocusable).backgroundColor).to.equal('rgba(255, 0, 0, 0.4)');

            dummyOne.blur();

            expect(contentWindow.getComputedStyle(dummyOne).backgroundColor).to.equal('rgba(255, 100, 0, 0.2)');
            expect(contentWindow.getComputedStyle(dummyOneFirstInnerFocusable).backgroundColor).to.equal('rgba(0, 0, 0, 0.2)');

            dummyOneSecondInnerFocusable.focus();

            expect(contentWindow.getComputedStyle(dummyOne).backgroundColor).to.equal('rgba(0, 255, 0, 0.4)');
            expect(contentWindow.getComputedStyle(dummyOneFirstInnerFocusable).backgroundColor).to.equal('rgba(0, 0, 0, 0.2)');
            expect(contentWindow.getComputedStyle(dummyOneSecondInnerFocusable).backgroundColor).to.equal('rgba(255, 0, 0, 0.4)');

            dummyOneSecondInnerFocusable.blur();

            // } else {
            //   console.log('"first inner focusable will not get focus" test skipped for Safari on Mac');
            // }

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('name', () => {
    it('is transparent having the value of the decorated component', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(DummyOne.name).to.equal('DummyOne');
            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('focused attribute', () => {
    it('is rejected if defined by user', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dummy-one id="one" focused></dummy-one>
        <dummy-one id="two"></dummy-one>
        <dummy-one id="three"></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          // eslint-disable-next-line
          const consoleWarn = console.warn;
          let consoleWarnCalls = 0;
          // eslint-disable-next-line
          console.warn = () => {
            consoleWarnCalls += 1;
          };
          const dummyOne = contentWindow.document.querySelector('#one');
          const dummyTwo = contentWindow.document.querySelector('#two');
          const dummyThree = contentWindow.document.querySelector('#three');
          dummyTwo.setAttribute('focused', '');
          dummyThree.focused = true;

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(dummyOne.getAttribute('focused')).to.equal(null);
            expect(dummyTwo.getAttribute('focused')).to.equal(null);
            expect(dummyThree.getAttribute('focused')).to.equal(null);
            expect(consoleWarnCalls).to.equal(3);

            // eslint-disable-next-line
            console.warn = consoleWarn;

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('_onDocumentTap', () => {
    it(`
    blurs the component when target is not the component itself
    `, (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dummy-one id="one"></dummy-one>
        
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const dummyOne = contentWindow.document.querySelector('#one');

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            expect(dummyOne.hasAttribute('focused')).to.equal(false);

            dummyOne.focus();

            expect(dummyOne.hasAttribute('focused')).to.equal(true);

            sendTapEvent(dummyOne.ownerDocument, 'start');

            expect(dummyOne.hasAttribute('focused')).to.equal(false);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

  describe('focus propagation', () => {
    it(`
    is propagated to ownerDocument as it should
    `, (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div><input id="input" /></div>
        <div><dummy-one id="one"></dummy-one></div>
        
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const input = contentWindow.document.querySelector('#input');
          const dummyOne = contentWindow.document.querySelector('#one');

          let activeElement = null;
          contentWindow.document.addEventListener('focus', () => {
            activeElement = contentWindow.document.activeElement;
          }, true);

          contentWindow.document.addEventListener('blur', () => {
            activeElement = contentWindow.document.activeElement;
          }, true);

          const DummyOne = getDummyOne(contentWindow);
          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

            input.focus();

            expect(activeElement).to.equal(input);

            dummyOne._focusFirstInnerFocusable();

            expect(activeElement).to.equal(dummyOne);

            dummyOne.blur();

            expect(activeElement).to.equal(contentWindow.document.body);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  });

});
