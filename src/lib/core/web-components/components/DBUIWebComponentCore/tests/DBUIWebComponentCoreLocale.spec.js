import { expect } from 'chai';

import inIframe from '../../../../../../../testUtils/inIframe';

import {
  getBase,
  getDummyA,
  getDummyB,
  getDummyC,
  getDummyD,
  getDummyE,
  treeOne,
  treeOneGetDbuiNodes,
  getDBUIWebComponentRoot,
  treeStyle
} from './DBUITestTreeSetup.forSpec';
import monkeyPatch from '../../../../../../../testUtils/monkeyPatch';

const treeWithLocale = `
<dbui-web-component-root id="dbui-web-component-root">
<div id="container">
  <dbui-dummy-d dir="rtl" lang="it" id="light-dummy-d-one-root">
    <ul slot="named-slot" id="ul1">
      <li id="ul1-li1">
        <dbui-dummy-e id="light-dummy-e-in-named-slot"></dbui-dummy-e>
      </li>
    </ul>
    <ul id="ul2">
      <li id="ul2-li1">
        <dbui-dummy-d id="light-dummy-d-two-in-default-slot">
          <ul id="ul2-li1-ul1">
            <li id="ul2-li1-ul1-li1">
              <dbui-dummy-d dir="xyz" lang="de" id="light-dummy-d-three-in-default-slot">
                <ul id="ul2-li1-ul1-li1-ul1">
                  <li id="ul2-li1-ul1-li1-ul1-li1">
                    <dbui-dummy-e id="light-dummy-e-in-default-slot"></dbui-dummy-e>
                  </li>
                </ul>
              </dbui-dummy-d>
            </li>
          </ul>
        </dbui-dummy-d>
      </li>
    </ul>
  </dbui-dummy-d>
</div>
</dbui-web-component-root>
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
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
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
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          container.innerHTML = treeOne;

          const allDbuiNodes = treeOneGetDbuiNodes(contentWindow);
          const { dbuiWebComponentRoot: _, ...dbuiNodes } = allDbuiNodes;
          // the default
          Object.keys(dbuiNodes).forEach((key) => {
            const node = dbuiNodes[key];
            expect(node.getAttribute('dbui-dir')).to.equal('ltr');
            expect(node.getAttribute('dbui-lang')).to.equal('en');
            expect(node.__prevDir).to.equal(null);
            expect(node.__newDir).to.equal('ltr');
            expect(node.__prevLang).to.equal(null);
            expect(node.__newLang).to.equal('en');
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
            expect(node.__prevDir).to.equal('ltr');
            expect(node.__newDir).to.equal('rtl');
            expect(node.__prevLang).to.equal('en');
            expect(node.__newLang).to.equal('vr');
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
            expect(node.__prevDir).to.equal('rtl');
            expect(node.__newDir).to.equal('ltr');
            expect(node.__prevLang).to.equal('vr');
            expect(node.__newLang).to.equal('en');
          });

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DummyE.registerSelf();
        DBUIRoot.registerSelf();
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
      <dbui-web-component-root id="dbui-web-component-root">
        <div id="container">
          <dbui-dummy-d id="dummy-d-one" dir="rtl" lang="sp"></dbui-dummy-d>
        </div>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DummyD = getDummyD(contentWindow);
        const DummyE = getDummyE(contentWindow);

        const container = contentWindow.document.querySelector('#container');
        const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
        const dummyDTwo = contentWindow.document.createElement('dbui-dummy-d');

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
        expect(dummyDOne.__newDir).to.equal(undefined);
        expect(dummyDOne.__prevDir).to.equal(undefined);

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
          DBUIRoot.registrationName
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          // After upgrade internal locale attributes (dbui-dir/dbui-lang)
          // are synced with public locale attributes (dir/lang).
          expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
          expect(dummyDOne.getAttribute('dbui-lang')).to.equal('sp');
          expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('abc');
          expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('xy');
          expect(dummyDOne.__newDir).to.equal('rtl');
          expect(dummyDOne.__prevDir).to.equal(null);
          expect(dummyDOne.__newLang).to.equal('sp');
          expect(dummyDOne.__prevLang).to.equal(null);
          expect(dummyDTwo.__newDir).to.equal('abc');
          expect(dummyDTwo.__prevDir).to.equal(null);
          expect(dummyDTwo.__newLang).to.equal('xy');
          expect(dummyDTwo.__prevLang).to.equal(null);

          dummyDOne.setAttribute('dir', '');
          dummyDOne.removeAttribute('lang');
          dummyDTwo.dir = '';
          dummyDTwo.lang = '';

          // back to default
          expect(dummyDOne.getAttribute('dbui-dir')).to.equal('ltr');
          expect(dummyDOne.getAttribute('dbui-lang')).to.equal('en');
          expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('ltr');
          expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('en');
          expect(dummyDOne.__newDir).to.equal('ltr');
          expect(dummyDOne.__prevDir).to.equal('rtl');
          expect(dummyDOne.__newLang).to.equal('en');
          expect(dummyDOne.__prevLang).to.equal('sp');
          expect(dummyDTwo.__newDir).to.equal('ltr');
          expect(dummyDTwo.__prevDir).to.equal('abc');
          expect(dummyDTwo.__newLang).to.equal('en');
          expect(dummyDTwo.__prevLang).to.equal('xy');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DummyE.registerSelf();
        DBUIRoot.registerSelf();
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

        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const Base = getBase(contentWindow);
        const DummyD = getDummyD(contentWindow);
        const DummyE = getDummyE(contentWindow);

        Promise.all([
          DBUIRoot.registrationName
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
            expect(lightDummyDOneRoot.__newDir).to.equal(firstHalfDir);
            expect(lightDummyDOneRoot.__newLang).to.equal(firstHalfLang);

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
                expect(node.__newDir).to.equal(firstHalfDir);
                expect(node.__newLang).to.equal(firstHalfLang);
              });

            expect(lightDummyDThreeInDefaultSlot.getAttribute('dbui-dir')).to.equal(secondHalfDir);
            expect(lightDummyDThreeInDefaultSlot.getAttribute('dbui-lang')).to.equal(secondHalfLang);
            expect(lightDummyDThreeInDefaultSlot.__newDir).to.equal(secondHalfDir);
            expect(lightDummyDThreeInDefaultSlot.__newLang).to.equal(secondHalfLang);

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
                expect(node.__newDir).to.equal(secondHalfDir);
                expect(node.__newLang).to.equal(secondHalfLang);
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

        DummyD.registerSelf();
        DummyE.registerSelf();
        DBUIRoot.registerSelf();
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
      <dbui-web-component-root id="dbui-web-component-root" dir="aaa" lang="bb">
        <div id="container">
          <dbui-dummy-d id="dummy-d-outer" lang="it">
            <div dir="rtl" lang="fr">
              <dbui-dummy-d id="dummy-d-inner"></dbui-dummy-d>
            </div>
          </dbui-dummy-d>
        </div>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DummyD = getDummyD(contentWindow);

        const dummyDOuter = contentWindow.document.querySelector('#dummy-d-outer');
        const dummyDInner = contentWindow.document.querySelector('#dummy-d-inner');

        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('aaa');
          expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('it');
          // dummyDInner is NOT top most ancestor so it does not look for surrounding locale
          // but it gets it via context from closetDbuiParent.
          expect(dummyDInner.getAttribute('dbui-dir')).to.equal('aaa');
          expect(dummyDInner.getAttribute('dbui-lang')).to.equal('it');
          expect(dummyDOuter.__newDir).to.equal('aaa');
          expect(dummyDOuter.__prevDir).to.equal(null);
          expect(dummyDOuter.__newLang).to.equal('it');
          expect(dummyDOuter.__prevLang).to.equal(null);
          expect(dummyDInner.__newDir).to.equal('aaa');
          expect(dummyDInner.__prevDir).to.equal(null);
          expect(dummyDInner.__newLang).to.equal('it');
          expect(dummyDInner.__prevLang).to.equal('bb');


          dummyDInner.setAttribute('dir', 'abc');
          dummyDInner.setAttribute('lang', 'de');

          expect(dummyDInner.getAttribute('dbui-dir')).to.equal('abc');
          expect(dummyDInner.getAttribute('dbui-lang')).to.equal('de');
          expect(dummyDInner.__newDir).to.equal('abc');
          expect(dummyDInner.__prevDir).to.equal('aaa');
          expect(dummyDInner.__newLang).to.equal('de');
          expect(dummyDInner.__prevLang).to.equal('it');

          dummyDInner.removeAttribute('dir');
          dummyDInner.removeAttribute('lang');
          // expect locale to be re-read from from closetDbuiParent
          // and not from closest surrounding locale

          expect(dummyDInner.getAttribute('dbui-dir')).to.equal('aaa');
          // expect(dummyDInner.getAttribute('dbui-lang')).to.equal('it');
          expect(dummyDInner.__newDir).to.equal('aaa');
          expect(dummyDInner.__prevDir).to.equal('abc');
          expect(dummyDInner.__newLang).to.equal('it');
          expect(dummyDInner.__prevLang).to.equal('de');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DummyD.registerSelf();
        DBUIRoot.registerSelf();
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
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="container">
            <div id="locale-provider"></div>
            <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dbui-dummy-d>
            <dbui-dummy-d id="dummy-d-two"></dbui-dummy-d>
          </div>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyD = getDummyD(contentWindow);

          const html = contentWindow.document.querySelector('html');
          const localeProvider = contentWindow.document.querySelector('#locale-provider');
          const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
          const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

          Promise.all([
            DBUIRoot.registrationName,
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
          DBUIRoot.registerSelf();
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
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="container">
            <div id="locale-provider"></div>
            <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dbui-dummy-d>
            <dbui-dummy-d id="dummy-d-two"></dbui-dummy-d>
          </div>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyD = getDummyD(contentWindow);

          const html = contentWindow.document.querySelector('html');
          html.setAttribute('lang', 'it');
          html.setAttribute('dir', 'rtl');
          const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
          const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

          Promise.all([
            DBUIRoot.registrationName,
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
          DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <div id="locale-provider" dir="abc" lang="de"></div>
              <dbui-dummy-d id="dummy-d-one" dir="rtl" lang="it" sync-locale-with="#locale-provider"></dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const container = contentWindow.document.querySelector('#container');
            const localeProvider = contentWindow.document.querySelector('#locale-provider');
            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDOne.__newDir).to.equal('rtl');
              expect(dummyDOne.__prevDir).to.equal(null);
              expect(dummyDOne.__newLang).to.equal('it');
              expect(dummyDOne.__prevLang).to.equal(null);
              expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'it' });

              dummyDOne.remove();

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDOne.__newDir).to.equal('rtl');
              expect(dummyDOne.__prevDir).to.equal(null);
              expect(dummyDOne.__newLang).to.equal('it');
              expect(dummyDOne.__prevLang).to.equal(null);
              expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'it' });

              localeProvider.lang = 'pq';
              container.appendChild(dummyDOne);

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDOne.__newDir).to.equal('rtl');
              expect(dummyDOne.__prevDir).to.equal(null);
              expect(dummyDOne.__newLang).to.equal('it');
              expect(dummyDOne.__prevLang).to.equal(null);
              expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'it' });

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <div id="locale-provider" dir="rtl" lang="it"></div>
              <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const container = contentWindow.document.querySelector('#container');
            const localeProvider = contentWindow.document.querySelector('#locale-provider');
            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDOne.__newDir).to.equal('rtl');
              expect(dummyDOne.__prevDir).to.equal('ltr');
              expect(dummyDOne.__newLang).to.equal('it');
              expect(dummyDOne.__prevLang).to.equal('en');
              expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'it' });

              dummyDOne.remove();

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal(null);
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal(null);
              expect(dummyDOne.__newDir).to.equal(null);
              expect(dummyDOne.__prevDir).to.equal('rtl');
              expect(dummyDOne.__newLang).to.equal(null);
              expect(dummyDOne.__prevLang).to.equal('it');
              expect(dummyDOne._providingContext).to.deep.equal({});

              localeProvider.lang = 'de';
              container.appendChild(dummyDOne);

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('de');
              expect(dummyDOne.__newDir).to.equal('rtl');
              expect(dummyDOne.__prevDir).to.equal('ltr');
              expect(dummyDOne.__newLang).to.equal('de');
              expect(dummyDOne.__prevLang).to.equal('en');
              expect(dummyDOne._providingContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'de' });

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="container">
            <div id="locale-provider" dir="rtl" lang="it"></div>
            <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dbui-dummy-d>
          </div>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyD = getDummyD(contentWindow);

          const container = contentWindow.document.querySelector('#container');
          const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

          Promise.all([
            DBUIRoot.registrationName,
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
          DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <div id="locale-provider" dir="rtl" lang="it"></div>
              <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider"></dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const container = contentWindow.document.querySelector('#container');
            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('rtl');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('it');
              expect(dummyDOne.__newDir).to.equal('rtl');
              expect(dummyDOne.__prevDir).to.equal('ltr');
              expect(dummyDOne.__newLang).to.equal('it');
              expect(dummyDOne.__prevLang).to.equal('en');

              dummyDOne.remove();

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal(null);
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal(null);
              expect(dummyDOne._providingContext.dbuiDir).to.equal(undefined);
              expect(dummyDOne._providingContext.dbuiLang).to.equal(undefined);
              expect(dummyDOne.__newDir).to.equal(null);
              expect(dummyDOne.__prevDir).to.equal('rtl');
              expect(dummyDOne.__newLang).to.equal(null);
              expect(dummyDOne.__prevLang).to.equal('it');

              container.appendChild(dummyDOne);

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('rtl');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('it');
              expect(dummyDOne.__newDir).to.equal('rtl');
              expect(dummyDOne.__prevDir).to.equal('ltr');
              expect(dummyDOne.__newLang).to.equal('it');
              expect(dummyDOne.__prevLang).to.equal('en');

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <div id="locale-provider1" dir="rtl" lang="it"></div>
              <div id="locale-provider2" dir="abc" lang="ab"></div>
              <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider1"></dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('rtl');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('it');
              expect(dummyDOne.__newDir).to.equal('rtl');
              expect(dummyDOne.__prevDir).to.equal('ltr');
              expect(dummyDOne.__newLang).to.equal('it');
              expect(dummyDOne.__prevLang).to.equal('en');

              dummyDOne.setAttribute('sync-locale-with', '#locale-provider2');

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('ab');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('ab');
              expect(dummyDOne.__newDir).to.equal('abc');
              expect(dummyDOne.__prevDir).to.equal('rtl');
              expect(dummyDOne.__newLang).to.equal('ab');
              expect(dummyDOne.__prevLang).to.equal('it');

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
              <dbui-web-component-root id="dbui-web-component-root" sync-locale-with="#non-existing">
              </dbui-web-component-root>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
              const DummyD = getDummyD(contentWindow);

              monkeyPatch(DBUIRoot).proto.set('onLocaleDirChanged', (getSuperDescriptor) => {
                return {
                  writable: true,
                  value(newDir, prevDir) {
                    getSuperDescriptor().value.call(this, newDir, prevDir);
                    this.__newDir = newDir;
                    this.__prevDir = prevDir;
                  }
                };
              });

              monkeyPatch(DBUIRoot).proto.set('onLocaleLangChanged', (getSuperDescriptor) => {
                return {
                  writable: true,
                  value(newLang, prevLang) {
                    getSuperDescriptor().value.call(this, newLang, prevLang);
                    this.__newLang = newLang;
                    this.__prevLang = prevLang;
                  }
                };
              });

              const dbuiRoot = contentWindow.document.querySelector('#dbui-web-component-root');
              const html = contentWindow.document.querySelector('html');
              html.dir = 'abc';
              html.lang = 'bc';

              Promise.all([
                DBUIRoot.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                expect(dbuiRoot.getAttribute('dbui-dir')).to.equal('abc');
                expect(dbuiRoot.getAttribute('dbui-lang')).to.equal('bc');
                expect(dbuiRoot._providingContext.dbuiDir).to.equal('abc');
                expect(dbuiRoot._providingContext.dbuiLang).to.equal('bc');
                expect(dbuiRoot.__newDir).to.equal('abc');
                expect(dbuiRoot.__prevDir).to.equal(null);
                expect(dbuiRoot.__newLang).to.equal('bc');
                expect(dbuiRoot.__prevLang).to.equal(null);

                dbuiRoot.setAttribute('sync-locale-with', '#locale-provider1');

                expect(dbuiRoot.getAttribute('dbui-dir')).to.equal('rtl');
                expect(dbuiRoot.getAttribute('dbui-lang')).to.equal('it');
                expect(dbuiRoot._providingContext.dbuiDir).to.equal('rtl');
                expect(dbuiRoot._providingContext.dbuiLang).to.equal('it');
                expect(dbuiRoot.__newDir).to.equal('rtl');
                expect(dbuiRoot.__prevDir).to.equal('abc');
                expect(dbuiRoot.__newLang).to.equal('it');
                expect(dbuiRoot.__prevLang).to.equal('bc');

                html.dir = 'bcd';
                html.lang = 'cd';
                dbuiRoot.setAttribute('sync-locale-with', '#not-existing');

                expect(dbuiRoot.getAttribute('dbui-dir')).to.equal('bcd');
                expect(dbuiRoot.getAttribute('dbui-lang')).to.equal('cd');
                expect(dbuiRoot._providingContext.dbuiDir).to.equal('bcd');
                expect(dbuiRoot._providingContext.dbuiLang).to.equal('cd');
                expect(dbuiRoot.__newDir).to.equal('bcd');
                expect(dbuiRoot.__prevDir).to.equal('rtl');
                expect(dbuiRoot.__newLang).to.equal('cd');
                expect(dbuiRoot.__prevLang).to.equal('it');

                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 0);
              });

              DummyD.registerSelf();
              DBUIRoot.registerSelf();
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
            <dbui-web-component-root id="dbui-web-component-root">
              <div id="container">
                <div id="locale-provider1" dir="rtl" lang="it"></div>
                <dbui-dummy-d id="dummy-d-outer" sync-locale-with="#non-existing">
                  <dbui-dummy-d id="dummy-d-one" sync-locale-with="#non-existing"></dbui-dummy-d>
                </dbui-dummy-d>
              </div>
            </dbui-web-component-root>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
              const DummyD = getDummyD(contentWindow);

              const dummyRoot = contentWindow.document.querySelector('#dbui-web-component-root');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDOuter = contentWindow.document.querySelector('#dummy-d-outer');
              const html = contentWindow.document.querySelector('html');
              html.dir = 'abc';
              html.lang = 'bc';

              Promise.all([
                DBUIRoot.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                expect(dummyRoot._localeTarget).to.equal(html);
                expect(dummyDOne._localeTarget).to.equal(html);
                expect(dummyDOuter._localeTarget).to.equal(html);

                expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('abc');
                expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('bc');
                expect(dummyDOuter._providingContext.dbuiDir).to.equal('abc');
                expect(dummyDOuter._providingContext.dbuiLang).to.equal('bc');
                expect(dummyDOuter.__newDir).to.equal('abc');
                expect(dummyDOuter.__prevDir).to.equal(null);
                expect(dummyDOuter.__newLang).to.equal('bc');
                expect(dummyDOuter.__prevLang).to.equal(null);

                expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
                expect(dummyDOne.getAttribute('dbui-lang')).to.equal('bc');
                expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
                expect(dummyDOne._providingContext.dbuiLang).to.equal('bc');
                expect(dummyDOne.__newDir).to.equal('abc');
                expect(dummyDOne.__prevDir).to.equal(null);
                expect(dummyDOne.__newLang).to.equal('bc');
                expect(dummyDOne.__prevLang).to.equal(null);

                html.setAttribute('dir', 'bcd');
                html.setAttribute('lang', 'cd');

                setTimeout(() => {
                  expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('bcd');
                  expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('cd');
                  expect(dummyDOuter._providingContext.dbuiDir).to.equal('bcd');
                  expect(dummyDOuter._providingContext.dbuiLang).to.equal('cd');
                  expect(dummyDOuter.__newDir).to.equal('bcd');
                  expect(dummyDOuter.__prevDir).to.equal('abc');
                  expect(dummyDOuter.__newLang).to.equal('cd');
                  expect(dummyDOuter.__prevLang).to.equal('bc');

                  expect(dummyDOne.getAttribute('dbui-dir')).to.equal('bcd');
                  expect(dummyDOne.getAttribute('dbui-lang')).to.equal('cd');
                  expect(dummyDOne._providingContext.dbuiDir).to.equal('bcd');
                  expect(dummyDOne._providingContext.dbuiLang).to.equal('cd');
                  expect(dummyDOne.__newDir).to.equal('bcd');
                  expect(dummyDOne.__prevDir).to.equal('abc');
                  expect(dummyDOne.__newLang).to.equal('cd');
                  expect(dummyDOne.__prevLang).to.equal('bc');

                  setTimeout(() => {
                    iframe.remove();
                    done();
                  }, 0);
                }, 0);
              });

              DummyD.registerSelf();
              DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <div id="locale-provider" dir="rtl" lang="it"></div>
              <dbui-dummy-d id="dummy-d-one" dir="abc" lang="ab">
                <dbui-dummy-d id="dummy-d-two" sync-locale-with="#locale-provider">
                  <dbui-dummy-d id="dummy-d-three"></dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
            const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('ab');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('ab');
              expect(dummyDOne.__newDir).to.equal('abc');
              expect(dummyDOne.__prevDir).to.equal(null);
              expect(dummyDOne.__newLang).to.equal('ab');
              expect(dummyDOne.__prevLang).to.equal(null);

              expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDTwo._providingContext.dbuiDir).to.equal('rtl');
              expect(dummyDTwo._providingContext.dbuiLang).to.equal('it');
              expect(dummyDTwo.__newDir).to.equal('rtl');
              expect(dummyDTwo.__prevDir).to.equal('ltr');
              expect(dummyDTwo.__newLang).to.equal('it');
              expect(dummyDTwo.__prevLang).to.equal('en');

              expect(dummyDThree.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDThree.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('rtl');
              expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('it');
              expect(dummyDThree.__newDir).to.equal('rtl');
              expect(dummyDThree.__prevDir).to.equal(null);
              expect(dummyDThree.__newLang).to.equal('it');
              expect(dummyDThree.__prevLang).to.equal(null);

              dummyDOne.dir = 'bcd';
              dummyDOne.lang = 'cd';

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('bcd');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('cd');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('bcd');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('cd');
              expect(dummyDOne.__newDir).to.equal('bcd');
              expect(dummyDOne.__prevDir).to.equal('abc');
              expect(dummyDOne.__newLang).to.equal('cd');
              expect(dummyDOne.__prevLang).to.equal('ab');

              expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDTwo._providingContext.dbuiDir).to.equal('rtl');
              expect(dummyDTwo._providingContext.dbuiLang).to.equal('it');
              expect(dummyDTwo.__newDir).to.equal('rtl');
              expect(dummyDTwo.__prevDir).to.equal('ltr'); // due to no actual change
              expect(dummyDTwo.__newLang).to.equal('it');
              expect(dummyDTwo.__prevLang).to.equal('en');

              expect(dummyDThree.getAttribute('dbui-dir')).to.equal('rtl');
              expect(dummyDThree.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('rtl');
              expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('it');
              expect(dummyDThree.__newDir).to.equal('rtl');
              expect(dummyDThree.__prevDir).to.equal(null); // due to no actual change
              expect(dummyDThree.__newLang).to.equal('it');
              expect(dummyDThree.__prevLang).to.equal(null);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <dbui-dummy-d id="dummy-d-one" dir="abc" lang="ab">
                <dbui-dummy-d id="dummy-d-two" dir="bcd">
                  <dbui-dummy-d id="dummy-d-three"></dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
            const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('ab');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('ab');
              expect(dummyDOne.__newDir).to.equal('abc');
              expect(dummyDOne.__prevDir).to.equal(null);
              expect(dummyDOne.__newLang).to.equal('ab');
              expect(dummyDOne.__prevLang).to.equal(null);

              expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('bcd');
              expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('ab');
              expect(dummyDTwo._providingContext.dbuiDir).to.equal('bcd');
              expect(dummyDTwo._providingContext.dbuiLang).to.equal(undefined);
              expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('ab');
              expect(dummyDTwo.__newDir).to.equal('bcd');
              expect(dummyDTwo.__prevDir).to.equal(null);
              expect(dummyDTwo.__newLang).to.equal('ab');
              expect(dummyDTwo.__prevLang).to.equal('en');

              expect(dummyDThree.getAttribute('dbui-dir')).to.equal('bcd');
              expect(dummyDThree.getAttribute('dbui-lang')).to.equal('ab');
              expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('bcd');
              expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('ab');
              expect(dummyDThree.__newDir).to.equal('bcd');
              expect(dummyDThree.__prevDir).to.equal('ltr');
              expect(dummyDThree.__newLang).to.equal('ab');
              expect(dummyDThree.__prevLang).to.equal('en');

              dummyDOne.dir = 'cde';
              dummyDOne.lang = 'de';

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('cde');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('de');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('cde');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('de');
              expect(dummyDOne.__newDir).to.equal('cde');
              expect(dummyDOne.__prevDir).to.equal('abc');
              expect(dummyDOne.__newLang).to.equal('de');
              expect(dummyDOne.__prevLang).to.equal('ab');

              expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('bcd');
              expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('de');
              expect(dummyDTwo._providingContext.dbuiDir).to.equal('bcd');
              expect(dummyDTwo._providingContext.dbuiLang).to.equal(undefined);
              expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('de');
              expect(dummyDTwo.__newDir).to.equal('bcd');
              expect(dummyDTwo.__prevDir).to.equal(null);
              expect(dummyDTwo.__newLang).to.equal('de');
              expect(dummyDTwo.__prevLang).to.equal('ab');

              expect(dummyDThree.getAttribute('dbui-dir')).to.equal('bcd');
              expect(dummyDThree.getAttribute('dbui-lang')).to.equal('de');
              expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('bcd');
              expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('de');
              expect(dummyDThree.__newDir).to.equal('bcd');
              expect(dummyDThree.__prevDir).to.equal('ltr');
              expect(dummyDThree.__newLang).to.equal('de');
              expect(dummyDThree.__prevLang).to.equal('ab');

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <dbui-dummy-d id="dummy-d-one" dir="abc" lang="ab">
                <dbui-dummy-d id="dummy-d-two">
                  <dbui-dummy-d id="dummy-d-three"></dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
            const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('abc');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('ab');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('abc');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('ab');
              expect(dummyDOne.__newDir).to.equal('abc');
              expect(dummyDOne.__prevDir).to.equal(null);
              expect(dummyDOne.__newLang).to.equal('ab');
              expect(dummyDOne.__prevLang).to.equal(null);

              expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('abc');
              expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('ab');
              expect(dummyDTwo._lastReceivedContext.dbuiDir).to.equal('abc');
              expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('ab');
              expect(dummyDTwo.__newDir).to.equal('abc');
              expect(dummyDTwo.__prevDir).to.equal('ltr');
              expect(dummyDTwo.__newLang).to.equal('ab');
              expect(dummyDTwo.__prevLang).to.equal('en');

              expect(dummyDThree.getAttribute('dbui-dir')).to.equal('abc');
              expect(dummyDThree.getAttribute('dbui-lang')).to.equal('ab');
              expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('abc');
              expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('ab');
              expect(dummyDThree.__newDir).to.equal('abc');
              expect(dummyDThree.__prevDir).to.equal('ltr');
              expect(dummyDThree.__newLang).to.equal('ab');
              expect(dummyDThree.__prevLang).to.equal('en');

              dummyDOne.dir = 'cde';
              dummyDOne.lang = 'de';

              expect(dummyDOne.getAttribute('dbui-dir')).to.equal('cde');
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal('de');
              expect(dummyDOne._providingContext.dbuiDir).to.equal('cde');
              expect(dummyDOne._providingContext.dbuiLang).to.equal('de');
              expect(dummyDOne.__newDir).to.equal('cde');
              expect(dummyDOne.__prevDir).to.equal('abc');
              expect(dummyDOne.__newLang).to.equal('de');
              expect(dummyDOne.__prevLang).to.equal('ab');

              expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('cde');
              expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('de');
              expect(dummyDTwo._lastReceivedContext.dbuiDir).to.equal('cde');
              expect(dummyDTwo._lastReceivedContext.dbuiLang).to.equal('de');
              expect(dummyDTwo.__newDir).to.equal('cde');
              expect(dummyDTwo.__prevDir).to.equal('abc');
              expect(dummyDTwo.__newLang).to.equal('de');
              expect(dummyDTwo.__prevLang).to.equal('ab');

              expect(dummyDThree.getAttribute('dbui-dir')).to.equal('cde');
              expect(dummyDThree.getAttribute('dbui-lang')).to.equal('de');
              expect(dummyDThree._lastReceivedContext.dbuiDir).to.equal('cde');
              expect(dummyDThree._lastReceivedContext.dbuiLang).to.equal('de');
              expect(dummyDThree.__newDir).to.equal('cde');
              expect(dummyDThree.__prevDir).to.equal('abc');
              expect(dummyDThree.__newLang).to.equal('de');
              expect(dummyDThree.__prevLang).to.equal('ab');

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <div id="locale-provider" dir="abc" lang="ab"></div>
              <dbui-dummy-d id="dummy-d-one">
                <dbui-dummy-d id="dummy-d-two" sync-locale-with="#locale-provider">
                  <dbui-dummy-d id="dummy-d-three"></dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
              <dbui-dummy-d id="dummy-d-four" dir="cde" lang="de">
                <dbui-dummy-d id="dummy-d-five">
                  <dbui-dummy-d id="dummy-d-six"></dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
            const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');
            const dummyDFour = contentWindow.document.querySelector('#dummy-d-four');
            const dummyDFive = contentWindow.document.querySelector('#dummy-d-five');
            const dummyDSix = contentWindow.document.querySelector('#dummy-d-six');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const test = ({
                oneDir, oneLang, twoDir, twoLang, threeDir, threeLang,
                fourDir, fourLang, fiveDir, fiveLang, sixDir, sixLang,

                oneDirPrev, oneLangPrev, twoDirPrev, twoLangPrev, threeDirPrev, threeLangPrev,
                fourDirPrev, fourLangPrev, fiveDirPrev, fiveLangPrev, sixDirPrev, sixLangPrev,
              }) => {
                expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                expect(dummyDOne.__newDir).to.equal(oneDir);
                expect(dummyDOne.__prevDir).to.equal(oneDirPrev);
                expect(dummyDOne.__newLang).to.equal(oneLang);
                expect(dummyDOne.__prevLang).to.equal(oneLangPrev);

                expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                expect(dummyDTwo.__newDir).to.equal(twoDir);
                expect(dummyDTwo.__prevDir).to.equal(twoDirPrev);
                expect(dummyDTwo.__newLang).to.equal(twoLang);
                expect(dummyDTwo.__prevLang).to.equal(twoLangPrev);

                expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                expect(dummyDThree.__newDir).to.equal(threeDir);
                expect(dummyDThree.__prevDir).to.equal(threeDirPrev);
                expect(dummyDThree.__newLang).to.equal(threeLang);
                expect(dummyDThree.__prevLang).to.equal(threeLangPrev);

                expect(dummyDFour.getAttribute('dbui-dir')).to.equal(fourDir);
                expect(dummyDFour.getAttribute('dbui-lang')).to.equal(fourLang);
                expect(dummyDFour.__newDir).to.equal(fourDir);
                expect(dummyDFour.__prevDir).to.equal(fourDirPrev);
                expect(dummyDFour.__newLang).to.equal(fourLang);
                expect(dummyDFour.__prevLang).to.equal(fourLangPrev);

                expect(dummyDFive.getAttribute('dbui-dir')).to.equal(fiveDir);
                expect(dummyDFive.getAttribute('dbui-lang')).to.equal(fiveLang);
                expect(dummyDFive.__newDir).to.equal(fiveDir);
                expect(dummyDFive.__prevDir).to.equal(fiveDirPrev);
                expect(dummyDFive.__newLang).to.equal(fiveLang);
                expect(dummyDFive.__prevLang).to.equal(fiveLangPrev);

                expect(dummyDSix.getAttribute('dbui-dir')).to.equal(sixDir);
                expect(dummyDSix.getAttribute('dbui-lang')).to.equal(sixLang);
                expect(dummyDSix.__newDir).to.equal(sixDir);
                expect(dummyDSix.__prevDir).to.equal(sixDirPrev);
                expect(dummyDSix.__newLang).to.equal(sixLang);
                expect(dummyDSix.__prevLang).to.equal(sixLangPrev);
              };

              /* eslint object-property-newline: 0 */
              test({
                oneDir: 'ltr', oneLang: 'en', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab',
                fourDir: 'cde', fourLang: 'de', fiveDir: 'cde', fiveLang: 'de', sixDir: 'cde', sixLang: 'de',

                oneDirPrev: null, oneLangPrev: null, twoDirPrev: 'ltr', twoLangPrev: 'en', threeDirPrev: null, threeLangPrev: null,
                fourDirPrev: null, fourLangPrev: null, fiveDirPrev: 'ltr', fiveLangPrev: 'en', sixDirPrev: 'ltr', sixLangPrev: 'en',
              });

              dummyDTwo.dir = 'efg';
              dummyDTwo.lang = 'ef';
              dummyDFive.dir = 'fgh';
              dummyDFive.lang = 'fg';

              test({
                oneDir: 'ltr', oneLang: 'en', twoDir: 'efg', twoLang: 'ef', threeDir: 'efg', threeLang: 'ef',
                fourDir: 'cde', fourLang: 'de', fiveDir: 'fgh', fiveLang: 'fg', sixDir: 'fgh', sixLang: 'fg',

                oneDirPrev: null, oneLangPrev: null, twoDirPrev: 'abc', twoLangPrev: 'ab', threeDirPrev: 'abc', threeLangPrev: 'ab',
                fourDirPrev: null, fourLangPrev: null, fiveDirPrev: 'cde', fiveLangPrev: 'de', sixDirPrev: 'cde', sixLangPrev: 'de',
              });

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <div id="locale-provider" dir="abc" lang="ab"></div>
              <dbui-dummy-d id="dummy-d-one">
                <dbui-dummy-d id="dummy-d-two" dir="bcd" lang="bc" sync-locale-with="#locale-provider">
                  <dbui-dummy-d id="dummy-d-three"></dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const localeProvider = contentWindow.document.querySelector('#locale-provider');
            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
            const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const test = ({
                oneDir, oneLang, twoDir, twoLang, threeDir, threeLang,
                oneDirPrev, oneLangPrev, twoDirPrev, twoLangPrev, threeDirPrev, threeLangPrev
              }) => {
                expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                expect(dummyDOne.__newDir).to.equal(oneDir);
                expect(dummyDOne.__prevDir).to.equal(oneDirPrev);
                expect(dummyDOne.__newLang).to.equal(oneLang);
                expect(dummyDOne.__prevLang).to.equal(oneLangPrev);

                expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                expect(dummyDTwo.__newDir).to.equal(twoDir);
                expect(dummyDTwo.__prevDir).to.equal(twoDirPrev);
                expect(dummyDTwo.__newLang).to.equal(twoLang);
                expect(dummyDTwo.__prevLang).to.equal(twoLangPrev);

                expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
                expect(dummyDThree.__newDir).to.equal(threeDir);
                expect(dummyDThree.__prevDir).to.equal(threeDirPrev);
                expect(dummyDThree.__newLang).to.equal(threeLang);
                expect(dummyDThree.__prevLang).to.equal(threeLangPrev);
              };

              test({
                oneDir: 'ltr', oneLang: 'en', twoDir: 'bcd', twoLang: 'bc', threeDir: 'bcd', threeLang: 'bc',
                oneDirPrev: null, oneLangPrev: null, twoDirPrev: null, twoLangPrev: null, threeDirPrev: null, threeLangPrev: null,
              });

              dummyDTwo.dir = '';
              dummyDTwo.lang = '';

              test({
                oneDir: 'ltr', oneLang: 'en', twoDir: 'abc', twoLang: 'ab', threeDir: 'abc', threeLang: 'ab',
                oneDirPrev: null, oneLangPrev: null, twoDirPrev: 'bcd', twoLangPrev: 'bc', threeDirPrev: 'bcd', threeLangPrev: 'bc',
              });

              localeProvider.dir = 'def';
              localeProvider.lang = 'de';

              setTimeout(() => {
                test({
                  oneDir: 'ltr', oneLang: 'en', twoDir: 'def', twoLang: 'de', threeDir: 'def', threeLang: 'de',
                  oneDirPrev: null, oneLangPrev: null, twoDirPrev: 'abc', twoLangPrev: 'ab', threeDirPrev: 'abc', threeLangPrev: 'ab',
                });

                iframe.remove();
                done();
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <dbui-dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                <dbui-dummy-d id="dummy-d-two" dir="cde" lang="cd">
                  <dbui-dummy-d id="dummy-d-three"></dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
            const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

            Promise.all([
              DBUIRoot.registrationName,
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
            DBUIRoot.registerSelf();
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
            <dbui-web-component-root id="dbui-web-component-root">
              <div id="container">
                <div id="locale-provider" dir="abc" lang="ab"></div>
                <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider">
                  <dbui-dummy-d id="dummy-d-two"></dbui-dummy-d>
                </dbui-dummy-d>
              </div>
            </dbui-web-component-root>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
              const DummyD = getDummyD(contentWindow);

              const localeProvider = contentWindow.document.querySelector('#locale-provider');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

              Promise.all([
                DBUIRoot.registrationName,
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
              DBUIRoot.registerSelf();
            }
          });
        });
      });

      describe('when node does NOT target another node for locale sync', () => {
        it('syncs with html node and monitors changes', (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <dbui-web-component-root id="dbui-web-component-root">
              <div id="container">
                <dbui-dummy-d id="dummy-d-one">
                  <dbui-dummy-d id="dummy-d-two"></dbui-dummy-d>
                </dbui-dummy-d>
              </div>
            </dbui-web-component-root>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
              const DummyD = getDummyD(contentWindow);

              const html = contentWindow.document.querySelector('html');
              const dummyRoot = contentWindow.document.querySelector('#dbui-web-component-root');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

              Promise.all([
                DBUIRoot.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                const test = ({
                  oneDir, oneLang, twoDir, twoLang
                }) => {
                  expect(dummyRoot.getAttribute('dbui-dir')).to.equal(oneDir);
                  expect(dummyRoot.getAttribute('dbui-lang')).to.equal(oneLang);
                  expect(dummyRoot.getAttribute('dbui-dir')).to.equal(twoDir);
                  expect(dummyRoot.getAttribute('dbui-lang')).to.equal(twoLang);
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
              DBUIRoot.registerSelf();
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
            <dbui-web-component-root id="dbui-web-component-root">
              <div id="container">
                <div id="locale-provider" dir="abc" lang="ab"></div>
                <dbui-dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                  <dbui-dummy-d id="dummy-d-two" sync-locale-with="#locale-provider">
                    <dbui-dummy-d id="dummy-d-three"></dbui-dummy-d>
                  </dbui-dummy-d>
                </dbui-dummy-d>
              </div>
            </dbui-web-component-root>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
              const DummyD = getDummyD(contentWindow);

              const localeProvider = contentWindow.document.querySelector('#locale-provider');
              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
              const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

              Promise.all([
                DBUIRoot.registrationName,
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
              DBUIRoot.registerSelf();
            }
          });
        });
      });

      describe('when node does NOT target another node for locale sync', () => {
        it('syncs with closestDbuiParent', (done) => {
          inIframe({
            headStyle: treeStyle,
            bodyHTML: `
            <dbui-web-component-root id="dbui-web-component-root">
              <div id="container">
                <dbui-dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                  <dbui-dummy-d id="dummy-d-two">
                    <dbui-dummy-d id="dummy-d-three"></dbui-dummy-d>
                  </dbui-dummy-d>
                </dbui-dummy-d>
              </div>
            </dbui-web-component-root>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
              const DummyD = getDummyD(contentWindow);

              const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
              const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
              const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

              Promise.all([
                DBUIRoot.registrationName,
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
              DBUIRoot.registerSelf();
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
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="container">
            <div id="locale-provider"></div>
            <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider">
              <dbui-dummy-d id="dummy-d-two">
              </dbui-dummy-d>
            </dbui-dummy-d>
          </div>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyD = getDummyD(contentWindow);

          const localeProvider = contentWindow.document.querySelector('#locale-provider');
          const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
          const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');

          Promise.all([
            DBUIRoot.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            const test = ({
              oneDir, oneLang, twoDir, twoLang,
              oneDirPrev, oneLangPrev, twoDirPrev, twoLangPrev
            }) => {
              expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
              expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
              expect(dummyDOne.__newDir).to.equal(oneDir);
              expect(dummyDOne.__prevDir).to.equal(oneDirPrev);
              expect(dummyDOne.__newLang).to.equal(oneLang);
              expect(dummyDOne.__prevLang).to.equal(oneLangPrev);

              expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
              expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
              expect(dummyDOne.__newDir).to.equal(twoDir);
              expect(dummyDOne.__prevDir).to.equal(twoDirPrev);
              expect(dummyDOne.__newLang).to.equal(twoLang);
              expect(dummyDOne.__prevLang).to.equal(twoLangPrev);
            };

            test({
              oneDir: 'ltr', oneLang: 'en', twoDir: 'ltr', twoLang: 'en',
              oneDirPrev: null, oneLangPrev: null, twoDirPrev: null, twoLangPrev: null
            });

            localeProvider.dir = 'cde';
            localeProvider.lang = 'cd';

            setTimeout(() => {
              test({
                oneDir: 'cde', oneLang: 'cd', twoDir: 'cde', twoLang: 'cd',
                oneDirPrev: 'ltr', oneLangPrev: 'en', twoDirPrev: 'ltr', twoLangPrev: 'en'
              });

              localeProvider.dir = '';
              localeProvider.lang = '';

              setTimeout(() => {
                // falls back to defaults
                test({
                  oneDir: 'ltr', oneLang: 'en', twoDir: 'ltr', twoLang: 'en',
                  oneDirPrev: 'cde', oneLangPrev: 'cd', twoDirPrev: 'cde', twoLangPrev: 'cd'
                });

                localeProvider.dir = 'def';
                localeProvider.lang = 'de';

                setTimeout(() => {
                  test({
                    oneDir: 'def', oneLang: 'de', twoDir: 'def', twoLang: 'de',
                    oneDirPrev: 'ltr', oneLangPrev: 'en', twoDirPrev: 'ltr', twoLangPrev: 'en'
                  });

                  iframe.remove();
                  done();
                }, 0);
              }, 0);
            }, 0);
          });

          DummyD.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });

    it(`
    resets previous _localeObserver
    `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="container">
            <div id="locale-provider1" dir="abc" lang="ab"></div>
            <div id="locale-provider2" dir="bcd" lang="bc"></div>
            <dbui-dummy-d id="dummy-d-one" sync-locale-with="#locale-provider1"></dbui-dummy-d>
          </div>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyD = getDummyD(contentWindow);

          const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');

          Promise.all([
            DBUIRoot.registrationName,
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
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe(`
  when ~top most dbui ancestor becomes descendant
  and when dbui descendant becomes ~top most dbui ancestor
  `, () => {
    describe(`
    when sync-locale-with is NOT specified
    `, () => {
      it(`
      syncs locale with closest dbui parent when becoming descendant
      and syncs locale with html root when becoming dbui ~root
      `, (done) => {
        inIframe({
          headStyle: treeStyle,
          bodyHTML: `
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <dbui-dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                <dbui-dummy-d id="dummy-d-two">
                  <dbui-dummy-d id="dummy-d-three">
                  </dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const html = contentWindow.document.querySelector('html');
            const container = contentWindow.document.querySelector('#container');
            const dummyRoot = contentWindow.document.querySelector('#dbui-web-component-root');
            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
            const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

            Promise.all([
              DBUIRoot.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const test = ({
                oneDir, oneLang, twoDir, twoLang, threeDir, threeLang
              }) => {
                expect(dummyRoot.getAttribute('dbui-dir')).to.equal('abc');
                expect(dummyRoot.getAttribute('dbui-lang')).to.equal('ab');
                expect(dummyDOne.getAttribute('dbui-dir')).to.equal(oneDir);
                expect(dummyDOne.getAttribute('dbui-lang')).to.equal(oneLang);
                expect(dummyDTwo.getAttribute('dbui-dir')).to.equal(twoDir);
                expect(dummyDTwo.getAttribute('dbui-lang')).to.equal(twoLang);
                expect(dummyDThree.getAttribute('dbui-dir')).to.equal(threeDir);
                expect(dummyDThree.getAttribute('dbui-lang')).to.equal(threeLang);
              };

              html.dir = 'abc';
              html.lang = 'ab';

              setTimeout(() => {
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
              }, 0);
            });

            DummyD.registerSelf();
            DBUIRoot.registerSelf();
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
          <dbui-web-component-root id="dbui-web-component-root">
            <div id="container">
              <div id="locale-provider" dir="abc" lang="ab"></div>
              <dbui-dummy-d id="dummy-d-one" dir="bcd" lang="bc">
                <dbui-dummy-d id="dummy-d-two" sync-locale-with="#locale-provider">
                  <dbui-dummy-d id="dummy-d-three">
                  </dbui-dummy-d>
                </dbui-dummy-d>
              </dbui-dummy-d>
            </div>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyD = getDummyD(contentWindow);

            const container = contentWindow.document.querySelector('#container');
            const dummyDOne = contentWindow.document.querySelector('#dummy-d-one');
            const dummyDTwo = contentWindow.document.querySelector('#dummy-d-two');
            const dummyDThree = contentWindow.document.querySelector('#dummy-d-three');

            Promise.all([
              DBUIRoot.registrationName,
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
            DBUIRoot.registerSelf();
          }
        });
      });
    });
  });

});
