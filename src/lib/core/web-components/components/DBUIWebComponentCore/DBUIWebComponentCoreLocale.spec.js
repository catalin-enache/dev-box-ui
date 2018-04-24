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
  it captures locale from closest ancestor having locale defined
  if locale value no defined on self
  `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          <div dir="abc" lang="ab">
            <div id="box1"></div>
            <div id="box2" dir="def"></div>
            <div id="box3" lang="cd"></div>
            <div id="box4" dir="ghi" lang="de"></div>
          </div>
          <div id="box5"></div>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          const box1 = contentWindow.document.querySelector('#box1');
          const box2 = contentWindow.document.querySelector('#box2');
          const box3 = contentWindow.document.querySelector('#box3');
          const box4 = contentWindow.document.querySelector('#box4');
          const box5 = contentWindow.document.querySelector('#box5');

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            const doTest = ({
              firstSectionDir,
              firstSectionLang,
              secondSectionDir,
              secondSectionLang,
              dbuiNodes = treeOneGetDbuiNodes(contentWindow)
            }) => {
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

              const firstSection = [
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
                lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA
              ];

              const secondSection = [
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
              ];

              firstSection.forEach((node) => {
                expect(node.getAttribute('dbui-dir')).to.equal(firstSectionDir);
                expect(node.getAttribute('dbui-lang')).to.equal(firstSectionLang);
              });

              secondSection.forEach((node) => {
                expect(node.getAttribute('dbui-dir')).to.equal(secondSectionDir);
                expect(node.getAttribute('dbui-lang')).to.equal(secondSectionLang);
              });
            };

            box1.innerHTML = treeOne;

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);

            doTest({
              firstSectionDir: 'abc',
              firstSectionLang: 'ab',
              secondSectionDir: 'abc',
              secondSectionLang: 'ab',
              dbuiNodes
            });

            const {
              lightDummyDOneRoot
            } = dbuiNodes;

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dir')).to.equal(null);
              expect(node.getAttribute('lang')).to.equal(null);
              if (node === lightDummyDOneRoot) {
                expect(node._providingContext).to.deep.equal({ dbuiDir: 'abc', dbuiLang: 'ab' });
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({ dbuiDir: 'abc', dbuiLang: 'ab' });
              }
            });

            lightDummyDOneRoot.remove();

            doTest({
              firstSectionDir: null,
              firstSectionLang: null,
              secondSectionDir: null,
              secondSectionLang: null,
              dbuiNodes
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dir')).to.equal(null);
              expect(node.getAttribute('lang')).to.equal(null);
              if (node === lightDummyDOneRoot) {
                expect(node._providingContext).to.deep.equal({}); // reset by _resetLocale
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({});// reset by _resetContext
              }
            });

            box2.appendChild(lightDummyDOneRoot);

            doTest({
              firstSectionDir: 'def',
              firstSectionLang: 'ab',
              secondSectionDir: 'def',
              secondSectionLang: 'ab',
              dbuiNodes
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dir')).to.equal(null);
              expect(node.getAttribute('lang')).to.equal(null);
              if (node === lightDummyDOneRoot) {
                expect(node._providingContext).to.deep.equal({ dbuiDir: 'def', dbuiLang: 'ab' });
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({ dbuiDir: 'def', dbuiLang: 'ab' });
              }
            });

            box3.appendChild(lightDummyDOneRoot);

            doTest({
              firstSectionDir: 'abc',
              firstSectionLang: 'cd',
              secondSectionDir: 'abc',
              secondSectionLang: 'cd',
              dbuiNodes
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dir')).to.equal(null);
              expect(node.getAttribute('lang')).to.equal(null);
              if (node === lightDummyDOneRoot) {
                expect(node._providingContext).to.deep.equal({ dbuiDir: 'abc', dbuiLang: 'cd' });
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({ dbuiDir: 'abc', dbuiLang: 'cd' });
              }
            });

            box4.appendChild(lightDummyDOneRoot);

            doTest({
              firstSectionDir: 'ghi',
              firstSectionLang: 'de',
              secondSectionDir: 'ghi',
              secondSectionLang: 'de',
              dbuiNodes
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dir')).to.equal(null);
              expect(node.getAttribute('lang')).to.equal(null);
              if (node === lightDummyDOneRoot) {
                expect(node._providingContext).to.deep.equal({ dbuiDir: 'ghi', dbuiLang: 'de' });
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({ dbuiDir: 'ghi', dbuiLang: 'de' });
              }
            });

            box5.appendChild(lightDummyDOneRoot); // provides no locale

            doTest({
              firstSectionDir: 'ltr',
              firstSectionLang: 'en',
              secondSectionDir: 'ltr',
              secondSectionLang: 'en',
              dbuiNodes
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('dir')).to.equal(null);
              expect(node.getAttribute('lang')).to.equal(null);
              // Nor context provided nor received
              // as there is no surrounding locale.
              if (node === lightDummyDOneRoot) {
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({});
              }
            });

            lightDummyDOneRoot.dir = 'mno';
            lightDummyDOneRoot.lang = 'pq';

            doTest({
              firstSectionDir: 'mno',
              firstSectionLang: 'pq',
              secondSectionDir: 'mno',
              secondSectionLang: 'pq',
              dbuiNodes
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];

              if (node === lightDummyDOneRoot) {
                expect(node.getAttribute('dir')).to.equal('mno');
                expect(node.getAttribute('lang')).to.equal('pq');
                expect(node._providingContext).to.deep.equal({ dbuiDir: 'mno', dbuiLang: 'pq' });
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node.getAttribute('dir')).to.equal(null);
                expect(node.getAttribute('lang')).to.equal(null);
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({ dbuiDir: 'mno', dbuiLang: 'pq' });
              }
            });

            box3.appendChild(lightDummyDOneRoot);

            // no change after re-insert because locale values are defined on tree root
            doTest({
              firstSectionDir: 'mno',
              firstSectionLang: 'pq',
              secondSectionDir: 'mno',
              secondSectionLang: 'pq',
              dbuiNodes
            });

            // no change
            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];

              if (node === lightDummyDOneRoot) {
                expect(node.getAttribute('dir')).to.equal('mno');
                expect(node.getAttribute('lang')).to.equal('pq');
                expect(node._providingContext).to.deep.equal({ dbuiDir: 'mno', dbuiLang: 'pq' });
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node.getAttribute('dir')).to.equal(null);
                expect(node.getAttribute('lang')).to.equal(null);
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({ dbuiDir: 'mno', dbuiLang: 'pq' });
              }
            });

            lightDummyDOneRoot.removeAttribute('dir');
            lightDummyDOneRoot.lang = '';

            // When locale value is changed to falsy value
            // it looks for surrounding locale before setting default.
            // These values are now inherited from ancestors.
            doTest({
              firstSectionDir: 'abc',
              firstSectionLang: 'cd',
              secondSectionDir: 'abc',
              secondSectionLang: 'cd',
              dbuiNodes
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];

              if (node === lightDummyDOneRoot) {
                expect(node.getAttribute('dir')).to.equal(null);
                expect(node.getAttribute('lang')).to.equal('');
                expect(node._providingContext).to.deep.equal({ dbuiDir: 'abc', dbuiLang: 'cd' });
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node.getAttribute('dir')).to.equal(null);
                expect(node.getAttribute('lang')).to.equal(null);
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({ dbuiDir: 'abc', dbuiLang: 'cd' });
              }
            });

            box5.appendChild(lightDummyDOneRoot); // provides no locale

            doTest({
              firstSectionDir: 'ltr',
              firstSectionLang: 'en',
              secondSectionDir: 'ltr',
              secondSectionLang: 'en',
              dbuiNodes
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              // Nor context provided nor received
              // as there is no existing surrounding locale.
              if (node === lightDummyDOneRoot) {
                expect(node.getAttribute('dir')).to.equal(null);
                expect(node.getAttribute('lang')).to.equal('');
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({});
              } else {
                expect(node.getAttribute('dir')).to.equal(null);
                expect(node.getAttribute('lang')).to.equal(null);
                expect(node._providingContext).to.deep.equal({});
                expect(node._lastReceivedContext).to.deep.equal({});
              }
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
  closest surrounding locale is ignored for nodes that are not top dbui ancestors
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

  it(`
  surrounding locale is being watched for changes if initially defined
  `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          <div id="outer-wrapper" dir="abc" lang="de">
            <dummy-d id="dummy-d-outer" lang="it">
              <div id="inner-wrapper" dir="rtl" lang="fr">
                <dummy-d id="dummy-d-inner"></dummy-d>
              </div>
            </dummy-d>
          </div>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyD = getDummyD(contentWindow);

          const dummyDOuter = contentWindow.document.querySelector('#dummy-d-outer');
          const dummyDInner = contentWindow.document.querySelector('#dummy-d-inner');
          const outerWrapper = contentWindow.document.querySelector('#outer-wrapper');
          const innerWrapper = contentWindow.document.querySelector('#inner-wrapper');

          Promise.all([
            DummyD.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            // dir is read from outerWrapper and lang is read from dummyDOuter
            expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('abc');
            expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('it');
            expect(dummyDInner.getAttribute('dbui-dir')).to.equal('abc');
            expect(dummyDInner.getAttribute('dbui-lang')).to.equal('it');

            outerWrapper.setAttribute('dir', 'def');

            // mutations handlers are called async
            setTimeout(() => {
              // outerWrapper dir is watched
              expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('def');
              expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('it');
              expect(dummyDInner.getAttribute('dbui-dir')).to.equal('def');
              expect(dummyDInner.getAttribute('dbui-lang')).to.equal('it');

              dummyDOuter.setAttribute('lang', 'po');

              setTimeout(() => {
                // dummyDOuter lang is propagated in context
                expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('def');
                expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('po');
                expect(dummyDInner.getAttribute('dbui-dir')).to.equal('def');
                expect(dummyDInner.getAttribute('dbui-lang')).to.equal('po');

                outerWrapper.setAttribute('lang', 'ar');

                setTimeout(() => {
                  // outerWrapper lang is ignored (as dummyDOuter overrides  it)
                  expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('def');
                  expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('po');
                  expect(dummyDInner.getAttribute('dbui-dir')).to.equal('def');
                  expect(dummyDInner.getAttribute('dbui-lang')).to.equal('po');

                  dummyDOuter.removeAttribute('lang');

                  setTimeout(() => {
                    // outerWrapper lang is checked
                    expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('def');
                    expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('ar');
                    expect(dummyDInner.getAttribute('dbui-dir')).to.equal('def');
                    expect(dummyDInner.getAttribute('dbui-lang')).to.equal('ar');

                    outerWrapper.setAttribute('dir', 'opq');
                    outerWrapper.setAttribute('lang', 'cd');

                    setTimeout(() => {
                      // outerWrapper dir/lang is watched
                      expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('opq');
                      expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('cd');
                      expect(dummyDInner.getAttribute('dbui-dir')).to.equal('opq');
                      expect(dummyDInner.getAttribute('dbui-lang')).to.equal('cd');

                      innerWrapper.setAttribute('dir', 'pqr');
                      innerWrapper.setAttribute('lang', 'ef');

                      setTimeout(() => {
                        // innerWrapper dir/lang is ignored as surrounding context is ignored
                        // by nodes having closestDbuiParent
                        expect(dummyDOuter.getAttribute('dbui-dir')).to.equal('opq');
                        expect(dummyDOuter.getAttribute('dbui-lang')).to.equal('cd');
                        expect(dummyDInner.getAttribute('dbui-dir')).to.equal('opq');
                        expect(dummyDInner.getAttribute('dbui-lang')).to.equal('cd');
                      });
                    });
                  });

                  setTimeout(() => {
                    iframe.remove();
                    done();
                  }, 0);
                }, 0);
              }, 0);
            }, 0);
          });

          DummyD.registerSelf();
        }
      });
    });

});
