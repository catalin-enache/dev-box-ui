import { expect } from 'chai';
import getDBUIWebComponentCore from './DBUIWebComponentCore';

import inIframe from '../../../../../../testUtils/inIframe';

import monkeyPatch from '../../../../../../testUtils/monkeyPatch';

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
} from './DBUITestTreeSetup.forSpec';

/* eslint max-len: 0 */

function setGetter(klass, prop, cb) {
  return monkeyPatch(klass).set(prop, (getSuperDescriptor) => {
    return {
      get() {
        const superDescriptor = getSuperDescriptor();
        return [
          ...(superDescriptor ? superDescriptor.get() : []),
          ...(cb(superDescriptor))
        ];
      }
    };
  });
}

const localeContext = { dbuiDir: 'ltr', dbuiLang: 'en' };

/* eslint camelcase: 0 */

describe('DBUIWebComponentBase context passing', () => {
  describe('general behaviour', () => {
    it('behaves as expected', (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          ${treeOne}
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          setGetter(Base, 'contextSubscribe', () => {
            return ['color1', 'color2', 'color4', 'counter1', 'counter2'];
          });

          setGetter(Base, 'contextProvide', () => {
            return ['color4', 'counter1', 'counter2'];
          });

          setGetter(Base, 'observedAttributes', () => {
            return ['context-color4'];
          });

          setGetter(DummyA, 'contextSubscribe', () => {
            return ['color3'];
          });

          setGetter(DummyD, 'contextProvide', () => {
            return ['color1', 'color2', 'color3'];
          });

          setGetter(DummyD, 'observedAttributes', () => {
            return ['context-color1', 'context-color2', 'context-color3'];
          });

          monkeyPatch(Base).proto.set('onAttributeChangedCallback', (getSuperDescriptor) => {
            return {
              writable: true,
              value(name, oldValue, newValue) {
                getSuperDescriptor().value.call(this, name, oldValue, newValue);
                if (name === 'context-color4') {
                  this.setContext({
                    color4: newValue
                  });
                }
              }
            };
          });

          monkeyPatch(DummyD).proto.set('onAttributeChangedCallback', (getSuperDescriptor) => {
            return {
              writable: true,
              value(name, oldValue, newValue) {
                getSuperDescriptor().value.call(this, name, oldValue, newValue);

                if (name === 'context-color1') {
                  this.setContext({
                    color1: newValue
                  });
                } else if (name === 'context-color2') {
                  this.setContext({
                    color2: newValue
                  });
                } else if (name === 'context-color3') {
                  this.setContext({
                    color3: newValue
                  });
                }
              }
            };
          });

          const container = contentWindow.document.querySelector('#container');

          const doTest1 = () => {
            // check here every node context is as expected
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

            expect(lightDummyDOneRoot.__newContext).to.equal(undefined);

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

              lightDummyDThreeInDefaultSlot
            ].forEach((node) => {
              expect(node.__newContext.color1).to.equal('green');
              expect(node.__newContext.color2).to.equal('maroon');
              expect(node.__newContext.color4).to.equal('bisque');
            });

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
            ].forEach((node) => {
              expect(node.__newContext.color1).to.equal('orange');
              expect(node.__newContext.color2).to.equal('deepskyblue');
              expect(node.__newContext.color4).to.equal('bisque');
            });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if (node === lightDummyDOneRoot) {
                // pass
              } else if ([
                // ShadowDummyA descendants of lightDummyDThreeInDefaultSlot
                lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA,
                lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
                lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA
              ].includes(node)) {
                expect(node.__newContext.color3).to.equal('olive');
              } else {
                expect(node.__newContext.color3).to.equal(undefined);
              }
            });
          };

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            doTest1();

            container.innerHTML = '';
            container.innerHTML = treeOne;

            doTest1();

            const onDisconnectedCallbackCalls = [];
            monkeyPatch(DummyD).proto.set('onDisconnectedCallback', (getSuperDescriptor) => {
              return {
                writable: true,
                value(...args) {
                  getSuperDescriptor().value.call(this, ...args);
                  onDisconnectedCallbackCalls.push(this);
                }
              };
            });

            const onConnectedCallbackCalls = [];
            monkeyPatch(DummyD).proto.set('onConnectedCallback', (getSuperDescriptor) => {
              return {
                writable: true,
                value(...args) {
                  getSuperDescriptor().value.call(this, ...args);
                  onConnectedCallbackCalls.push(this);
                }
              };
            });

            const onAttributeChangedCallbackCalls = [];
            monkeyPatch(Base).proto.set('onAttributeChangedCallback', (getSuperDescriptor) => {
              return {
                writable: true,
                value(name, oldValue, newValue) {
                  getSuperDescriptor().value.call(this, name, oldValue, newValue);
                  onAttributeChangedCallbackCalls.push(this);
                }
              };
            });

            const ul2 = contentWindow.document.querySelector('#ul2');
            const ul2Parent = ul2.parentElement;
            const ul2InnerHTML = `
            <li id="ul2-li1">
              <dummy-d id="light-dummy-d-two-in-default-slot">
                <ul id="ul2-li1-ul1">
                  <li id="ul2-li1-ul1-li1">
                    <dummy-d id="light-dummy-d-three-in-default-slot" context-color2="deepskyblue" context-color3="olive">
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
            `;

            const {
              lightDummyDTwoInDefaultSlot,
              lightDummyDThreeInDefaultSlot,
              lightDummyEInDefaultSlot,
            } = treeOneGetDbuiNodes(contentWindow);

            // before any DOM mutation
            expect(lightDummyDTwoInDefaultSlot.__newContext).to.deep.equal({ color1: 'green', color2: 'maroon', color4: 'bisque', ...localeContext });
            expect(lightDummyDThreeInDefaultSlot.__newContext).to.deep.equal({ color1: 'green', color2: 'maroon', color4: 'bisque', ...localeContext });
            expect(lightDummyEInDefaultSlot.__newContext).to.deep.equal({ color1: 'orange', color2: 'deepskyblue', color4: 'bisque', ...localeContext });

            const newul2 = contentWindow.document.createElement('ul');
            ul2.remove();

            expect(onDisconnectedCallbackCalls.length).to.equal(3);

            // expect onContextChanged to have received {}
            // as a result of _resetContext() being called
            // due to tree containing node being removed
            expect(lightDummyDTwoInDefaultSlot.__newContext).to.deep.equal({});
            expect(lightDummyDThreeInDefaultSlot.__newContext).to.deep.equal({});
            expect(lightDummyEInDefaultSlot.__newContext).to.deep.equal({});

            setTimeout(() => {

              // Checking what happens when building a detached DOM tree and inserting it
              // in a context-less zone then re-inserting it in a zone having context.

              newul2.id = ul2.id;
              newul2.innerHTML = ul2InnerHTML;

              // not connected yet
              expect(onConnectedCallbackCalls.length).to.equal(0);
              // because of two attributes on light-dummy-d-three-in-default-slot
              // see Scenario 2 on attributeChangedCallback comment in DummyWebComponentCore.js
              expect(onAttributeChangedCallbackCalls.length).to.equal(2);

              // inserting in context-less zone
              container.appendChild(newul2);

              // because of three dummy-d components in the tree (light & shadow)
              expect(onConnectedCallbackCalls.length).to.equal(3);
              // remains unchanged / not fired again
              expect(onAttributeChangedCallbackCalls.length).to.equal(2);

              const {
                lightDummyDTwoInDefaultSlot,
                lightDummyDThreeInDefaultSlot,
                lightDummyEInDefaultSlot,
              } = treeOneGetDbuiNodes(contentWindow);

              // expect onContextChanged was not called due to it is the root of the new tree
              // and there is no context in container either.
              expect(lightDummyDTwoInDefaultSlot.__newContext).to.equal(undefined);
              // expect onContextChanged was called only to set default locale.
              expect(lightDummyDThreeInDefaultSlot.__newContext).to.deep.equal(localeContext);
              // received context from middle ancestor
              expect(lightDummyEInDefaultSlot.__newContext).to.deep.equal({ color2: 'deepskyblue', ...localeContext });

              setTimeout(() => {

                // clear
                onConnectedCallbackCalls.splice(0);
                onDisconnectedCallbackCalls.splice(0);
                onAttributeChangedCallbackCalls.splice(0);

                // re-inserting in context zone
                ul2Parent.appendChild(newul2);

                let dbuiNodes = treeOneGetDbuiNodes(contentWindow);
                const {
                  lightDummyDTwoInDefaultSlot,
                  lightDummyDThreeInDefaultSlot,
                  lightDummyEInDefaultSlot,
                } = dbuiNodes;

                // expect onContextChanged was called because it was moved into DOM area having context
                expect(lightDummyDTwoInDefaultSlot.__newContext).to.deep.equal({ color1: 'green', color2: 'maroon', color4: 'bisque', ...localeContext });
                expect(lightDummyDThreeInDefaultSlot.__newContext).to.deep.equal({ color1: 'green', color2: 'maroon', color4: 'bisque', ...localeContext });
                // expect context still overriden by middle ancestor
                expect(lightDummyEInDefaultSlot.__newContext).to.deep.equal({ color1: 'green', color2: 'deepskyblue', color4: 'bisque', ...localeContext });
                // because of three dummy-d components in the tree (light & shadow)
                // were disconnected and then reconnected
                expect(onDisconnectedCallbackCalls.length).to.equal(3);
                expect(onConnectedCallbackCalls.length).to.equal(3);
                expect(onConnectedCallbackCalls).to.deep.equal(onDisconnectedCallbackCalls);
                // remains unchanged / not fired again
                expect(onAttributeChangedCallbackCalls.length).to.equal(0);

                monkeyPatch(Base).proto.set('onContextChanged', (getSuperDescriptor) => {
                  return {
                    value(newContext, prevContext) {
                      getSuperDescriptor().value.call(this, newContext, prevContext);
                      const {
                        color1: newColor1,
                        color4: newColor4,
                        counter1: newCounter1,
                      } = newContext;
                      this.setContext({
                        color1: newColor1,
                        counter1: newCounter1 + 1
                      });
                      this.setAttribute('context-color4', newColor4);
                      this.setAttribute('context-color1', newColor1);
                    }
                  };
                });

                container.innerHTML = '';
                container.innerHTML = treeOne;

                dbuiNodes = treeOneGetDbuiNodes(contentWindow);
                const {
                  lightDummyDOneRoot,
                  lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA
                } = dbuiNodes;
                lightDummyDOneRoot.setContext({ counter1: 1, counter2: 1 });

                Object.keys(dbuiNodes).forEach((key) => {
                  const node = dbuiNodes[key];
                  if (node !== lightDummyDOneRoot) {
                    expect(node.__newContext.counter2).to.equal(1);
                    expect(node.__newContext.color1).to.equal('green');
                    expect(node.getAttribute('context-color1')).to.equal('green');
                    expect(node.getAttribute('context-color4')).to.equal('bisque');
                  }
                });

                expect(
                  lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__newContext.counter1
                ).to.equal(7);

                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 0);

              }, 0);
            }, 0);
          });

          DummyE.registerSelf();
        }
      });
    });

    it('context is deeply propagated root to leaves', (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          const {
            defineCommonStaticMethods,
            Registerable,
            DBUIWebComponentBase
          } = getDBUIWebComponentCore(contentWindow);

          const ContextProvider = Registerable(
            defineCommonStaticMethods(
              class ContextProvider extends DBUIWebComponentBase {
                static get registrationName() {
                  return 'context-provider';
                }
                static get contextProvide() {
                  return [...super.contextProvide, 'color1'];
                }
              }
            )
          );

          ContextProvider.registerSelf();

          setGetter(Base, 'contextSubscribe', () => {
            return ['color1'];
          });

          const container = contentWindow.document.querySelector('#container');

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            const contextProvider = contentWindow.document.createElement('context-provider');
            contextProvider.id = 'context-provider';
            contextProvider.setContext({ color1: 'cadetblue' });

            container.appendChild(contextProvider);
            contextProvider.innerHTML = treeOne;

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            Object.keys(dbuiNodes).forEach((key) => {
              expect(dbuiNodes[key].__newContext.color1).to.equal('cadetblue');
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

    it(`context can be intercepted and overridden
    and onContextChanged can be fired more than once until DOM tree settles down (on Chrome)`, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          const getId = (self) => `${self.id}_${(self.closestDbuiParent || {}).id || null}`;

          const {
            defineCommonStaticMethods,
            Registerable,
            DBUIWebComponentBase
          } = getDBUIWebComponentCore(contentWindow);

          const ContextProvider = Registerable(
            defineCommonStaticMethods(
              class ContextProvider extends DBUIWebComponentBase {
                static get registrationName() {
                  return 'context-provider';
                }
                static get contextProvide() {
                  return [...super.contextProvide, 'color3'];
                }
              }
            )
          );

          ContextProvider.registerSelf();

          setGetter(Base, 'contextSubscribe', () => {
            return ['color3'];
          });

          setGetter(DummyD, 'contextProvide', () => {
            return ['color3'];
          });

          setGetter(DummyD, 'observedAttributes', () => {
            return ['context-color3'];
          });

          const onAttributeChangedCallbackCalls = [];
          monkeyPatch(DummyD).proto.set('onAttributeChangedCallback', (getSuperDescriptor) => {
            return {
              writable: true,
              value(name, oldValue, newValue) {
                getSuperDescriptor().value.call(this, name, oldValue, newValue);
                if (name === 'context-color3') {
                  onAttributeChangedCallbackCalls.push(this);
                  this.setContext({
                    color3: newValue
                  });
                }
              }
            };
          });

          const onContextChangedCalls = [];
          monkeyPatch(Base).proto.set('onContextChanged', (getSuperDescriptor) => {
            return {
              writable: true,
              value(newContext, prevContext) {
                if (getId(this) === 'shadow-dummy-b_light-dummy-d-three-in-default-slot') {
                  onContextChangedCalls.push({ newContext, prevContext });
                }
                getSuperDescriptor().value.call(this, newContext, prevContext);
              }
            };
          });

          const container = contentWindow.document.querySelector('#container');

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            const contextProvider = contentWindow.document.createElement('context-provider');
            contextProvider.id = 'context-provider';
            contextProvider.setContext({ color3: 'cadetblue', ...localeContext });

            container.appendChild(contextProvider);
            contextProvider.innerHTML = treeOne;

            expect(onAttributeChangedCallbackCalls.length).to.equal(1);
            expect(onAttributeChangedCallbackCalls[0].id).to.equal('light-dummy-d-three-in-default-slot');

            if (window.navigator.vendor === 'Google Inc.') {
              // shadow-dummy-b_light-dummy-d-three-in-default-slot received 2 onContextChanged calls
              // until the DOM tree settled down.
              expect(onContextChangedCalls.length).equal(2);
              // First call is from reading upstream context (from context-provider)
              // as light-dummy-d-three-in-default-slot has not fired yet attributeChangeCallback
              // and thus it did not managed to set its own context yet.
              expect(onContextChangedCalls[0]).deep.equal({ newContext: { color3: 'cadetblue', ...localeContext }, prevContext: {} });
              // Second call is from light-dummy-d-three-in-default-slot firing attributeChangeCallback
              // which have set new context propagating it down.
              expect(onContextChangedCalls[1]).deep.equal({ newContext: { color3: 'olive', ...localeContext }, prevContext: { color3: 'cadetblue', ...localeContext } });
              // NOTE:
              // It seems it is a detail of implementation between browser vendors
              // the order and number of the events during tree building.
            }


            // confirm expectations (context propagated and overriden) after dom is settled

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

            // context from context-provider
            [
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
            ].forEach((node) => {
              expect(node.__newContext.color3).to.equal('cadetblue');
            });

            // context overriden by light-dummy-d-three-in-default-slot
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
            ].forEach((node) => {
              expect(node.__newContext.color3).to.equal('olive');
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
    can setContext onAttributeChangedCallback,
    can setAttribute onContextChanged and
    can setContext onContextChanged
    `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          // const getId = (self) => `${self.id}_${(self.closestDbuiParent || {}).id || null}`;

          setGetter(Base, 'observedAttributes', () => {
            return ['context-color4'];
          });

          setGetter(Base, 'contextSubscribe', () => {
            return ['color4'];
          });

          setGetter(Base, 'contextProvide', () => {
            return ['color4'];
          });

          const onAttributeChangedCallbackCalls = new Map();
          monkeyPatch(Base).proto.set('onAttributeChangedCallback', (getSuperDescriptor) => {
            return {
              writable: true,
              value(name, oldValue, newValue) {
                getSuperDescriptor().value.call(this, name, oldValue, newValue);
                if (name === 'context-color4') {
                  onAttributeChangedCallbackCalls.set(this, (onAttributeChangedCallbackCalls.get(this) || 0) + 1);
                  this.setContext({
                    color4: newValue
                  });
                }
              }
            };
          });

          const onContextChangedCalls = new Map();
          const resetOnContextChanged =
          monkeyPatch(Base).proto.set('onContextChanged', (getSuperDescriptor) => {
            return {
              writable: true,
              value(newContext, prevContext) {
                getSuperDescriptor().value.call(this, newContext, prevContext);
                const {
                  color4
                } = newContext;
                onContextChangedCalls.set(this, (onContextChangedCalls.get(this) || 0) + 1);
                this.setAttribute('context-color4', color4);
              }
            };
          });

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
            const {
              lightDummyDOneRoot,
              lightDummyDOneRoot_ShadowDummyB,
              lightDummyDOneRoot_ShadowDummyB_ShadowDummyA
            } = dbuiNodes;

            Object.keys(dbuiNodes).forEach((key) => {
              if (dbuiNodes[key] === lightDummyDOneRoot) return;
              expect(dbuiNodes[key].__newContext.color4).to.equal('bisque');
              expect(dbuiNodes[key].getAttribute('context-color4')).to.equal('bisque');
              expect(dbuiNodes[key]._providingContext.color4).to.equal('bisque');
              expect(dbuiNodes[key]._lastReceivedContext.color4).to.equal('bisque');
            });

            expect(onContextChangedCalls.size).to.equal(22);
            onContextChangedCalls.forEach((value, key) => {
              if ([
                lightDummyDOneRoot_ShadowDummyB,
                lightDummyDOneRoot_ShadowDummyB_ShadowDummyA
              ].includes(key)) {
                // expect(value).to.equal(2); // +one due to default locale and browser algorithm (Chrome)
              } else {
                expect(value).to.equal(1);
              }
            });

            expect(onAttributeChangedCallbackCalls.size).to.equal(23);
            onAttributeChangedCallbackCalls.forEach((value) => {
              expect(value).to.equal(1);
            });

            onContextChangedCalls.clear();
            onAttributeChangedCallbackCalls.clear();

            lightDummyDOneRoot.setAttribute('context-color4', 'forestgreen');

            Object.keys(dbuiNodes).forEach((key) => {
              if (dbuiNodes[key] === lightDummyDOneRoot) return;
              expect(dbuiNodes[key].__newContext.color4).to.equal('forestgreen');
              expect(dbuiNodes[key].getAttribute('context-color4')).to.equal('forestgreen');
              expect(dbuiNodes[key]._providingContext.color4).to.equal('forestgreen');
              expect(dbuiNodes[key]._lastReceivedContext.color4).to.equal('forestgreen');
            });

            expect(onContextChangedCalls.size).to.equal(22);
            onContextChangedCalls.forEach((value) => {
              expect(value).to.equal(1);
            });

            expect(onAttributeChangedCallbackCalls.size).to.equal(23);
            onAttributeChangedCallbackCalls.forEach((value) => {
              expect(value).to.equal(1);
            });

            onContextChangedCalls.clear();
            onAttributeChangedCallbackCalls.clear();

            lightDummyDOneRoot.setContext({ color4: 'goldenrod' });

            Object.keys(dbuiNodes).forEach((key) => {
              if (dbuiNodes[key] === lightDummyDOneRoot) return;
              expect(dbuiNodes[key].__newContext.color4).to.equal('goldenrod');
              expect(dbuiNodes[key].getAttribute('context-color4')).to.equal('goldenrod');
              expect(dbuiNodes[key]._providingContext.color4).to.equal('goldenrod');
              expect(dbuiNodes[key]._lastReceivedContext.color4).to.equal('goldenrod');
            });
            // not changed
            expect(lightDummyDOneRoot.getAttribute('context-color4')).to.equal('forestgreen');

            expect(onContextChangedCalls.size).to.equal(22);
            onContextChangedCalls.forEach((value) => {
              expect(value).to.equal(1);
            });

            expect(onAttributeChangedCallbackCalls.size).to.equal(22);
            onAttributeChangedCallbackCalls.forEach((value) => {
              expect(value).to.equal(1);
            });

            onContextChangedCalls.clear();
            onAttributeChangedCallbackCalls.clear();

            resetOnContextChanged();

            monkeyPatch(Base).proto.set('onContextChanged', (getSuperDescriptor) => {
              return {
                writable: true,
                value(newContext, prevContext) {
                  getSuperDescriptor().value.call(this, newContext, prevContext);
                  const {
                    color4
                  } = newContext;
                  onContextChangedCalls.set(this, (onContextChangedCalls.get(this) || 0) + 1);
                  this.setContext({ color4 });
                }
              };
            });

            lightDummyDOneRoot.setContext({ color4: 'lightcoral' });

            Object.keys(dbuiNodes).forEach((key) => {
              if (dbuiNodes[key] === lightDummyDOneRoot) return;
              expect(dbuiNodes[key].__newContext.color4).to.equal('lightcoral');
              // not changed
              expect(dbuiNodes[key].getAttribute('context-color4')).to.equal('goldenrod');
              expect(dbuiNodes[key]._providingContext.color4).to.equal('lightcoral');
              expect(dbuiNodes[key]._lastReceivedContext.color4).to.equal('lightcoral');
            });
            // not changed
            expect(lightDummyDOneRoot.getAttribute('context-color4')).to.equal('forestgreen');

            expect(onContextChangedCalls.size).to.equal(22);
            onContextChangedCalls.forEach((value) => {
              expect(value).to.equal(1);
            });

            expect(onAttributeChangedCallbackCalls.size).to.equal(0);

            onContextChangedCalls.clear();
            onAttributeChangedCallbackCalls.clear();

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

  describe('_checkContext, _getContext, _resetContext', () => {
    it(`
    _checkContext is called once by every component that subscribed for something,
    _getContext is called once by every parent (non leaf),
    _resetContext is called once by every component that was removed from DOM tree
    `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          <div id="box1"></div>
          <div id="box2"></div>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          // const getId = (self) => `${self.id}_${(self.closestDbuiParent || {}).id || null}`;

          setGetter(Base, 'observedAttributes', () => {
            return ['context-color4'];
          });

          setGetter(Base, 'contextSubscribe', () => {
            return ['color4'];
          });

          setGetter(Base, 'contextProvide', () => {
            return ['color4'];
          });

          monkeyPatch(Base).proto.set('onAttributeChangedCallback', (getSuperDescriptor) => {
            return {
              writable: true,
              value(name, oldValue, newValue) {
                getSuperDescriptor().value.call(this, name, oldValue, newValue);
                if (name === 'context-color4') {
                  this.setContext({
                    color4: newValue
                  });
                }
              }
            };
          });

          const setContextCalls = new Map();
          monkeyPatch(Base).proto.set('setContext', (getSuperDescriptor) => {
            return {
              writable: true,
              value(context) {
                getSuperDescriptor().value.call(this, context);
                setContextCalls.set(this, (setContextCalls.get(this) || 0) + 1);
              }
            };
          });

          const checkContextCalls = new Map();
          monkeyPatch(Base).proto.set('_checkContext', (getSuperDescriptor) => {
            return {
              writable: true,
              value() {
                getSuperDescriptor().value.call(this);
                checkContextCalls.set(this, (checkContextCalls.get(this) || 0) + 1);
              }
            };
          });

          const getContextCalls = new Map();
          monkeyPatch(Base).proto.set('_getContext', (getSuperDescriptor) => {
            return {
              writable: true,
              value(keys) {
                getContextCalls.set(this, (getContextCalls.get(this) || 0) + 1);
                return getSuperDescriptor().value.call(this, keys);
              }
            };
          });

          const resetContextCalls = new Map();
          monkeyPatch(Base).proto.set('_resetContext', (getSuperDescriptor) => {
            return {
              writable: true,
              value() {
                resetContextCalls.set(this, (resetContextCalls.get(this) || 0) + 1);
                return getSuperDescriptor().value.call(this);
              }
            };
          });

          const container = contentWindow.document.querySelector('#container');
          const box1 = container.querySelector('#box1');
          const box2 = container.querySelector('#box2');

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            box2.innerHTML = treeOne;

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              lightDummyDOneRoot
            } = dbuiNodes;

            const dbuiNodesNonLeaves = Object.keys(dbuiNodes).filter((key) => {
              return dbuiNodes[key].closestDbuiChildren.length !== 0;
            });

            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color4: 'bisque', ...localeContext });
            expect(lightDummyDOneRoot._lastReceivedContext).to.deep.equal({});
            expect(lightDummyDOneRoot.__newContext).to.equal(undefined);
            expect(resetContextCalls.size).to.equal(0);
            // only parents (non leafs) do _getContext
            expect(getContextCalls.size).to.equal(dbuiNodesNonLeaves.length); // 16
            expect(setContextCalls.size).to.equal(1);
            expect(checkContextCalls.size).to.equal(23);
            checkContextCalls.forEach((value) => {
              expect(value).to.equal(1);
            });
            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if (node === lightDummyDOneRoot) {
                expect(node.__newContext).to.equal(undefined);
              } else {
                expect(node.__newContext.color4).to.equal('bisque');
                expect(node.__newContext).to.deep.equal(node._lastReceivedContext);
              }
            });

            getContextCalls.clear();
            setContextCalls.clear();
            checkContextCalls.clear();

            box1.appendChild(box2);

            // _providingContext was not reset
            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color4: 'bisque', ...localeContext });
            expect(lightDummyDOneRoot._lastReceivedContext).to.deep.equal({});
            expect(lightDummyDOneRoot.__newContext).to.equal(undefined);
            // every node resets and checks back context as a result of being removed and re-inserted in DOM tree
            expect(resetContextCalls.size).to.equal(23);
            expect(checkContextCalls.size).to.equal(23);
            // every parent fired again _getContext
            expect(getContextCalls.size).to.equal(dbuiNodesNonLeaves.length); // 16
            // no attributeChangedCallback fired anymore but setContext was called to set default locale
            expect(setContextCalls.size).to.equal(1);
            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if (node === lightDummyDOneRoot) {
                expect(node.__newContext).to.equal(undefined);
              } else {
                expect(node.__newContext.color4).to.equal('bisque');
                expect(node.__newContext).to.deep.equal(node._lastReceivedContext);
              }
            });

            getContextCalls.clear();
            setContextCalls.clear();
            checkContextCalls.clear();

            box2.remove();

            // _providingContext was not reset from component providing context
            // because if context is dependent on attributeChangedCallback
            // that will not fire when component is moved from one place to another place in DOM tree.
            // Practically only locale context was reset.
            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color4: 'bisque' });
            expect(lightDummyDOneRoot._lastReceivedContext).to.deep.equal({});
            expect(lightDummyDOneRoot.__newContext).to.equal(undefined);
            expect(resetContextCalls.size).to.equal(23);
            expect(checkContextCalls.size).to.equal(0);
            expect(getContextCalls.size).to.equal(0);
            expect(setContextCalls.size).to.equal(0);
            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if (node === lightDummyDOneRoot) {
                expect(node.__newContext).to.equal(undefined);
              } else {
                expect(node.__newContext.color4).to.equal(undefined);
                expect(node.__newContext).to.deep.equal(node._lastReceivedContext);
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
  });

  describe('contextProvide', () => {
    it(`
    returns a whitelist of keys allowed to be set on context
    `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          // const getId = (self) => `${self.id}_${(self.closestDbuiParent || {}).id || null}`;

          setGetter(Base, 'contextSubscribe', () => {
            return ['color3', 'color4'];
          });

          setGetter(Base, 'contextProvide', () => {
            return ['color4'];
          });

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
            const {
              lightDummyDOneRoot
            } = dbuiNodes;

            lightDummyDOneRoot.setContext({ color3: 'cadetblue', color4: 'goldenrod' });

            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color4: 'goldenrod', ...localeContext });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if (node === lightDummyDOneRoot) {
                expect(node.__newContext).to.equal(undefined);
              } else {
                expect(node.__newContext).to.deep.equal({ color4: 'goldenrod', ...localeContext });
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
  });

  describe('contextSubscribe', () => {
    it(`
    returns a whitelist of keys allowed to be received on context
    `, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          // const getId = (self) => `${self.id}_${(self.closestDbuiParent || {}).id || null}`;

          setGetter(Base, 'contextSubscribe', () => {
            return ['color4'];
          });

          setGetter(Base, 'contextProvide', () => {
            return ['color3', 'color4'];
          });

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
            const {
              lightDummyDOneRoot
            } = dbuiNodes;

            lightDummyDOneRoot.setContext({ color3: 'cadetblue', color4: 'goldenrod' });

            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color3: 'cadetblue', color4: 'goldenrod', ...localeContext });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if (node === lightDummyDOneRoot) {
                expect(node.__newContext).to.equal(undefined);
              } else {
                expect(node.__newContext).to.deep.equal({ color4: 'goldenrod', ...localeContext });
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
  });

  describe('_unsetAndRelinkContext', () => {
    describe('when top dbui ancestor', () => {
      it(`
      resets _providingContext,
      and propagates undefined to self and ancestors.
      `, (done) => {
        inIframe({
          headStyle: treeStyle,
          bodyHTML: `
          <div id="container">
            ${treeOne}
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const Base = getBase(contentWindow);
            const DummyA = getDummyA(contentWindow);
            const DummyB = getDummyB(contentWindow);
            const DummyC = getDummyC(contentWindow);
            const DummyD = getDummyD(contentWindow);
            const DummyE = getDummyE(contentWindow);

            // const getId = (self) => `${self.id}_${(self.closestDbuiParent || {}).id || null}`;

            setGetter(Base, 'contextSubscribe', () => {
              return ['color4'];
            });

            setGetter(Base, 'contextProvide', () => {
              return ['color4'];
            });

            Promise.all([
              DummyA.registrationName,
              DummyB.registrationName,
              DummyC.registrationName,
              DummyD.registrationName,
              DummyE.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
              const {
                lightDummyDOneRoot
              } = dbuiNodes;

              lightDummyDOneRoot.setContext({ color4: 'goldenrod' });

              Object.keys(dbuiNodes).forEach((key) => {
                const node = dbuiNodes[key];
                if (node === lightDummyDOneRoot) {
                  expect(node.__newContext).to.equal(undefined);
                } else {
                  expect(node.__newContext).to.deep.equal({ color4: 'goldenrod', ...localeContext });
                }
              });

              lightDummyDOneRoot._unsetAndRelinkContext('color4');

              Object.keys(dbuiNodes).forEach((key) => {
                const node = dbuiNodes[key];
                if (node === lightDummyDOneRoot) {
                  expect(node.__newContext).to.equal(undefined);
                } else {
                  expect(node.__newContext).to.deep.equal({ color4: undefined, ...localeContext });
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
    });

    describe('when descendant', () => {
      it(`
      resets _lastReceivedContext and _providingContext,
      looks up for new value on closestDbuiParent context
      and propagates that to self and ancestors even new found value is undefined.
      `, (done) => {
        inIframe({
          headStyle: treeStyle,
          bodyHTML: `
          <div id="container">
            ${treeOne}
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const Base = getBase(contentWindow);
            const DummyA = getDummyA(contentWindow);
            const DummyB = getDummyB(contentWindow);
            const DummyC = getDummyC(contentWindow);
            const DummyD = getDummyD(contentWindow);
            const DummyE = getDummyE(contentWindow);

            // const getId = (self) => `${self.id}_${(self.closestDbuiParent || {}).id || null}`;

            setGetter(Base, 'contextSubscribe', () => {
              return ['color4'];
            });

            setGetter(Base, 'contextProvide', () => {
              return ['color4'];
            });

            Promise.all([
              DummyA.registrationName,
              DummyB.registrationName,
              DummyC.registrationName,
              DummyD.registrationName,
              DummyE.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const test = ({
                firstHalfColor,
                secondHalfColor
              }) => {
                const dbuiNodes = treeOneGetDbuiNodes(contentWindow);

                const {
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

                  lightDummyDThreeInDefaultSlot,
                ].forEach((node) => {
                  expect(node.__newContext.color4).to.equal(firstHalfColor);
                });

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
                ].forEach((node) => {
                  expect(node.__newContext.color4).to.equal(secondHalfColor);
                });
              };

              const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
              const {
                lightDummyDOneRoot,
                lightDummyDThreeInDefaultSlot
              } = dbuiNodes;

              lightDummyDThreeInDefaultSlot.setContext({ color4: 'cadetblue' });
              lightDummyDOneRoot.setContext({ color4: 'goldenrod' });

              test({ firstHalfColor: 'goldenrod', secondHalfColor: 'cadetblue' });

              lightDummyDThreeInDefaultSlot._unsetAndRelinkContext('color4');

              test({ firstHalfColor: 'goldenrod', secondHalfColor: 'goldenrod' });

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
  });
});
