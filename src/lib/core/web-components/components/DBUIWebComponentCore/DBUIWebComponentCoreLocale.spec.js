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

/* eslint camelcase: 0 */

describe('DBUIWebComponentBase locale behaviour', () => {
  it(`
  has internal defaults when not defined by user
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
  Locale getters/setters (dir/lang) are kept in sync with attributes
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
          dummyDTwo.setAttribute('dir', 'ltr');
          dummyDTwo.setAttribute('lang', 'de');
          expect(dummyDTwo.dir).to.equal('ltr');
          expect(dummyDTwo.lang).to.equal('de');
          dummyDTwo.setAttribute('dir', 'rtl');
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
            expect(dummyDTwo.getAttribute('dbui-dir')).to.equal('rtl');
            expect(dummyDTwo.getAttribute('dbui-lang')).to.equal('de');

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
  is propagated in context.
  `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          <dummy-d dir="rtl" lang="it" id="light-dummy-d-one-root" context-color1="green" context-color2="maroon" context-color4="bisque" >
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
                      <dummy-d dir="xyz" lang="de" id="light-dummy-d-three-in-default-slot" context-color1="orange" context-color2="deepskyblue" context-color3="olive">
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
        `,
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
});
