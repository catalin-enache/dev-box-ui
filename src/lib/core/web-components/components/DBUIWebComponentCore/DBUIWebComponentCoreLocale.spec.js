import { expect } from 'chai';

import {
  inIframe
} from '../../../../../../testUtils';

import {
  getBase,
  getDummyA,
  getDummyB,
  getDummyC,
  getDummyD,
  getDummyE,
  treeOne,
  treeOneGetDbuiNodes,
  treeStyle
} from './DBUITestTreeSetup';

const treeWithLocale = `
<div id="container">
  <dummy-d dir="rtl" lang="it" id="light-dummy-d-one-root">
    <ul slot="named-slot" id="ul1">
      <li id="ul1-li1">
        <dummy-e id="light-dummy-e-in-named-slot"></dummy-e>
      </li>
    </ul>
    <ul id="ul2">
      <li id="ul2-li1">
        <dummy-d id="light-dummy-d-two-in-default-slot">
          <ul id="ul2-li1-ul1">
            <li id="ul2-li1-ul1-li1">
              <dummy-d dir="xyz" lang="de" id="light-dummy-d-three-in-default-slot">
                <ul id="ul2-li1-ul1-li1-ul1">
                  <li id="ul2-li1-ul1-li1-ul1-li1">
                    <dummy-e id="light-dummy-e-in-default-slot"></dummy-e>
                  </li>
                </ul>
              </dummy-d>
            </li>
          </ul>
        </dummy-d>
      </li>
    </ul>
  </dummy-d>
</div>
`;

/* eslint camelcase: 0 */

describe('DBUIWebComponentBase locale behaviour', () => {
  it(`
  has internal locale defaults when not defined by user
  `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          const container = contentWindow.document.querySelector('#container');

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            container.innerHTML = treeOne;

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            // the default
            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dbui-dir')).to.equal('ltr');
              expect(node.getAttribute('dbui-lang')).to.equal('en');
            });

            const {
              lightDummyDOneRoot
            } = dbuiNodes;

            lightDummyDOneRoot.dir = 'rtl';
            lightDummyDOneRoot.lang = 'vr';

            expect(lightDummyDOneRoot.getAttribute('dir')).to.equal('rtl');
            expect(lightDummyDOneRoot.getAttribute('lang')).to.equal('vr');

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dbui-dir')).to.equal('rtl');
              expect(node.getAttribute('dbui-lang')).to.equal('vr');
            });

            lightDummyDOneRoot.removeAttribute('dir');
            lightDummyDOneRoot.lang = '';
            expect(lightDummyDOneRoot.dir).to.equal('');
            expect(lightDummyDOneRoot.getAttribute('lang')).to.equal('');
            // back to default
            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dbui-dir')).to.equal('ltr');
              expect(node.getAttribute('dbui-lang')).to.equal('en');
            });

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyE.registerSelf();
        }
      });
    });

  it(`
  Locale getters/setters (dir/lang) are kept in sync with attributes (native behavior)
  and internal locale attributes (dbui-dir/dbui-lang) are kept in sync
  with public locale attributes (dir/lang).
  `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          <dummy-d id="dummy-d-one" dir="rtl" lang="sp"></dummy-d>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          const container = contentWindow.document.querySelector('#container');
          const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
          const dummyDTwo = contentWindow.document.createElement('dummy-d');

          dummyDTwo.id = 'dummy-d-two';
          dummyDTwo.dir = 'rtl';
          dummyDTwo.lang = 'it';
          container.appendChild(dummyDTwo);

          expect(!(dummyDOne instanceof DummyD));
          expect(!(dummyDTwo instanceof DummyD));

          // Properties (dir/lang) are kept in sync with attributes (dir/lang)
          // natively by the browser (behaviour of HTMLElement).
          expect(dummyDOne.getAttribute('dir')).to.equal('rtl');
          expect(dummyDOne.getAttribute('lang')).to.equal('sp');
          expect(dummyDTwo.getAttribute('dir')).to.equal('rtl');
          expect(dummyDTwo.getAttribute('lang')).to.equal('it');
          expect(dummyDOne.dir).to.equal('rtl');
          expect(dummyDOne.lang).to.equal('sp');
          expect(dummyDTwo.dir).to.equal('rtl');
          expect(dummyDTwo.lang).to.equal('it');

          dummyDTwo.setAttribute('dir', 'ltr');
          dummyDTwo.setAttribute('lang', 'de');

          expect(dummyDTwo.dir).to.equal('ltr');
          expect(dummyDTwo.lang).to.equal('de');

          dummyDTwo.dir = 'abc';
          dummyDTwo.lang = 'xy';

          expect(dummyDTwo.getAttribute('dir')).to.equal('abc');
          expect(dummyDTwo.getAttribute('lang')).to.equal('xy');
          // Internal locale attributes are not yet synced with public locale attributes
          // as components are not yet upgraded.
          expect(dummyDOne.getAttribute('dbui-dir')).to.equal(null);
          expect(dummyDOne.getAttribute('dbui-lang')).to.equal(null);
          expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(null);
          expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(null);

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            // After upgrade internal locale attributes (dbui-dir/dbui-lang)
            // are synced with public locale attributes (dir/lang).
            expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
            expect(dummyDOne.getAttribute('dbui-lang')).to.equal('sp');
            expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('abc');
            expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('xy');

            dummyDOne.setAttribute('dir', '');
            dummyDOne.removeAttribute('lang');
            dummyDTwo.dir = '';
            dummyDTwo.lang = '';

            // back to default
            expect(dummyDOne.getAttribute('dbui-dir')).to.equal('ltr');
            expect(dummyDOne.getAttribute('dbui-lang')).to.equal('en');
            expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('ltr');
            expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('en');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyE.registerSelf();
        }
      });
    });

  it(`
  is propagated in context with respect to middle ancestors overrides.
  `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: treeWithLocale,
        onLoad: ({ contentWindow, iframe }) => {

          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            const doTest = ({
              firstHalfDir, firstHalfLang, secondHalfDir, secondHalfLang
            }) => {
              const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
              const {
                lightDummyDOneRoot,
                lightDummyDOneRoot_ShadowDummyB,
                lightDummyDOneRoot_ShadowDummyB_ShadowDummyA,

                lightDummyEInNamedSlot,
                lightDummyEInNamedSlot_ShadowDummyD,
                lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB,
                lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
                lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot,
                lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB,
                lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA,

                lightDummyDTwoInDefaultSlot,
                lightDummyDTwoInDefaultSlot_ShadowDummyB,
                lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA,

                lightDummyDThreeInDefaultSlot,
                lightDummyDThreeInDefaultSlot_ShadowDummyB,
                lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA,

                lightDummyEInDefaultSlot,
                lightDummyEInDefaultSlot_ShadowDummyD,
                lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB,
                lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
                lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot,
                lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB,
                lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA
              } = dbuiNodes;

              expect(lightDummyDOneRoot.getAttribute('dbui-dir')).to.equal(firstHalfDir);
              expect(lightDummyDOneRoot.getAttribute('dbui-lang')).to.equal(firstHalfLang);

              [
                lightDummyDOneRoot_ShadowDummyB,
                lightDummyDOneRoot_ShadowDummyB_ShadowDummyA,

                lightDummyEInNamedSlot,
                lightDummyEInNamedSlot_ShadowDummyD,
                lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB,
                lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
                lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot,
                lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB,
                lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA,

                lightDummyDTwoInDefaultSlot,
                lightDummyDTwoInDefaultSlot_ShadowDummyB,
                lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA,
              ]
                .forEach((node) => {
                  expect((node instanceof Base));

                  expect(node.dir).to.equal(''); // public dir not touched
                  expect(node.lang).to.equal(''); // public lang not touched

                  expect(node.getAttribute('dbui-dir')).to.equal(firstHalfDir);
                  expect(node.getAttribute('dbui-lang')).to.equal(firstHalfLang);
                });

              expect(lightDummyDThreeInDefaultSlot.getAttribute('dbui-dir')).to.equal(secondHalfDir);
              expect(lightDummyDThreeInDefaultSlot.getAttribute('dbui-lang')).to.equal(secondHalfLang);

              [
                lightDummyDThreeInDefaultSlot_ShadowDummyB,
                lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA,

                lightDummyEInDefaultSlot,
                lightDummyEInDefaultSlot_ShadowDummyD,
                lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB,
                lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
                lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot,
                lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB,
                lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA
              ]
                .forEach((node) => {
                  expect((node instanceof Base));

                  expect(node.dir).to.equal(''); // public dir not touched
                  expect(node.lang).to.equal(''); // public lang not touched

                  expect(node.getAttribute('dbui-dir')).to.equal(secondHalfDir);
                  expect(node.getAttribute('dbui-lang')).to.equal(secondHalfLang);
                });
            };

            doTest({
              firstHalfDir: 'rtl', firstHalfLang: 'it', secondHalfDir: 'xyz', secondHalfLang: 'de'
            });

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              lightDummyDOneRoot,
              lightDummyDThreeInDefaultSlot
            } = dbuiNodes;

            lightDummyDThreeInDefaultSlot.dir = 'abc';
            lightDummyDThreeInDefaultSlot.lang = 'ar';

            lightDummyDOneRoot.dir = 'def';
            lightDummyDOneRoot.lang = 'xy';

            doTest({
              firstHalfDir: 'def', firstHalfLang: 'xy', secondHalfDir: 'abc', secondHalfLang: 'ar'
            });

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyE.registerSelf();
        }
      });
    });

  it(`
  closest surrounding locale is ignored by descendant nodes
  and instead locale is read from closestDbuiParent
  `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          <dummy-d id="dummy-d-outer" lang="it">
            <div dir="rtl" lang="fr">
              <dummy-d id="dummy-d-inner"></dummy-d>
            </div>
          </dummy-d>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyD = getDummyD(contentWindow);

          const dummyDOuter = contentWindow.document.querySelector('#dummy-d-outer');
          const dummyDInner = contentWindow.document.querySelector('#dummy-d-inner');

          Promise.all([
            DummyD.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('ltr');
            expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('it');
            // dummyDInner is NOT top most ancestor so it does not look for surrounding locale
            // but it gets it via context from closetDbuiParent.
            expect(dummyDInner.getAttribute('dbui-dir')).to.equal('ltr');
            expect(dummyDInner.getAttribute('dbui-lang')).to.equal('it');

            dummyDInner.setAttribute('dir', 'abc');
            dummyDInner.setAttribute('lang', 'de');

            expect(dummyDInner.getAttribute('dbui-dir')).to.equal('abc');
            expect(dummyDInner.getAttribute('dbui-lang')).to.equal('de');

            dummyDInner.removeAttribute('dir');
            dummyDInner.removeAttribute('lang');
            // expect locale to be re-read from from closetDbuiParent
            // and not from closest surrounding locale
            expect(dummyDInner.getAttribute('dbui-dir')).to.equal('ltr');
            expect(dummyDInner.getAttribute('dbui-lang')).to.equal('it');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyD.registerSelf();
        }
      });
    });

  describe(`
  _localeTarget
  `, () => {
      it(`
      returns node found at "sync-locale-with" or root html node
      `, (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <div id="container">
              <div id="locale-provider"></div>
              <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dummy-d>
              <dummy-d id="dummy-d-two"></dummy-d>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyD = getDummyD(contentWindow);

              const html = contentWindow.document.querySelector('html');
              const localeProvider = contentWindow.document.querySelector('#locale-provider');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

              Promise.all([
                DummyD.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                expect(dummyDOne._localeTarget).to.equal(localeProvider);
                expect(dummyDTwo._localeTarget).to.equal(html);

                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 0);
              });

              DummyD.registerSelf();
            }
          });
        });
    });

  describe(`
  _targetedLocale
  `, () => {
      it(`
      returns object { dir, lang } from _localeTarget or defaults to { dir: 'ltr', lang: 'en' }
      `, (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <div id="container">
              <div id="locale-provider"></div>
              <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dummy-d>
              <dummy-d id="dummy-d-two"></dummy-d>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyD = getDummyD(contentWindow);

              const html = contentWindow.document.querySelector('html');
              html.setAttribute('lang', 'it');
              html.setAttribute('dir', 'rtl');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

              Promise.all([
                DummyD.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                expect(dummyDOne._targetedLocale).to.deep.equal({ dir: 'ltr', lang: 'en' });
                expect(dummyDTwo._targetedLocale).to.deep.equal({ dir: 'rtl', lang: 'it' });

                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 0);
              });

              DummyD.registerSelf();
            }
          });
        });
    });

  describe(`
    _resetProvidedLocale
    `, () => {
      describe(`
      when when dir/lang attributes are truthy
      `, () => {
          it(`
          does NOT reset _providingContext and does NOT reset dbui-dir/locale
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <div id="locale-provider" dir="abc" lang="de"></div>
                  <dummy-d id="dummy-d-one" dir="rtl" lang="it" sync-locale-with="#locale-provider"></dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const container = contentWindow.document.querySelector('#container');
                  const localeProvider = contentWindow.document.querySelector('#locale-provider');
                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'it' });

                    dummyDOne.remove();

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'it' });

                    localeProvider.lang = 'pq';
                    container.appendChild(dummyDOne);

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'it' });

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      describe(`
      when when dir/lang attributes are falsy
      `, () => {
          it(`
          resets _providingContext and removes dbui-dir/locale
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <div id="locale-provider" dir="rtl" lang="it"></div>
                  <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const container = contentWindow.document.querySelector('#container');
                  const localeProvider = contentWindow.document.querySelector('#locale-provider');
                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'it' });

                    dummyDOne.remove();

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal(null);
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal(null);
                    expect(dummyDOne._providingContext).to.deep.equal({});

                    localeProvider.lang = 'de';
                    container.appendChild(dummyDOne);

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('de');
                    expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'de' });

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      it(`
        resets _localeObserver if any
        `, (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <div id="container">
              <div id="locale-provider" dir="rtl" lang="it"></div>
              <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dummy-d>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyD = getDummyD(contentWindow);

              const container = contentWindow.document.querySelector('#container');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

              Promise.all([
                DummyD.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                const localeObserver1 = dummyDOne._localeObserver;
                const localeObserver1Disconnect = localeObserver1.disconnect;
                let disconnectWasCalled = false;
                localeObserver1.disconnect = () => {
                  localeObserver1Disconnect.call(localeObserver1);
                  disconnectWasCalled = true;
                };

                expect(localeObserver1).to.not.equal(null);

                dummyDOne.remove();

                const localeObserver2 = dummyDOne._localeObserver;
                expect(disconnectWasCalled).to.equal(true);
                expect(localeObserver2).to.equal(null);

                container.appendChild(dummyDOne);

                const localeObserver3 = dummyDOne._localeObserver;
                expect(localeObserver3).to.not.equal(null);
                expect(localeObserver3.disconnect).to.not.equal(null);
                expect(localeObserver3).to.not.equal(localeObserver1);

                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 0);
              });

              DummyD.registerSelf();
            }
          });
        });
    });

  describe(`
  sync-locale-with
  `, () => {
      describe(`
      when target found
      `, () => {
          it(`
          syncs locale with target
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <div id="locale-provider" dir="rtl" lang="it"></div>
                  <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const container = contentWindow.document.querySelector('#container');
                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('rtl');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('it');

                    dummyDOne.remove();

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal(null);
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal(null);
                    expect(dummyDOne._providingContext.dbuiDir).to.equal(undefined);
                    expect(dummyDOne._providingContext.dbuiLang).to.equal(undefined);

                    container.appendChild(dummyDOne);

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('rtl');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('it');

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      describe(`
      when target changed
      `, () => {
          it(`
          syncs locale with new target
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <div id="locale-provider1" dir="rtl" lang="it"></div>
                  <div id="locale-provider2" dir="abc" lang="ab"></div>
                  <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider1"></dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('rtl');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('it');

                    dummyDOne.setAttribute('sync-locale-with', '#locale-provider2');

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('ab');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('ab');

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      describe(`
      when target not found
      `, () => {
          describe(`
          when node is top most dbui ancestor
          `, () => {
              it('syncs with html node', (done) => {
                inIframe({
                  headStyle: treeStyle,
                  bodyHTML: `
                  <div id="container">
                    <div id="locale-provider1" dir="rtl" lang="it"></div>
                    <dummy-d id="dummy-d-one" sync-locale-with="#non-existing"></dummy-d>
                  </div>
                  `,
                  onLoad: ({ contentWindow, iframe }) => {
                    const DummyD = getDummyD(contentWindow);

                    const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                    const html = contentWindow.document.querySelector('html');
                    html.dir = 'abc';
                    html.lang = 'bc';

                    Promise.all([
                      DummyD.registrationName,
                    ].map((localName) => contentWindow.customElements.whenDefined(localName)
                    )).then(() => {

                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal('bc');
                      expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
                      expect(dummyDOne._providingContext.dbuiLang).to.equal('bc');

                      dummyDOne.setAttribute('sync-locale-with', '#locale-provider1');

                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
                      expect(dummyDOne._providingContext.dbuiDir).to.equal('rtl');
                      expect(dummyDOne._providingContext.dbuiLang).to.equal('it');

                      html.dir = 'bcd';
                      html.lang = 'cd';
                      dummyDOne.setAttribute('sync-locale-with', '#not-existing');

                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal('bcd');
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal('cd');
                      expect(dummyDOne._providingContext.dbuiDir).to.equal('bcd');
                      expect(dummyDOne._providingContext.dbuiLang).to.equal('cd');

                      setTimeout(() => {
                        iframe.remove();
                        done();
                      }, 0);
                    });

                    DummyD.registerSelf();
                  }
                });

              });
            });

          describe(`
          when node is descendant dbui
          `, () => {
              it('syncs with closestDbuiParent', (done) => {
                inIframe({
                  headStyle: treeStyle,
                  bodyHTML: `
                  <div id="container">
                    <div id="locale-provider1" dir="rtl" lang="it"></div>
                    <dummy-d id="dummy-d-outer" sync-locale-with="#non-existing">
                      <dummy-d id="dummy-d-one" sync-locale-with="#non-existing"></dummy-d>
                    </dummy-d>
                  </div>
                  `,
                  onLoad: ({ contentWindow, iframe }) => {
                    const DummyD = getDummyD(contentWindow);

                    const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                    const dummyDOuter = contentWindow.document.querySelector('#dummy-d-outer');
                    const html = contentWindow.document.querySelector('html');
                    html.dir = 'abc';
                    html.lang = 'bc';

                    Promise.all([
                      DummyD.registrationName,
                    ].map((localName) => contentWindow.customElements.whenDefined(localName)
                    )).then(() => {

                      expect(dummyDOuter._localeTarget).to.equal(html);

                      expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('abc');
                      expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('bc');
                      expect(dummyDOuter._providingContext.dbuiDir).to.equal('abc');
                      expect(dummyDOuter._providingContext.dbuiLang).to.equal('bc');
                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal('bc');
                      expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
                      expect(dummyDOne._providingContext.dbuiLang).to.equal('bc');

                      html.setAttribute('dir', 'bcd');
                      html.setAttribute('lang', 'cd');

                      setTimeout(() => {
                        expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('bcd');
                        expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('cd');
                        expect(dummyDOuter._providingContext.dbuiDir).to.equal('bcd');
                        expect(dummyDOuter._providingContext.dbuiLang).to.equal('cd');
                        expect(dummyDOne.getAttribute('dbui-dir')).to.equal('bcd');
                        expect(dummyDOne.getAttribute('dbui-lang')).to.equal('cd');
                        expect(dummyDOne._providingContext.dbuiDir).to.equal('bcd');
                        expect(dummyDOne._providingContext.dbuiLang).to.equal('cd');

                        setTimeout(() => {
                          iframe.remove();
                          done();
                        }, 0);
                      }, 0);
                    });

                    DummyD.registerSelf();
                  }
                });
              });
            });
        });
    });

  describe(`
    _onLocaleContextChanged
    `, () => {
      describe(`
      when monitoring locale on target
      `, () => {
          it(`
          ignores context notification but locale is propagated with overrides
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <div id="locale-provider" dir="rtl" lang="it"></div>
                  <dummy-d id="dummy-d-one" dir="abc" lang="ab">
                    <dummy-d id="dummy-d-two" sync-locale-with="#locale-provider">
                      <dummy-d id="dummy-d-three"></dummy-d>
                    </dummy-d>
                  </dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                  const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
                  const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('ab');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('ab');
                    expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDTwo._providingContext.dbuiDir).to.equal('rtl');
                    expect(dummyDTwo._providingContext.dbuiLang).to.equal('it');
                    expect(dummyDThree.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDThree.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('rtl');
                    expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('it');

                    dummyDOne.dir = 'bcd';
                    dummyDOne.lang = 'cd';

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('bcd');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('cd');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('bcd');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('cd');
                    expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDTwo._providingContext.dbuiDir).to.equal('rtl');
                    expect(dummyDTwo._providingContext.dbuiLang).to.equal('it');
                    expect(dummyDThree.getAttribute('dbui-dir')).to.equal('rtl');
                    expect(dummyDThree.getAttribute('dbui-lang')).to.equal('it');
                    expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('rtl');
                    expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('it');

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      describe(`
      when dir/lang are truthy
      `, () => {
          it(`
          ignores context notification but locale is propagated with overrides
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <dummy-d id="dummy-d-one" dir="abc" lang="ab">
                    <dummy-d id="dummy-d-two" dir="bcd">
                      <dummy-d id="dummy-d-three"></dummy-d>
                    </dummy-d>
                  </dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                  const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
                  const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('ab');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('ab');
                    expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('bcd');
                    expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('ab');
                    expect(dummyDTwo._providingContext.dbuiDir).to.equal('bcd');
                    expect(dummyDTwo._providingContext.dbuiLang).to.equal(undefined);
                    expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('ab');
                    expect(dummyDThree.getAttribute('dbui-dir')).to.equal('bcd');
                    expect(dummyDThree.getAttribute('dbui-lang')).to.equal('ab');
                    expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('bcd');
                    expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('ab');

                    dummyDOne.dir = 'cde';
                    dummyDOne.lang = 'de';

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('cde');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('de');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('cde');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('de');
                    expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('bcd');
                    expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('de');
                    expect(dummyDTwo._providingContext.dbuiDir).to.equal('bcd');
                    expect(dummyDTwo._providingContext.dbuiLang).to.equal(undefined);
                    expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('de');
                    expect(dummyDThree.getAttribute('dbui-dir')).to.equal('bcd');
                    expect(dummyDThree.getAttribute('dbui-lang')).to.equal('de');
                    expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('bcd');
                    expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('de');

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      describe(`
      when dir/lang are falsy and NOT monitoring locale on target
      `, () => {
          it(`
          sets dbui-dir/lang and locale change is further propagated
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <dummy-d id="dummy-d-one" dir="abc" lang="ab">
                    <dummy-d id="dummy-d-two">
                      <dummy-d id="dummy-d-three"></dummy-d>
                    </dummy-d>
                  </dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                  const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
                  const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('ab');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('ab');
                    expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('abc');
                    expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('ab');
                    expect(dummyDTwo._lastReceivedContext.dbuiDir).to.equal('abc');
                    expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('ab');
                    expect(dummyDThree.getAttribute('dbui-dir')).to.equal('abc');
                    expect(dummyDThree.getAttribute('dbui-lang')).to.equal('ab');
                    expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('abc');
                    expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('ab');

                    dummyDOne.dir = 'cde';
                    dummyDOne.lang = 'de';

                    expect(dummyDOne.getAttribute('dbui-dir')).to.equal('cde');
                    expect(dummyDOne.getAttribute('dbui-lang')).to.equal('de');
                    expect(dummyDOne._providingContext.dbuiDir).to.equal('cde');
                    expect(dummyDOne._providingContext.dbuiLang).to.equal('de');
                    expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('cde');
                    expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('de');
                    expect(dummyDTwo._lastReceivedContext.dbuiDir).to.equal('cde');
                    expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('de');
                    expect(dummyDThree.getAttribute('dbui-dir')).to.equal('cde');
                    expect(dummyDThree.getAttribute('dbui-lang')).to.equal('de');
                    expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('cde');
                    expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('de');

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });
    });

  describe(`
  _onLocaleAttributeChangedCallback
  `, () => {
      describe(`
      when dir/lang are truthy
      `, () => {
          it(`
          it takes precedence over locale target or over context from closest dbui parent
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <div id="locale-provider" dir="abc" lang="ab"></div>
                  <dummy-d id="dummy-d-one">
                    <dummy-d id="dummy-d-two" sync-locale-with="#locale-provider">
                      <dummy-d id="dummy-d-three"></dummy-d>
                    </dummy-d>
                  </dummy-d>
                  <dummy-d id="dummy-d-four" dir="cde" lang="de">
                    <dummy-d id="dummy-d-five">
                      <dummy-d id="dummy-d-six"></dummy-d>
                    </dummy-d>
                  </dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                  const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
                  const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');
                  const dummyDFour = contentWindow.document.querySelector('#dummy-d-four');
                  const dummyDFive = contentWindow.document.querySelector('#dummy-d-five');
                  const dummyDSix = contentWindow.document.querySelector('#dummy-d-six');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    const test = ({
                      oneDir, oneLang, twoDir, twoLang, threeDir, threeLang,
                      fourDir, fourLang, fiveDir, fiveLang, sixDir, sixLang,
                    }) => {
                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                      expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                      expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                      expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                      expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                      expect(dummyDFour.getAttribute('dbui-dir')).to.equal(fourDir);
                      expect(dummyDFour.getAttribute('dbui-lang')).to.equal(fourLang);
                      expect(dummyDFive.getAttribute('dbui-dir')).to.equal(fiveDir);
                      expect(dummyDFive.getAttribute('dbui-lang')).to.equal(fiveLang);
                      expect(dummyDSix.getAttribute('dbui-dir')).to.equal(sixDir);
                      expect(dummyDSix.getAttribute('dbui-lang')).to.equal(sixLang);
                    };

                    /* eslint object-property-newline: 0 */
                    test({
                      oneDir: 'ltr', oneLang: 'en', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab',
                      fourDir: 'cde', fourLang: 'de', fiveDir: 'cde', fiveLang: 'de', sixDir: 'cde', sixLang: 'de',
                    });

                    dummyDTwo.dir = 'efg';
                    dummyDTwo.lang = 'ef';
                    dummyDFive.dir = 'fgh';
                    dummyDFive.lang = 'fg';

                    test({
                      oneDir: 'ltr', oneLang: 'en', twoDir: 'efg', twoLang: 'ef', threeDir: 'efg', threeLang: 'ef',
                      fourDir: 'cde', fourLang: 'de', fiveDir: 'fgh', fiveLang: 'fg', sixDir: 'fgh', sixLang: 'fg',
                    });

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      describe(`
      when dir/lang is falsy but there is a truthy value on locale target
      `, () => {
          it(`
          it syncs with and monitors locale target
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <div id="locale-provider" dir="abc" lang="ab"></div>
                  <dummy-d id="dummy-d-one">
                    <dummy-d id="dummy-d-two" dir="bcd" lang="bc" sync-locale-with="#locale-provider">
                      <dummy-d id="dummy-d-three"></dummy-d>
                    </dummy-d>
                  </dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const localeProvider = contentWindow.document.querySelector('#locale-provider');
                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                  const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
                  const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    const test = ({
                      oneDir, oneLang, twoDir, twoLang, threeDir, threeLang
                    }) => {
                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                      expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                      expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                      expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                      expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                    };

                    test({
                      oneDir: 'ltr', oneLang: 'en', twoDir: 'bcd', twoLang: 'bc', threeDir: 'bcd', threeLang: 'bc'
                    });

                    dummyDTwo.dir = '';
                    dummyDTwo.lang = '';

                    test({
                      oneDir: 'ltr', oneLang: 'en', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab'
                    });

                    localeProvider.dir = 'def';
                    localeProvider.lang = 'de';

                    setTimeout(() => {
                      test({
                        oneDir: 'ltr', oneLang: 'en', twoDir: 'def', twoLang: 'de', threeDir: 'def', threeLang: 'de'
                      });

                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      describe(`
      when dir/lang is falsy and there is no locale target
      `, () => {
          it(`
          it syncs with closest dbui parent
          and propagates context from parent to self and ancestors
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                    <dummy-d id="dummy-d-two" dir="cde" lang="cd">
                      <dummy-d id="dummy-d-three"></dummy-d>
                    </dummy-d>
                  </dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                  const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
                  const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    const test = ({
                      oneDir, oneLang, twoDir, twoLang, threeDir, threeLang
                    }) => {
                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                      expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                      expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                      expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                      expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                    };

                    test({
                      oneDir: 'bcd', oneLang: 'bc', twoDir: 'cde', twoLang: 'cd', threeDir: 'cde', threeLang: 'cd'
                    });

                    expect(dummyDTwo._providingContext.dbuiDir).to.equal('cde');
                    expect(dummyDTwo._providingContext.dbuiLang).to.equal('cd');
                    expect(dummyDTwo._lastReceivedContext.dbuiDir).to.equal('bcd');
                    expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('bc');

                    dummyDTwo.dir = '';
                    dummyDTwo.lang = '';

                    test({
                      oneDir: 'bcd', oneLang: 'bc', twoDir: 'bcd', twoLang: 'bc', threeDir: 'bcd', threeLang: 'bc'
                    });

                    expect(dummyDTwo._providingContext.dbuiDir).to.equal(undefined);
                    expect(dummyDTwo._providingContext.dbuiLang).to.equal(undefined);
                    expect(dummyDTwo._lastReceivedContext.dbuiDir).to.equal('bcd');
                    expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('bc');

                    dummyDOne.dir = 'def';
                    dummyDOne.lang = 'de';

                    test({
                      oneDir: 'def', oneLang: 'de', twoDir: 'def', twoLang: 'de', threeDir: 'def', threeLang: 'de'
                    });

                    expect(dummyDTwo._providingContext.dbuiDir).to.equal(undefined);
                    expect(dummyDTwo._providingContext.dbuiLang).to.equal(undefined);
                    expect(dummyDTwo._lastReceivedContext.dbuiDir).to.equal('def');
                    expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('de');

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);
                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

    });

  describe('_syncLocaleAndMonitorChanges', () => {
    describe('when node is top most dbui ancestor', () => {
      describe('when node targets another node for locale sync', () => {
        it('syncs with locale target and monitors changes', (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <div id="container">
              <div id="locale-provider" dir="abc" lang="ab"></div>
              <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider">
                <dummy-d id="dummy-d-two"></dummy-d>
              </dummy-d>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyD = getDummyD(contentWindow);

              const localeProvider = contentWindow.document.querySelector('#locale-provider');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

              Promise.all([
                DummyD.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                const test = ({
                  oneDir, oneLang, twoDir, twoLang
                }) => {
                  expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                  expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                  expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                  expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                };

                test({
                  oneDir: 'abc', oneLang: 'ab', twoDir: 'abc', twoLang: 'ab'
                });

                localeProvider.dir = 'bcd';
                localeProvider.lang = 'bc';

                setTimeout(() => {
                  test({
                    oneDir: 'bcd', oneLang: 'bc', twoDir: 'bcd', twoLang: 'bc'
                  });

                  iframe.remove();
                  done();
                }, 0);
              });

              DummyD.registerSelf();
            }
          });
        });
      });

      describe('when node does NOT target another node for locale sync', () => {
        it('syncs with html node and monitors changes', (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <div id="container">
              <dummy-d id="dummy-d-one">
                <dummy-d id="dummy-d-two"></dummy-d>
              </dummy-d>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyD = getDummyD(contentWindow);

              const html = contentWindow.document.querySelector('html');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

              Promise.all([
                DummyD.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                const test = ({
                  oneDir, oneLang, twoDir, twoLang
                }) => {
                  expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                  expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                  expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                  expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                };

                test({
                  oneDir: 'ltr', oneLang: 'en', twoDir: 'ltr', twoLang: 'en'
                });

                html.dir = 'bcd';
                html.lang = 'bc';

                setTimeout(() => {
                  test({
                    oneDir: 'bcd', oneLang: 'bc', twoDir: 'bcd', twoLang: 'bc'
                  });

                  iframe.remove();
                  done();
                }, 0);
              });

              DummyD.registerSelf();
            }
          });
        });
      });
    });

    describe('when node is descendant dbui', () => {
      describe('when node targets another node for locale sync', () => {
        it('syncs with locale target and monitors changes', (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <div id="container">
              <div id="locale-provider" dir="abc" lang="ab"></div>
              <dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                <dummy-d id="dummy-d-two" sync-locale-with="#locale-provider">
                  <dummy-d id="dummy-d-three"></dummy-d>
                </dummy-d>
              </dummy-d>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyD = getDummyD(contentWindow);

              const localeProvider = contentWindow.document.querySelector('#locale-provider');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
              const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

              Promise.all([
                DummyD.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                const test = ({
                  oneDir, oneLang, twoDir, twoLang, threeDir, threeLang
                }) => {
                  expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                  expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                  expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                  expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                  expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                  expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                };

                test({
                  oneDir: 'bcd', oneLang: 'bc', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab'
                });

                localeProvider.dir = 'cde';
                localeProvider.lang = 'cd';

                setTimeout(() => {
                  test({
                    oneDir: 'bcd', oneLang: 'bc', twoDir: 'cde', twoLang: 'cd', threeDir: 'cde', threeLang: 'cd'
                  });

                  iframe.remove();
                  done();
                }, 0);
              });

              DummyD.registerSelf();
            }
          });
        });
      });

      describe('when node does NOT target another node for locale sync', () => {
        it('syncs with closestDbuiParent', (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <div id="container">
              <dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                <dummy-d id="dummy-d-two">
                  <dummy-d id="dummy-d-three"></dummy-d>
                </dummy-d>
              </dummy-d>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyD = getDummyD(contentWindow);

              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
              const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

              Promise.all([
                DummyD.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                const test = ({
                  oneDir, oneLang, twoDir, twoLang, threeDir, threeLang
                }) => {
                  expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                  expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                  expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                  expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                  expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                  expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                };

                test({
                  oneDir: 'bcd', oneLang: 'bc', twoDir: 'bcd', twoLang: 'bc', threeDir: 'bcd', threeLang: 'bc'
                });

                dummyDOne.dir = 'cde';
                dummyDOne.lang = 'cd';

                setTimeout(() => {
                  test({
                    oneDir: 'cde', oneLang: 'cd', twoDir: 'cde', twoLang: 'cd', threeDir: 'cde', threeLang: 'cd'
                  });

                  iframe.remove();
                  done();
                }, 0);
              });

              DummyD.registerSelf();
            }
          });
        });
      });
    });
  });

  describe('_watchLocaleChanges', () => {
    it(`
    monitors the target for dir/lang attribute changes,
    sets dbui-dir/lang on self and sets dbuiDir/Lang on context.
    `, (done) => {
        inIframe({
          headStyle: treeStyle,
          bodyHTML: `
          <div id="container">
            <div id="locale-provider"></div>
            <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider">
              <dummy-d id="dummy-d-two">
              </dummy-d>
            </dummy-d>
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyD = getDummyD(contentWindow);

            const localeProvider = contentWindow.document.querySelector('#locale-provider');
            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

            Promise.all([
              DummyD.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const test = ({
                oneDir, oneLang, twoDir, twoLang
              }) => {
                expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
              };

              test({
                oneDir: 'ltr', oneLang: 'en', twoDir: 'ltr', twoLang: 'en'
              });

              localeProvider.dir = 'cde';
              localeProvider.lang = 'cd';

              setTimeout(() => {
                test({
                  oneDir: 'cde', oneLang: 'cd', twoDir: 'cde', twoLang: 'cd'
                });

                localeProvider.dir = '';
                localeProvider.lang = '';

                setTimeout(() => {
                  // falls back to defaults
                  test({
                    oneDir: 'ltr', oneLang: 'en', twoDir: 'ltr', twoLang: 'en'
                  });

                  localeProvider.dir = 'def';
                  localeProvider.lang = 'de';

                  setTimeout(() => {
                    test({
                      oneDir: 'def', oneLang: 'de', twoDir: 'def', twoLang: 'de'
                    });

                    iframe.remove();
                    done();
                  }, 0);
                }, 0);
              }, 0);
            });

            DummyD.registerSelf();
          }
        });
      });

    it(`
    resets previous _localeObserver
    `, (done) => {
        inIframe({
          headStyle: treeStyle,
          bodyHTML: `
          <div id="container">
            <div id="locale-provider1" dir="abc" lang="ab"></div>
            <div id="locale-provider2" dir="bcd" lang="bc"></div>
            <dummy-d id="dummy-d-one" sync-locale-with="#locale-provider1"></dummy-d>
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyD = getDummyD(contentWindow);

            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

            Promise.all([
              DummyD.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const dummyDOne__localeObserver1 = dummyDOne._localeObserver;
              const dummyDOne__localeObserver1_disconnect = dummyDOne__localeObserver1.disconnect;
              let disconnected1 = false;
              dummyDOne__localeObserver1.disconnect = () => {
                disconnected1 = true;
                dummyDOne__localeObserver1_disconnect.call(dummyDOne__localeObserver1);
              };

              dummyDOne.setAttribute('sync-locale-with', '#locale-observer2');

              const dummyDOne__localeObserver2 = dummyDOne._localeObserver;
              const dummyDOne__localeObserver2_disconnect = dummyDOne__localeObserver2.disconnect;
              let disconnected2 = false;
              dummyDOne__localeObserver2.disconnect = () => {
                disconnected2 = true;
                dummyDOne__localeObserver2_disconnect.call(dummyDOne__localeObserver2);
              };

              expect(disconnected1).to.equal(true);
              // new MutationObserver
              expect(!!dummyDOne__localeObserver2.disconnect).to.equal(true);
              // MutationObservers are different instances
              expect(dummyDOne__localeObserver2).to.not.equal(dummyDOne__localeObserver1);

              dummyDOne.remove();

              expect(disconnected2).to.equal(true);
              expect(dummyDOne._localeObserver).to.equal(null);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);

            });

            DummyD.registerSelf();
          }
        });
      });
  });

  describe(`
  when top most dbui ancestor becomes descendant
  and when dbui descendant becomes top most dbui ancestor
  `, () => {
      describe(`
      when sync-locale-with is NOT specified
      `, () => {
          it(`
          syncs locale with closest dbui parent when becoming descendant
          and syncs locale with html root when becoming dbui root
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                    <dummy-d id="dummy-d-two">
                      <dummy-d id="dummy-d-three">
                      </dummy-d>
                    </dummy-d>
                  </dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const html = contentWindow.document.querySelector('html');
                  const container = contentWindow.document.querySelector('#container');
                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                  const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
                  const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    const test = ({
                      oneDir, oneLang, twoDir, twoLang, threeDir, threeLang
                    }) => {
                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                      expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                      expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                      expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                      expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                    };

                    html.dir = 'abc';
                    html.lang = 'ab';

                    test({
                      oneDir: 'bcd', oneLang: 'bc', twoDir: 'bcd', twoLang: 'bc', threeDir: 'bcd', threeLang: 'bc'
                    });

                    container.appendChild(dummyDTwo);

                    test({
                      oneDir: 'bcd', oneLang: 'bc', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab'
                    });

                    dummyDOne.appendChild(dummyDTwo);

                    test({
                      oneDir: 'bcd', oneLang: 'bc', twoDir: 'bcd', twoLang: 'bc', threeDir: 'bcd', threeLang: 'bc'
                    });

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);

                  });

                  DummyD.registerSelf();
                }
              });
            });
        });

      describe(`
      when sync-locale-with IS specified
      `, () => {
          it(`
          continue syncing with localeTarget
          `, (done) => {
              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  <div id="locale-provider" dir="abc" lang="ab"></div>
                  <dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                    <dummy-d id="dummy-d-two" sync-locale-with="#locale-provider">
                      <dummy-d id="dummy-d-three">
                      </dummy-d>
                    </dummy-d>
                  </dummy-d>
                </div>
                `,
                onLoad: ({ contentWindow, iframe }) => {
                  const DummyD = getDummyD(contentWindow);

                  const container = contentWindow.document.querySelector('#container');
                  const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
                  const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
                  const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

                  Promise.all([
                    DummyD.registrationName,
                  ].map((localName) => contentWindow.customElements.whenDefined(localName)
                  )).then(() => {

                    const test = ({
                      oneDir, oneLang, twoDir, twoLang, threeDir, threeLang
                    }) => {
                      expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                      expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                      expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                      expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                      expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                      expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                    };

                    test({
                      oneDir: 'bcd', oneLang: 'bc', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab'
                    });

                    container.appendChild(dummyDTwo);

                    test({
                      oneDir: 'bcd', oneLang: 'bc', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab'
                    });

                    dummyDOne.appendChild(dummyDTwo);

                    test({
                      oneDir: 'bcd', oneLang: 'bc', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab'
                    });

                    setTimeout(() => {
                      iframe.remove();
                      done();
                    }, 0);

                  });

                  DummyD.registerSelf();
                }
              });
            });
        });
    });

});
