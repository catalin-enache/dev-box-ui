import { expect } from 'chai';
import getDBUIWebComponentCore from '../DBUIWebComponentCore';
import inIframe from '../../../../../../../testUtils/inIframe';
import monkeyPatch from '../../../../../../../testUtils/monkeyPatch';

import {
  getDBUIWebComponentRoot,
  getBase,
  getDummyA,
  getDummyB,
  getDummyC,
  getDummyD,
  getDummyE,
  getDummyX,
  treeOne, treeOneNoDbuiRoot,
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
  xit('live testing', (done) => {
    inIframe({
      bodyHTML: `
      <dbui-web-component-root id="dbui-web-component-root">
        <dbui-dummy-a id="dbui-dummy-a-light-1" dir="rtl">
          <dbui-dummy-b id="dbui-dummy-b-light-1-1">
            <dbui-dummy-b id="dbui-dummy-b-light-1-2">
            </dbui-dummy-b>
          </dbui-dummy-b>   
        </dbui-dummy-a>
        <dbui-dummy-a id="dbui-dummy-a-light-2"> 
        </dbui-dummy-a>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DummyA = getDummyX('dbui-dummy-a', 'DummyA', {
          dependentClasses: [],
          dependentHTML: `
          `,
          contextSubscribe: [], contextProvide: ['aaa'],
          callbacks: {
            onConnectedCallback: (self) => {
              // console.log('onConnectedCallback', self.id);
              self.setContext({ aaa: 111 });
            },
            // eslint-disable-next-line
            onContextChanged: (self, newContext, prevContext) => {
              // console.log('onContextChanged', self.id, { newContext, prevContext });
            },
            // eslint-disable-next-line
            onLocaleDirChanged: (self, newDir, prevDir) => {
              // console.log('onLocaleDirChanged', self.id, { newDir, prevDir });
            }
          },
        })(contentWindow);

        const DummyB = getDummyX('dbui-dummy-b', 'DummyA', {
          dependentClasses: [],
          dependentHTML: `
          `,
          contextSubscribe: ['aaa'], contextProvide: [],
          callbacks: {
            // eslint-disable-next-line
            onConnectedCallback: (self) => {
              // console.log('onConnectedCallback', self.id);
            },
            // eslint-disable-next-line
            onContextChanged: (self, newContext, prevContext) => {
              // console.log('onContextChanged', self.id, { newContext, prevContext });
            },
            // eslint-disable-next-line
            onLocaleDirChanged: (self, newDir, prevDir) => {
              // console.log('onLocaleDirChanged', self.id, { newDir, prevDir });
            }
          },
        })(contentWindow);

        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);

        Promise.all([
          DBUIRoot.registrationName
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          const dummyA1 = contentWindow.document.querySelector('#dbui-dummy-a-light-1');
          const dummyA2 = contentWindow.document.querySelector('#dbui-dummy-a-light-2');
          const dummyB1 = contentWindow.document.querySelector('#dbui-dummy-b-light-1-1');

          // ------------------------ test 2
          dummyA2.appendChild(dummyB1);
          dummyA1.setContext({ aaa: 222 });

          // ------------------------ test 3
          dummyA1.appendChild(dummyB1);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 55000);
        });

        DummyA.registerSelf();
        DummyB.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  describe('general behavior 1', () => {
    it('behaves as expected 1', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-a id="dbui-dummy-a-light-1" dir="rtl">
            <dbui-dummy-b id="dbui-dummy-b-light-1-1">
              <dbui-dummy-b id="dbui-dummy-b-light-1-2">
              </dbui-dummy-b>
            </dbui-dummy-b>   
          </dbui-dummy-a>
          <dbui-dummy-a id="dbui-dummy-a-light-2"> 
          </dbui-dummy-a>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyA = getDummyX('dbui-dummy-a', 'DummyA', {
            dependentClasses: [],
            dependentHTML: `
            `,
            contextSubscribe: [], contextProvide: ['aaa'],
            callbacks: {
              onConnectedCallback: (self) => {
                // console.log('onConnectedCallback', self.id);
                self.setContext({ aaa: 111 });
              },
              // eslint-disable-next-line
              onContextChanged: (self, newContext, prevContext) => {
                // console.log('onContextChanged', self.id, { newContext, prevContext });
              },
              // eslint-disable-next-line
              onLocaleDirChanged: (self, newDir, prevDir) => {
                // console.log('onLocaleDirChanged', self.id, { newDir, prevDir });
              }
            },
          })(contentWindow);

          const DummyB = getDummyX('dbui-dummy-b', 'DummyA', {
            dependentClasses: [],
            dependentHTML: `
            `,
            contextSubscribe: ['aaa'], contextProvide: [],
            callbacks: {
              // eslint-disable-next-line
              onConnectedCallback: (self) => {
                // console.log('onConnectedCallback', self.id);
              },
              // eslint-disable-next-line
              onContextChanged: (self, newContext, prevContext) => {
                // console.log('onContextChanged', self.id, { newContext, prevContext });
              },
              // eslint-disable-next-line
              onLocaleDirChanged: (self, newDir, prevDir) => {
                // console.log('onLocaleDirChanged', self.id, { newDir, prevDir });
              }
            },
          })(contentWindow);

          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);

          Promise.all([
            DBUIRoot.registrationName
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            const dummyA1 = contentWindow.document.querySelector('#dbui-dummy-a-light-1');
            const dummyA2 = contentWindow.document.querySelector('#dbui-dummy-a-light-2');
            const dummyB1 = contentWindow.document.querySelector('#dbui-dummy-b-light-1-1');
            const dummyB2 = contentWindow.document.querySelector('#dbui-dummy-b-light-1-2');

            expect(dummyB1._lastReceivedContext).to.deep.equal({ aaa: 111, dbuiDir: 'rtl', dbuiLang: 'en' });
            expect(dummyB2._lastReceivedContext).to.deep.equal({ aaa: 111, dbuiDir: 'rtl', dbuiLang: 'en' });

            // ------------------------ test 2
            dummyA2.appendChild(dummyB1);
            dummyA1.setContext({ aaa: 222 });
            expect(dummyB1._lastReceivedContext).to.deep.equal({ aaa: 111, dbuiDir: 'ltr', dbuiLang: 'en' });
            expect(dummyB2._lastReceivedContext).to.deep.equal({ aaa: 111, dbuiDir: 'ltr', dbuiLang: 'en' });

            // ------------------------ test 3
            dummyA1.appendChild(dummyB1);

            expect(dummyB1._lastReceivedContext).to.deep.equal({ aaa: 222, dbuiDir: 'rtl', dbuiLang: 'en' });
            expect(dummyB2._lastReceivedContext).to.deep.equal({ aaa: 222, dbuiDir: 'rtl', dbuiLang: 'en' });


            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyA.registerSelf();
          DummyB.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('general behaviour 2', () => {
    it('behaves as expected 2', (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          ${treeOne}
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
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

          monkeyPatch(DBUIRoot).proto.set('onContextChanged', (getSuperDescriptor) => {
            return {
              writable: true,
              value(newContext, prevContext) {
                getSuperDescriptor().value.call(this, newContext, prevContext);
                this.__newContext = newContext;
                this.__prevContext = prevContext;
              }
            };
          });

          const container = contentWindow.document.querySelector('#container');

          const doTest1 = () => {
            // check here every node context is as expected
            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              dbuiWebComponentRoot,

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

            expect(dbuiWebComponentRoot.__newContext).to.equal(undefined);
            expect(lightDummyDOneRoot.__newContext).to.deep.equal(localeContext);

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
              if (node === dbuiWebComponentRoot) {
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
            DBUIRoot.registrationName,
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
              <dbui-dummy-d id="light-dummy-d-two-in-default-slot">
                <ul id="ul2-li1-ul1">
                  <li id="ul2-li1-ul1-li1">
                    <dbui-dummy-d id="light-dummy-d-three-in-default-slot" context-color2="deepskyblue" context-color3="olive">
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
            `;

            const {
              dbuiWebComponentRoot,
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
              // !!! Safari randomly reports that
              // this._onAttributeChangedCallback
              // or this._onConnectedCallback
              // or closestDbuiParent._getContext
              // or closestDbuiParent._registerChild
              // is undefined
              newul2.innerHTML = ul2InnerHTML;

              // not connected yet
              expect(onConnectedCallbackCalls.length).to.equal(0);
              // attribute changed is guaranteed to fire after onConnectedCallback
              expect(onAttributeChangedCallbackCalls.length).to.equal(0);

              // inserting in context-less zone
              dbuiWebComponentRoot.appendChild(newul2);

              // because of three dummy-d components in the tree (light & shadow)
              // !!! expected 2 to equal 3 randomly fails on Safari for the next expectation
              // correlated with previous randomly Safari report
              expect(onConnectedCallbackCalls.length).to.equal(3);
              // remains unchanged / not fired again
              expect(onAttributeChangedCallbackCalls.length).to.equal(2);

              const {
                lightDummyDTwoInDefaultSlot,
                lightDummyDThreeInDefaultSlot,
                lightDummyEInDefaultSlot,
              } = treeOneGetDbuiNodes(contentWindow);

              expect(lightDummyDTwoInDefaultSlot.__newContext).to.deep.equal(localeContext);
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
                        ...(newColor1 ? { color1: newColor1 } : {}),
                        ...(newCounter1 ? { counter1: newCounter1 + 1 } : {})
                      });
                      newColor4 && this.setAttribute('context-color4', newColor4);
                      newColor1 && this.setAttribute('context-color1', newColor1);
                    }
                  };
                });

                container.innerHTML = '';
                container.innerHTML = treeOne;

                dbuiNodes = treeOneGetDbuiNodes(contentWindow);
                const {
                  dbuiWebComponentRoot, lightDummyDOneRoot,
                  lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA
                } = dbuiNodes;

                lightDummyDOneRoot.setContext({ counter1: 1, counter2: 1 });

                Object.keys(dbuiNodes).forEach((key) => {
                  const node = dbuiNodes[key];
                  if (node !== dbuiWebComponentRoot && node !== lightDummyDOneRoot) {
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

          DummyD.registerSelf();
          DummyE.registerSelf();
          DBUIRoot.registerSelf();
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
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const Base = getBase(contentWindow);
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
                  return 'dbui-context-provider';
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
            DBUIRoot.registrationName
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            const dbuiRoot = contentWindow.document.createElement('dbui-web-component-root');
            dbuiRoot.id = 'dbui-web-component-root';
            const contextProvider = contentWindow.document.createElement('dbui-context-provider');
            contextProvider.id = 'context-provider';
            contextProvider.setContext({ color1: 'cadetblue' });

            contextProvider.innerHTML = treeOneNoDbuiRoot;
            container.appendChild(dbuiRoot);
            dbuiRoot.appendChild(contextProvider);

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const { dbuiWebComponentRoot: _, ...rest } = dbuiNodes;
            Object.keys(rest).forEach((key) => {
              expect(dbuiNodes[key].__newContext).to.deep.equal({ ...localeContext, color1: 'cadetblue' });
              expect(dbuiNodes[key].__prevContext).to.deep.equal({});
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

    it(`context can be intercepted and overridden
    and onContextChanged can be fired more than once until DOM tree settles down (on Chrome)`, (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const Base = getBase(contentWindow);
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
                  return 'dbui-context-provider';
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
            DBUIRoot.registrationName
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            const dbuiRoot = contentWindow.document.createElement('dbui-web-component-root');
            dbuiRoot.id = 'dbui-web-component-root';
            const contextProvider = contentWindow.document.createElement('dbui-context-provider');
            contextProvider.id = 'context-provider';
            contextProvider.setContext({ color3: 'cadetblue', ...localeContext });

            contextProvider.innerHTML = treeOneNoDbuiRoot;
            dbuiRoot.appendChild(contextProvider);
            container.appendChild(dbuiRoot);

            expect(onAttributeChangedCallbackCalls.length).to.equal(1);
            expect(onAttributeChangedCallbackCalls[0].id).to.equal('light-dummy-d-three-in-default-slot');

            expect(onContextChangedCalls.length).equal(2);
            // first from light-dummy-d-one-root
            expect(onContextChangedCalls[0]).deep.equal({ newContext: { color3: 'cadetblue', ...localeContext }, prevContext: {} });
            // second from self attribute context-color3
            expect(onContextChangedCalls[1]).deep.equal({ newContext: { color3: 'olive', ...localeContext }, prevContext: { color3: 'cadetblue', ...localeContext } });

            // confirm expectations (context propagated and overridden) after dom is settled

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
          DBUIRoot.registerSelf();
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
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const Base = getBase(contentWindow);
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
                color4 && this.setAttribute('context-color4', color4);
              }
            };
          });

          const container = contentWindow.document.querySelector('#container');

          Promise.all([
            DBUIRoot.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            container.innerHTML = treeOne;

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              dbuiWebComponentRoot, lightDummyDOneRoot
            } = dbuiNodes;

            Object.keys(dbuiNodes).forEach((key) => {
              if ([dbuiWebComponentRoot, lightDummyDOneRoot].includes(dbuiNodes[key])) return;
              expect(dbuiNodes[key].__newContext.color4).to.equal('bisque');
              expect(dbuiNodes[key].getAttribute('context-color4')).to.equal('bisque');
              expect(dbuiNodes[key]._providingContext.color4).to.equal('bisque');
              expect(dbuiNodes[key]._lastReceivedContext.color4).to.equal('bisque');
            });

            expect(onContextChangedCalls.size).to.equal(23);
            onContextChangedCalls.forEach((value, key) => {
              if ([
                lightDummyDOneRoot
              ].includes(key)) {
                expect(value).to.equal(1);
              } else {
                expect(value).to.equal(2);
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
              if ([dbuiWebComponentRoot, lightDummyDOneRoot].includes(dbuiNodes[key])) return;
              expect(dbuiNodes[key].__newContext.color4).to.equal('forestgreen');
              expect(dbuiNodes[key].__prevContext.color4).to.equal('bisque');
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
              if ([dbuiWebComponentRoot, lightDummyDOneRoot].includes(dbuiNodes[key])) return;
              expect(dbuiNodes[key].__newContext.color4).to.equal('goldenrod');
              expect(dbuiNodes[key].__prevContext.color4).to.equal('forestgreen');
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
              if ([dbuiWebComponentRoot, lightDummyDOneRoot].includes(dbuiNodes[key])) return;
              expect(dbuiNodes[key].__newContext.color4).to.equal('lightcoral');
              expect(dbuiNodes[key].__prevContext.color4).to.equal('goldenrod');
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
          DBUIRoot.registerSelf();
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
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const Base = getBase(contentWindow);
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
            DBUIRoot.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            box2.innerHTML = treeOne;

            const { dbuiWebComponentRoot, ...dbuiNodes } = treeOneGetDbuiNodes(contentWindow);
            const {
              lightDummyDOneRoot
            } = dbuiNodes;

            const dbuiNodesNonLeaves = Object.keys(dbuiNodes).filter((key) => {
              return dbuiNodes[key].closestDbuiChildren.length !== 0;
            });

            expect(dbuiWebComponentRoot._providingContext).to.deep.equal(localeContext);
            expect(dbuiWebComponentRoot._lastReceivedContext).to.deep.equal({});
            expect(dbuiWebComponentRoot.__newContext).to.deep.equal(undefined);
            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color4: 'bisque' });
            expect(lightDummyDOneRoot._lastReceivedContext).to.deep.equal(localeContext);
            expect(lightDummyDOneRoot.__newContext).to.deep.equal(localeContext);
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
              if ([lightDummyDOneRoot].includes(node)) {
                expect(node.__newContext).to.deep.equal(localeContext);
              } else if ([dbuiWebComponentRoot].includes(node)) {
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
            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color4: 'bisque' });
            expect(lightDummyDOneRoot._lastReceivedContext).to.deep.equal(localeContext);
            expect(lightDummyDOneRoot.__newContext).to.deep.equal(localeContext);
            // every node resets and checks back context as a result of being removed and re-inserted in DOM tree
            expect(resetContextCalls.size).to.equal(23);
            expect(checkContextCalls.size).to.equal(23);
            // every parent fired again _getContext
            expect(getContextCalls.size).to.equal(dbuiNodesNonLeaves.length); // 16
            // no attributeChangedCallback fired anymore
            expect(setContextCalls.size).to.equal(0);
            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if ([lightDummyDOneRoot].includes(node)) {
                expect(node.__newContext).to.deep.equal(localeContext);
              } else if ([dbuiWebComponentRoot].includes(node)) {
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
            expect(lightDummyDOneRoot.__newContext).to.deep.equal({});
            expect(resetContextCalls.size).to.equal(23);
            expect(checkContextCalls.size).to.equal(0);
            expect(getContextCalls.size).to.equal(0);
            expect(setContextCalls.size).to.equal(0);
            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if (node === lightDummyDOneRoot) {
                expect(node.__newContext).to.deep.equal({});
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
          DBUIRoot.registerSelf();
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
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const Base = getBase(contentWindow);
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
            DBUIRoot.registrationName
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            container.innerHTML = treeOne;

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              dbuiWebComponentRoot, lightDummyDOneRoot
            } = dbuiNodes;

            lightDummyDOneRoot.setContext({ color3: 'cadetblue', color4: 'goldenrod' });

            expect(dbuiWebComponentRoot._providingContext).to.deep.equal(localeContext);
            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color4: 'goldenrod' });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if ([lightDummyDOneRoot].includes(node)) {
                expect(node.__newContext).to.deep.equal(localeContext);
              } else if ([dbuiWebComponentRoot].includes(node)) {
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
          DBUIRoot.registerSelf();
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
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const Base = getBase(contentWindow);
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
            DBUIRoot.registrationName
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            container.innerHTML = treeOne;

            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              dbuiWebComponentRoot, lightDummyDOneRoot
            } = dbuiNodes;

            lightDummyDOneRoot.setContext({ color3: 'cadetblue', color4: 'goldenrod' });

            expect(dbuiWebComponentRoot._providingContext).to.deep.equal(localeContext);
            expect(lightDummyDOneRoot._providingContext).to.deep.equal({ color3: 'cadetblue', color4: 'goldenrod' });

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              if ([lightDummyDOneRoot].includes(node)) {
                expect(node.__newContext).to.deep.equal(localeContext);
              } else if ([dbuiWebComponentRoot].includes(node)) {
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
          DBUIRoot.registerSelf();
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
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const Base = getBase(contentWindow);
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
              DBUIRoot.registrationName
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
              const {
                dbuiWebComponentRoot, lightDummyDOneRoot
              } = dbuiNodes;

              lightDummyDOneRoot.dir = 'rtl';
              lightDummyDOneRoot.setContext({ color4: 'goldenrod' });


              Object.keys(dbuiNodes).forEach((key) => {
                const node = dbuiNodes[key];
                if (node === dbuiWebComponentRoot) {
                  expect(node.__newContext).to.equal(undefined);
                } else if (node === lightDummyDOneRoot) {
                  expect(node.__newContext).to.deep.equal(localeContext);
                  expect(node.__newDir).to.equal('rtl');
                  expect(node.__prevDir).to.equal('ltr');
                } else {
                  expect(node.__newContext).to.deep.equal({ color4: 'goldenrod', ...localeContext, dbuiDir: 'rtl' });
                  expect(node.__prevContext).to.deep.equal({ dbuiDir: 'rtl', dbuiLang: 'en' });
                  expect(node.__newDir).to.equal('rtl');
                  expect(node.__prevDir).to.equal('ltr');
                }
              });

              lightDummyDOneRoot.dir = '';
              lightDummyDOneRoot._unsetAndRelinkContext('color4');

              Object.keys(dbuiNodes).forEach((key) => {
                const node = dbuiNodes[key];
                if (node === dbuiWebComponentRoot) {
                  expect(node.__newContext).to.equal(undefined);
                } else if (node === lightDummyDOneRoot) {
                  expect(node.__newContext).to.deep.equal(localeContext);
                  expect(node.__newDir).to.equal('ltr');
                  expect(node.__prevDir).to.equal('rtl');
                } else {
                  expect(node.__newContext).to.deep.equal({ color4: undefined, ...localeContext, dbuiDir: 'ltr' });
                  expect(node.__prevContext).to.deep.equal({ color4: 'goldenrod', dbuiDir: 'ltr', dbuiLang: 'en' });
                  expect(node.__newDir).to.equal('ltr');
                  expect(node.__prevDir).to.equal('rtl');
                }
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
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const Base = getBase(contentWindow);
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
              DBUIRoot.registrationName
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const test = ({
                firstHalfColor,
                secondHalfColor,
                firstHalfColorPrev,
                secondHalfColorPrev,
                exceptNodes = []
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
                ]
                  .filter((node) => !exceptNodes.includes(node))
                  .forEach((node) => {
                    expect(node.__newContext.color4).to.equal(firstHalfColor);
                    expect(node.__prevContext.color4).to.equal(firstHalfColorPrev);
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
                ]
                  .filter((node) => !exceptNodes.includes(node))
                  .forEach((node) => {
                    expect(node.__newContext.color4).to.equal(secondHalfColor);
                    expect(node.__prevContext.color4).to.equal(secondHalfColorPrev);
                  });
              };

              const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
              const {
                lightDummyDOneRoot,
                lightDummyDThreeInDefaultSlot
              } = dbuiNodes;

              // lightDummyDThreeInDefaultSlot is in the first half
              lightDummyDThreeInDefaultSlot.setContext({ color4: 'cadetblue' });

              test({
                firstHalfColor: undefined, secondHalfColor: 'cadetblue',
                firstHalfColorPrev: undefined, secondHalfColorPrev: undefined
              });

              lightDummyDOneRoot.setContext({ color4: 'goldenrod' });

              test({
                firstHalfColor: 'goldenrod', secondHalfColor: 'cadetblue',
                firstHalfColorPrev: undefined, secondHalfColorPrev: undefined
              });

              lightDummyDThreeInDefaultSlot._unsetAndRelinkContext('color4');

              test({
                firstHalfColor: 'goldenrod', secondHalfColor: 'goldenrod',
                firstHalfColorPrev: undefined, secondHalfColorPrev: 'cadetblue',
              });

              lightDummyDOneRoot.setContext({ color4: undefined });

              test({
                firstHalfColor: undefined, secondHalfColor: undefined,
                firstHalfColorPrev: 'goldenrod', secondHalfColorPrev: 'goldenrod'
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
    });
  });
});
