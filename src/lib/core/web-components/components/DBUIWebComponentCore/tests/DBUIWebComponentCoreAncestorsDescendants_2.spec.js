import { expect } from 'chai';
import getDBUIWebComponentCore from '../DBUIWebComponentCore';
import getDBUIWebComponentRoot from '../../DBUIWebComponentRoot/DBUIWebComponentRoot';
import ensureSingleRegistration from '../../../../internals/ensureSingleRegistration';
import inIframe from '../../../../../../../testUtils/inIframe';
import { isSafari } from '../../../../utils/browserDetect';
import { randomArrayNum } from '../../../../utils/math';

/* eslint max-len: 0 */
/* eslint camelcase: 0 */
/* eslint prefer-const: 0 */
/* eslint one-var-declaration-per-line: 0 */
/* eslint one-var: 0 */

function getDummyX(
  registrationName, className,
  {
    style = 'host: { display: block; } div { padding-left: 10px; }',
    dependentClasses = [], dependentHTML = '',
    contextSubscribe = [], contextProvide = [],
    callbacks = {
      // onConnectedCallback
    }
  } = {}
) {
  function factory(win) {
    return ensureSingleRegistration(win, registrationName, () => {
      const {
        DBUIWebComponentBase,
        defineCommonStaticMethods,
        Registerable
      } = getDBUIWebComponentCore(win);

      const klass = class extends DBUIWebComponentBase {
        static get registrationName() {
          return registrationName;
        }

        static get name() {
          return className;
        }

        static get dependencies() {
          return [...super.dependencies, ...dependentClasses];
        }

        static get contextProvide() {
          return [...super.contextProvide, ...contextProvide];
        }

        static get contextSubscribe() {
          return [...super.contextSubscribe, ...contextSubscribe];
        }

        static get templateInnerHTML() {
          return `
            <style>${style}</style>
            <div>
              <b>${registrationName}</b>
              ${dependentHTML}
              ${dependentHTML.includes('<slot></slot>') ? '' : '<slot></slot>'}
            </div>
          `;
        }

        connectedCallback() {
          super.connectedCallback();
        }

        onConnectedCallback() {
          super.onConnectedCallback();
          callbacks.onConnectedCallback && callbacks.onConnectedCallback(this);
        }

        onDisconnectedCallback() {
          super.onDisconnectedCallback();
          callbacks.onDisconnectedCallback && callbacks.onDisconnectedCallback(this);
        }
      };

      return Registerable(
        defineCommonStaticMethods(
          klass
        )
      );
    });
  }
  return factory;
}

describe('DBUIWebComponentBase ancestors/descendants and registrations - 2', () => {
  xit('live testing', (done) => {
    inIframe({
      headStyle: `
      `,
      bodyHTML: `
      <div id="wrapper">
        <dbui-web-component-root id="dbui-web-component-root">
          <!--<dbui-dummy-d id="dummy-d">-->
            <dbui-dummy-a id="dummy-a-light"></dbui-dummy-a>
            <!--<dbui-dummy-d id="dummy-d-light"></dbui-dummy-d>-->
          <!--</dbui-dummy-d>-->
        </dbui-web-component-root>
      </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DummyH = getDummyX('dbui-dummy-h', 'DummyH', {
          dependentClasses: [],
          dependentHTML: `
          `
        })(contentWindow);
        const DummyG = getDummyX('dbui-dummy-g', 'DummyG', {
          dependentClasses: [DummyH],
          dependentHTML: `
          <dbui-dummy-h id="dbui-dummy-h-shadow">
          </dbui-dummy-h>
          `
        })(contentWindow);
        const DummyF = getDummyX('dbui-dummy-f', 'DummyF', {
          dependentClasses: [],
          dependentHTML: `
          `
        })(contentWindow);
        const DummyE = getDummyX('dbui-dummy-e', 'DummyE', {
          dependentClasses: [DummyG, DummyF],
          dependentHTML: `
          <dbui-dummy-f id="dbui-dummy-f-shadow">
            <dbui-dummy-g id="dbui-dummy-g-light-in-shadow">
            </dbui-dummy-g>
          </dbui-dummy-f>
          `
        })(contentWindow);
        const DummyD = getDummyX('dbui-dummy-d', 'DummyD', {
          dependentClasses: [DummyE],
          dependentHTML: `
          <dbui-dummy-e id="dbui-dummy-e-shadow">
          </dbui-dummy-e>
          `
        })(contentWindow);
        const DummyC = getDummyX('dbui-dummy-c', 'DummyC', {})(contentWindow);
        const DummyB = getDummyX('dbui-dummy-b', 'DummyB', {})(contentWindow);
        const DummyA = getDummyX('dbui-dummy-a', 'DummyA', {
          callbacks: { onConnectedCallback: () => {} },
          dependentClasses: [DummyC, DummyD, DummyB],
          dependentHTML: `
          <dbui-dummy-b id="dbui-dummy-b-shadow">
            <dbui-dummy-c id="dbui-dummy-c-shadow">
              <dbui-dummy-d id="dbui-dummy-d-shadow">
              </dbui-dummy-d>
            </dbui-dummy-c>
          </dbui-dummy-b>
          `
        })(contentWindow);

        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          // const wrapper = contentWindow.document.querySelector('#wrapper');
          const dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
          // const dummyA = contentWindow.document.querySelector(DummyA.registrationName);

          dbuiRoot.innerHTML = `
          <dbui-dummy-a id="dummy-a-light"></dbui-dummy-a>
          <!--<dbui-dummy-d id="dummy-d-light"></dbui-dummy-d>-->
          `;

          setTimeout(() => {
            iframe.remove();
            done();
          }, 55000);
        });

        // DummyC.registerSelf();
        // DummyB.registerSelf();
        // DummyD.registerSelf();
        DummyA.registerSelf();
        // DummyDEF.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  describe('in light DOM', () => {
    describe(`
    when dbui-web-component-root is registered after DOM being written
    and after all components have been mounted (which is required),
    or DOM is written after components were registered
    `, () => {
      it(`
      onConnectedCallback is fired for all components in predictable order
      and each component has visibility on its upgraded parent and upgraded children
      `, (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="wrapper">
            <dbui-web-component-root id="dbui-web-component-root">
              <dbui-dummy-0 id="dbui-dummy-0">
                <dbui-dummy-a id="dbui-dummy-a">
                  <dbui-dummy-b id="dbui-dummy-b">
                    <dbui-dummy-c id="dbui-dummy-c">
                    </dbui-dummy-c>
                  </dbui-dummy-b>
                </dbui-dummy-a>
                <dbui-dummy-d id="dbui-dummy-d">
                  <dbui-dummy-e id="dbui-dummy-e">
                    <dbui-dummy-f id="dbui-dummy-f">
                    </dbui-dummy-f>
                  </dbui-dummy-e>
                </dbui-dummy-d>
              </dbui-dummy-0>
            </dbui-web-component-root>
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const Dummy0 = getDummyX('dbui-dummy-0', 'Dummy0', {
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummy0
              }
            })(contentWindow);

            const DummyA = getDummyX(
              'dbui-dummy-a', 'DummyA', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyA
                }
              }
            )(contentWindow);

            const DummyB = getDummyX(
              'dbui-dummy-b', 'DummyB', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyB
                }
              }
            )(contentWindow);

            const DummyC = getDummyX(
              'dbui-dummy-c', 'DummyC', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyC
                }
              }
            )(contentWindow);

            const DummyD = getDummyX(
              'dbui-dummy-d', 'DummyD', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyD
                }
              }
            )(contentWindow);
            const DummyE = getDummyX(
              'dbui-dummy-e', 'DummyE', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyE
                }
              }
            )(contentWindow);

            const DummyF = getDummyX(
              'dbui-dummy-f', 'DummyF', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyF
                }
              }
            )(contentWindow);

            const DummyG = getDummyX(
              'dbui-dummy-g', 'DummyG', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyG
                }
              }
            )(contentWindow);

            let connectedComponents = [];

            function onConnectedCallbackDummy0(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d',
                'dbui-dummy-c', 'dbui-dummy-b', 'dbui-dummy-a'
              ]);
              expect(self.closestDbuiParent.id).to.equal('dbui-web-component-root');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-a', 'dbui-dummy-d'
              ]);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyA(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d', 'dbui-dummy-c', 'dbui-dummy-b'
              ]);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-0');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-b'
              ]);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyB(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d', 'dbui-dummy-c'
              ]);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-a');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-c'
              ]);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyC(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d'
              ]);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-b');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyD(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f', 'dbui-dummy-e'
              ]);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-0');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-e'
              ]);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyE(self) {
              expect(connectedComponents).to.deep.equal(['dbui-dummy-f']);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-d');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-f'
              ]);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyF(self) {
              expect(connectedComponents).to.deep.equal([]);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-e');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyG(self) {
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              connectedComponents.push(self.id);
            }

            Promise.all(
              [DBUIRoot.registrationName].map((localName) => contentWindow.customElements.whenDefined(localName))
            ).then(() => {
              const wrapper = contentWindow.document.querySelector('#wrapper');
              let dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              let dbuiDummy0 = contentWindow.document.querySelector('#dbui-dummy-0');
              let dbuiDummyA = contentWindow.document.querySelector('#dbui-dummy-a');
              let dbuiDummyD = contentWindow.document.querySelector('#dbui-dummy-d');
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d', 'dbui-dummy-c', 'dbui-dummy-b', 'dbui-dummy-a', 'dbui-dummy-0'
              ]);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dbuiDummy0]);
              expect(dbuiDummy0.closestDbuiChildren).to.deep.equal([dbuiDummyA, dbuiDummyD]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);


              // --------------- test 2: rewriting wrapper innerHTML
              connectedComponents = [];
              wrapper.innerHTML = `
              <dbui-web-component-root id="dbui-web-component-root">
                <dbui-dummy-0 id="dbui-dummy-0">
                  <dbui-dummy-a id="dbui-dummy-a">
                    <dbui-dummy-b id="dbui-dummy-b">
                      <dbui-dummy-c id="dbui-dummy-c">
                      </dbui-dummy-c>
                    </dbui-dummy-b>
                  </dbui-dummy-a>
                  <dbui-dummy-d id="dbui-dummy-d">
                    <dbui-dummy-e id="dbui-dummy-e">
                      <dbui-dummy-f id="dbui-dummy-f">
                      </dbui-dummy-f>
                    </dbui-dummy-e>
                  </dbui-dummy-d>
                </dbui-dummy-0>
              </dbui-web-component-root>
              `;

              dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              dbuiDummy0 = contentWindow.document.querySelector('#dbui-dummy-0');
              dbuiDummyA = contentWindow.document.querySelector('#dbui-dummy-a');
              dbuiDummyD = contentWindow.document.querySelector('#dbui-dummy-d');

              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d',
                'dbui-dummy-c', 'dbui-dummy-b', 'dbui-dummy-a', 'dbui-dummy-0'
              ]);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dbuiDummy0]);
              expect(dbuiDummy0.closestDbuiChildren).to.deep.equal([dbuiDummyA, dbuiDummyD]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);

              // --------------- test 3: rewriting dbuiRoot innerHTML
              connectedComponents = [];
              dbuiRoot.innerHTML = `
              <dbui-dummy-0 id="dbui-dummy-0">
                <dbui-dummy-a id="dbui-dummy-a">
                  <dbui-dummy-b id="dbui-dummy-b">
                    <dbui-dummy-c id="dbui-dummy-c">
                    </dbui-dummy-c>
                  </dbui-dummy-b>
                </dbui-dummy-a>
                <dbui-dummy-d id="dbui-dummy-d">
                  <dbui-dummy-e id="dbui-dummy-e">
                    <dbui-dummy-f id="dbui-dummy-f">
                    </dbui-dummy-f>
                  </dbui-dummy-e>
                </dbui-dummy-d>
              </dbui-dummy-0>
              `;

              dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              dbuiDummy0 = contentWindow.document.querySelector('#dbui-dummy-0');
              dbuiDummyA = contentWindow.document.querySelector('#dbui-dummy-a');
              dbuiDummyD = contentWindow.document.querySelector('#dbui-dummy-d');

              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d',
                'dbui-dummy-c', 'dbui-dummy-b', 'dbui-dummy-a', 'dbui-dummy-0'
              ]);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dbuiDummy0]);
              expect(dbuiDummy0.closestDbuiChildren).to.deep.equal([dbuiDummyA, dbuiDummyD]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);

              // --------------- test 4: mounting all nodes in dbuiRoot
              connectedComponents = [];
              dbuiRoot.innerHTML = '';

              const dummy0 = contentWindow.document.createElement('dbui-dummy-0');
              dummy0.id = 'dbui-dummy-0';
              const dummyA2 = contentWindow.document.createElement('dbui-dummy-a');
              dummyA2.id = 'dbui-dummy-a';
              const dummyB2 = contentWindow.document.createElement('dbui-dummy-b');
              dummyB2.id = 'dbui-dummy-b';
              const dummyC2 = contentWindow.document.createElement('dbui-dummy-c');
              dummyC2.id = 'dbui-dummy-c';
              const dummyD2 = contentWindow.document.createElement('dbui-dummy-d');
              dummyD2.id = 'dbui-dummy-d';
              const dummyE2 = contentWindow.document.createElement('dbui-dummy-e');
              dummyE2.id = 'dbui-dummy-e';
              const dummyF2 = contentWindow.document.createElement('dbui-dummy-f');
              dummyF2.id = 'dbui-dummy-f';
              const dummyG = contentWindow.document.createElement('dbui-dummy-g');
              dummyG.id = 'dbui-dummy-g';

              dummyA2.appendChild(dummyB2);
              dummyB2.appendChild(dummyC2);
              dummyD2.appendChild(dummyE2);
              dummyE2.appendChild(dummyF2);

              dummy0.appendChild(dummyA2);
              dummy0.appendChild(dummyD2);

              dbuiRoot.appendChild(dummy0);

              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummy0]);
              expect(dummy0.closestDbuiChildren).to.deep.equal([dummyA2, dummyD2]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);

              // --------------- test 5: re-mounting all nodes in dbuiRoot
              connectedComponents = [];
              dummy0.remove();
              dbuiRoot.appendChild(dummy0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummy0]);
              expect(dummy0.closestDbuiChildren).to.deep.equal([dummyA2, dummyD2]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(connectedComponents.length).to.equal(7);

              // --------------- test 6: re-mounting dbuiRoot
              connectedComponents = [];
              dbuiRoot.remove();
              wrapper.appendChild(dbuiRoot);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(connectedComponents.length).to.equal(7);

              // --------------- test 7: mounting new node in some leaf node
              dummyF2.appendChild(dummyG);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(connectedComponents.length).to.equal(8);
              expect(dummyF2.closestDbuiChildren[0]).to.equal(dummyG);
              expect(dummyG.closestDbuiParent).to.equal(dummyF2);

              // --------------- test 8: mounting new node in dbuiRoot
              dbuiRoot.appendChild(dummyG);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dummyG.closestDbuiParent).to.equal(dbuiRoot);
              expect(dbuiRoot.closestDbuiChildren.includes(dummyG)).to.equal(true);
              expect(dummyF2.closestDbuiChildren[0]).to.equal(undefined);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            // Order of registration is random
            // but DBUIRoot is registered last.
            Dummy0.registerSelf();
            DummyG.registerSelf();
            DummyC.registerSelf();
            DummyB.registerSelf();
            DummyA.registerSelf();
            DummyD.registerSelf();
            DummyF.registerSelf();
            DummyE.registerSelf();
            DBUIRoot.registerSelf();
          }
        });
      });
    });

    describe('when there is just one child underneath dbui-web-component-root', () => {
      it('onConnectedCallback is fired for it and for its shadow children', (done) => {
        inIframe({
          headStyle: '',
          bodyHTML: `
          <div id="wrapper">
            <dbui-web-component-root id="dbui-web-component-root">
              <dbui-dummy-a id="dbui-dummy-a"></dbui-dummy-a>
            </dbui-web-component-root>
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {

            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);

            const DummyC = getDummyX('dbui-dummy-c', 'DummyC', {
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyC
              }
            })(contentWindow);

            const DummyB = getDummyX('dbui-dummy-b', 'DummyB', {
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyB
              }
            })(contentWindow);

            const DummyA = getDummyX('dbui-dummy-a', 'DummyA', {
              dependentClasses: [DummyC, DummyB],
              dependentHTML: `
                <dbui-dummy-b id="dbui-dummy-b-shadow">
                  <dbui-dummy-c id="dbui-dummy-c-shadow">
                  </dbui-dummy-c>
                </dbui-dummy-b>
                `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyA
              }
            })(contentWindow);

            let connectedComponents = [];

            function onConnectedCallbackDummyA(self) {
              expect(connectedComponents).to.deep.equal(['dbui-dummy-c-shadow', 'dbui-dummy-b-shadow']);
              expect(self.closestDbuiParent.id).to.equal('dbui-web-component-root');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-b-shadow'
              ]);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyB(self) {
              expect(connectedComponents).to.deep.equal(['dbui-dummy-c-shadow']);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-a');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-c-shadow'
              ]);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyC(self) {
              expect(connectedComponents).to.deep.equal([]);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-b-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              connectedComponents.push(self.id);
            }

            Promise.all(
              [DBUIRoot.registrationName].map((localName) => contentWindow.customElements.whenDefined(localName))
            ).then(() => {

              const wrapper = contentWindow.document.querySelector('#wrapper');
              let dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              let dummyA = contentWindow.document.querySelector('dbui-dummy-a');

              expect(connectedComponents).to.deep.equal(['dbui-dummy-c-shadow', 'dbui-dummy-b-shadow', 'dbui-dummy-a']);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummyA]);
              expect(dummyA.closestDbuiParent).to.deep.equal(dbuiRoot);


              // --------------- test 2: rewriting wrapper innerHTML
              connectedComponents = [];
              wrapper.innerHTML = `
              <dbui-web-component-root id="dbui-web-component-root">
                <dbui-dummy-a id="dbui-dummy-a"></dbui-dummy-a>
              </dbui-web-component-root>
              `;

              dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              dummyA = contentWindow.document.querySelector('dbui-dummy-a');

              expect(connectedComponents).to.deep.equal(['dbui-dummy-c-shadow', 'dbui-dummy-b-shadow', 'dbui-dummy-a']);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummyA]);
              expect(dummyA.closestDbuiParent).to.deep.equal(dbuiRoot);

              // --------------- test 3: mounting child under dbuiRoot
              connectedComponents = [];
              const dummyA2 = contentWindow.document.createElement('dbui-dummy-a');
              dummyA2.id = 'dbui-dummy-a';
              dbuiRoot.innerHTML = '';
              dbuiRoot.appendChild(dummyA2);

              expect(connectedComponents).to.deep.equal(['dbui-dummy-c-shadow', 'dbui-dummy-b-shadow', 'dbui-dummy-a']);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummyA2]);
              expect(dummyA2.closestDbuiParent).to.deep.equal(dbuiRoot);


              // --------------- test 4: re-mounting child under dbuiRoot
              connectedComponents = [];
              dummyA2.remove();
              dbuiRoot.appendChild(dummyA2);

              expect(connectedComponents).to.deep.equal(['dbui-dummy-c-shadow', 'dbui-dummy-b-shadow', 'dbui-dummy-a']);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummyA2]);
              expect(dummyA2.closestDbuiParent).to.deep.equal(dbuiRoot);

              // --------------- test 5: re-writing dbuiRoot innerHTML
              connectedComponents = [];
              dbuiRoot.innerHTML = `
              <dbui-dummy-a id="dbui-dummy-a"></dbui-dummy-a>
              `;
              dummyA = contentWindow.document.querySelector('dbui-dummy-a');

              expect(connectedComponents).to.deep.equal(['dbui-dummy-c-shadow', 'dbui-dummy-b-shadow', 'dbui-dummy-a']);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummyA]);
              expect(dummyA.closestDbuiParent).to.deep.equal(dbuiRoot);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyA.registerSelf();
            DBUIRoot.registerSelf();
          }
        });
      });
    });
  });

  describe('in shadow DOM', () => {
    describe(`
    when dbui-web-component-root is registered after DOM being written
    and after all components have been mounted (which is required),
    or DOM is written after components were registered
    `, () => {
      it(`
      onConnectedCallback is fired for all shadow components in predictable order
      and each component has visibility on its upgraded shadow parent and upgraded shadow children
      `, (done) => {
        inIframe({
          headStyle: '',
          bodyHTML: `
          <div id="wrapper">
            <dbui-web-component-root id="dbui-web-component-root">
              <dbui-dummy-0 id="dbui-dummy-0">
                <dbui-dummy-a id="dbui-dummy-a"></dbui-dummy-a>
                <dbui-dummy-aa id="dbui-dummy-aa"></dbui-dummy-aa>
              </dbui-dummy-0>
            </dbui-web-component-root>
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);

            const DummyG = getDummyX(
              'dbui-dummy-g', 'DummyG', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyG
                }
              }
            )(contentWindow);

            const DummyF = getDummyX(
              'dbui-dummy-f', 'DummyF', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyF
                }
              }
            )(contentWindow);

            const DummyE = getDummyX(
              'dbui-dummy-e', 'DummyE', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyE
                }
              }
            )(contentWindow);

            const DummyD = getDummyX(
              'dbui-dummy-d', 'DummyD', {
                dependentClasses: [DummyE, DummyF, DummyG],
                dependentHTML: `
                <dbui-dummy-e id="dbui-dummy-e-shadow">
                  <dbui-dummy-f id="dbui-dummy-f-shadow">
                    <dbui-dummy-g id="dbui-dummy-g-shadow">
                    </dbui-dummy-g>
                  </dbui-dummy-f>
                </dbui-dummy-e>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyD
                }
              }
            )(contentWindow);

            const DummyDD = getDummyX(
              'dbui-dummy-dd', 'DummyDD', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyDD
                }
              }
            )(contentWindow);

            const DummyC = getDummyX(
              'dbui-dummy-c', 'DummyC', {
                dependentClasses: [DummyD],
                dependentHTML: `
                <dbui-dummy-d id="dbui-dummy-d-shadow"></dbui-dummy-d>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyC
                }
              }
            )(contentWindow);

            const DummyCC = getDummyX(
              'dbui-dummy-cc', 'DummyCC', {
                dependentClasses: [DummyDD],
                dependentHTML: `
                <dbui-dummy-dd id="dbui-dummy-dd-shadow"></dbui-dummy-dd>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyCC
                }
              }
            )(contentWindow);

            const DummyB = getDummyX(
              'dbui-dummy-b', 'DummyB', {
                dependentClasses: [DummyC],
                dependentHTML: `
                <dbui-dummy-c id="dbui-dummy-c-shadow"></dbui-dummy-c>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyB
                }
              }
            )(contentWindow);

            const DummyBB = getDummyX(
              'dbui-dummy-bb', 'DummyBB', {
                dependentClasses: [DummyCC],
                dependentHTML: `
                <dbui-dummy-cc id="dbui-dummy-cc-shadow"></dbui-dummy-cc>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyBB
                }
              }
            )(contentWindow);

            const DummyA = getDummyX(
              'dbui-dummy-a', 'DummyA', {
                dependentClasses: [DummyB],
                dependentHTML: `
                <dbui-dummy-b id="dbui-dummy-b-shadow"></dbui-dummy-b>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyA
                }
              }
            )(contentWindow);

            const DummyAA = getDummyX(
              'dbui-dummy-aa', 'DummyAA', {
                dependentClasses: [DummyBB],
                dependentHTML: `
                <dbui-dummy-bb id="dbui-dummy-bb-shadow"></dbui-dummy-bb>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyAA
                }
              }
            )(contentWindow);

            const Dummy0 = getDummyX(
              'dbui-dummy-0', 'Dummy0', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummy0
                }
              }
            )(contentWindow);

            let connectedComponents = [];

            function onConnectedCallbackDummyG(self) {
              expect(connectedComponents).to.deep.equal([]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-f-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.length).to.equal(0);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyF(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-e-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-g-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyE(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-d-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-f-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyD(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-c-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-e-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyDD(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow',
                'dbui-dummy-d-shadow', 'dbui-dummy-c-shadow', 'dbui-dummy-b-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-cc-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.length).to.equal(0);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyC(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow',
                'dbui-dummy-d-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-b-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-d-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyCC(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow',
                'dbui-dummy-d-shadow', 'dbui-dummy-c-shadow', 'dbui-dummy-b-shadow',
                'dbui-dummy-dd-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-bb-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-dd-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyB(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow',
                'dbui-dummy-d-shadow', 'dbui-dummy-c-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-a');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-c-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyBB(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow',
                'dbui-dummy-d-shadow', 'dbui-dummy-c-shadow', 'dbui-dummy-b-shadow',
                'dbui-dummy-dd-shadow', 'dbui-dummy-cc-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-aa');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-cc-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyA(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow',
                'dbui-dummy-d-shadow', 'dbui-dummy-c-shadow', 'dbui-dummy-b-shadow',
                'dbui-dummy-dd-shadow', 'dbui-dummy-cc-shadow', 'dbui-dummy-bb-shadow',
                'dbui-dummy-aa'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-0');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-b-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyAA(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow',
                'dbui-dummy-d-shadow', 'dbui-dummy-c-shadow', 'dbui-dummy-b-shadow',
                'dbui-dummy-dd-shadow', 'dbui-dummy-cc-shadow', 'dbui-dummy-bb-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-0');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-bb-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummy0(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-g-shadow', 'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow',
                'dbui-dummy-d-shadow', 'dbui-dummy-c-shadow', 'dbui-dummy-b-shadow',
                'dbui-dummy-dd-shadow', 'dbui-dummy-cc-shadow', 'dbui-dummy-bb-shadow',
                'dbui-dummy-aa', 'dbui-dummy-a'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-web-component-root');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-a', 'dbui-dummy-aa']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            Promise.all(
              [DBUIRoot.registrationName].map((localName) => contentWindow.customElements.whenDefined(localName))
            ).then(() => {

              const wrapper = contentWindow.document.querySelector('#wrapper');
              let dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              let dummy0 = contentWindow.document.querySelector('dbui-dummy-0');
              let dummyA = contentWindow.document.querySelector('dbui-dummy-a');
              let dummyAA = contentWindow.document.querySelector('dbui-dummy-aa');

              expect(connectedComponents.length).to.equal(12);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummy0]);
              expect(dummy0.closestDbuiParent).to.equal(dbuiRoot);
              expect(dummy0.closestDbuiChildren).to.deep.equal([dummyA, dummyAA]);
              expect(dummyA.closestDbuiParent).to.equal(dummy0);
              expect(dummyAA.closestDbuiParent).to.equal(dummy0);

              // ----------------- test 2: re-writing wrapper innerHTML
              connectedComponents = [];
              wrapper.innerHTML = `
              <dbui-web-component-root id="dbui-web-component-root">
                <dbui-dummy-0 id="dbui-dummy-0">
                  <dbui-dummy-a id="dbui-dummy-a"></dbui-dummy-a>
                  <dbui-dummy-aa id="dbui-dummy-aa"></dbui-dummy-aa>
                </dbui-dummy-0>
              </dbui-web-component-root>
              `;

              dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              dummy0 = contentWindow.document.querySelector('dbui-dummy-0');
              dummyA = contentWindow.document.querySelector('dbui-dummy-a');
              dummyAA = contentWindow.document.querySelector('dbui-dummy-aa');

              expect(connectedComponents.length).to.equal(12);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummy0]);
              expect(dummy0.closestDbuiParent).to.equal(dbuiRoot);
              expect(dummy0.closestDbuiChildren).to.deep.equal([dummyA, dummyAA]);
              expect(dummyA.closestDbuiParent).to.equal(dummy0);
              expect(dummyAA.closestDbuiParent).to.equal(dummy0);

              // ----------------- test 3: re-writing dbuiRoot innerHTML
              dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              connectedComponents = [];

              dbuiRoot.innerHTML = `
              <dbui-dummy-0 id="dbui-dummy-0">
                <dbui-dummy-a id="dbui-dummy-a"></dbui-dummy-a>
                <dbui-dummy-aa id="dbui-dummy-aa"></dbui-dummy-aa>
              </dbui-dummy-0>
              `;

              dummy0 = contentWindow.document.querySelector('dbui-dummy-0');
              dummyA = contentWindow.document.querySelector('dbui-dummy-a');
              dummyAA = contentWindow.document.querySelector('dbui-dummy-aa');

              expect(connectedComponents.length).to.equal(12);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummy0]);
              expect(dummy0.closestDbuiParent).to.equal(dbuiRoot);
              expect(dummy0.closestDbuiChildren).to.deep.equal([dummyA, dummyAA]);
              expect(dummyA.closestDbuiParent).to.equal(dummy0);
              expect(dummyAA.closestDbuiParent).to.equal(dummy0);

              // ----------------- test 4: mounting all nodes under dbuiRoot
              dbuiRoot.innerHTML = '';
              connectedComponents = [];

              dummy0 = contentWindow.document.createElement('dbui-dummy-0');
              dummy0.id = 'dbui-dummy-0';
              dummyA = contentWindow.document.createElement('dbui-dummy-a');
              dummyA.id = 'dbui-dummy-a';
              dummyAA = contentWindow.document.createElement('dbui-dummy-aa');
              dummyAA.id = 'dbui-dummy-aa';


              dummy0.appendChild(dummyA);
              dummy0.appendChild(dummyAA);

              dbuiRoot.appendChild(dummy0);

              dummy0 = contentWindow.document.querySelector('dbui-dummy-0');
              dummyA = contentWindow.document.querySelector('dbui-dummy-a');
              dummyAA = contentWindow.document.querySelector('dbui-dummy-aa');

              expect(connectedComponents.length).to.equal(12);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummy0]);
              expect(dummy0.closestDbuiParent).to.equal(dbuiRoot);
              expect(dummy0.closestDbuiChildren).to.deep.equal([dummyA, dummyAA]);
              expect(dummyA.closestDbuiParent).to.equal(dummy0);
              expect(dummyAA.closestDbuiParent).to.equal(dummy0);

              // ----------------- test 5: re-mounting all nodes under dbuiRoot
              dummy0.remove();
              connectedComponents = [];

              dbuiRoot.appendChild(dummy0);

              expect(connectedComponents.length).to.equal(12);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummy0]);
              expect(dummy0.closestDbuiParent).to.equal(dbuiRoot);
              expect(dummy0.closestDbuiChildren).to.deep.equal([dummyA, dummyAA]);
              expect(dummyA.closestDbuiParent).to.equal(dummy0);
              expect(dummyAA.closestDbuiParent).to.equal(dummy0);

              // ----------------- test 6: re-mounting dbuiRoot
              dbuiRoot.remove();
              connectedComponents = [];

              wrapper.appendChild(dbuiRoot);

              expect(connectedComponents.length).to.equal(12);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot.closestDbuiChildren).to.deep.equal([dummy0]);
              expect(dummy0.closestDbuiParent).to.equal(dbuiRoot);
              expect(dummy0.closestDbuiChildren).to.deep.equal([dummyA, dummyAA]);
              expect(dummyA.closestDbuiParent).to.equal(dummy0);
              expect(dummyAA.closestDbuiParent).to.equal(dummy0);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyAA.registerSelf();
            Dummy0.registerSelf();
            DummyA.registerSelf();
            DBUIRoot.registerSelf();
          }
        });
      });
    });

    describe(`
    when shadow child is added at runtime
    `, () => {
      it(`
      onConnectedCallback is fired for all shadow components in predictable order
      and each component has visibility on its upgraded shadow parent and upgraded shadow children
      `, (done) => {
        inIframe({
          headStyle: '',
          bodyHTML: `
          <div id="wrapper">
            <dbui-web-component-root id="dbui-web-component-root">
              <dbui-dummy-0 id="dbui-dummy-0">
                <dbui-dummy-a id="dbui-dummy-a"></dbui-dummy-a>
                <dbui-dummy-n id="dbui-dummy-n"></dbui-dummy-n>
              </dbui-dummy-0>
            </dbui-web-component-root>
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {

            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);

            const DummyH = getDummyX(
              'dbui-dummy-h', 'DummyH', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyH
                }
              }
            )(contentWindow);

            const DummyG = getDummyX(
              'dbui-dummy-g', 'DummyG', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyG
                }
              }
            )(contentWindow);

            const DummyF = getDummyX(
              'dbui-dummy-f', 'DummyF', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyF
                }
              }
            )(contentWindow);

            const DummyE = getDummyX(
              'dbui-dummy-e', 'DummyE', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyE
                }
              }
            )(contentWindow);

            const DummyD = getDummyX(
              'dbui-dummy-d', 'DummyD', {
                dependentClasses: [DummyF, DummyE],
                dependentHTML: `
                <dbui-dummy-e id="dbui-dummy-e-shadow">
                  <dbui-dummy-f id="dbui-dummy-f-shadow">
                  </dbui-dummy-f>
                </dbui-dummy-e>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyD
                }
              }
            )(contentWindow);

            const DummyC = getDummyX(
              'dbui-dummy-c', 'DummyC', {
                dependentClasses: [DummyD],
                dependentHTML: `
                <dbui-dummy-d id="dbui-dummy-d-shadow"></dbui-dummy-d>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyC
                }
              }
            )(contentWindow);

            const DummyB = getDummyX(
              'dbui-dummy-b', 'DummyB', {
                dependentClasses: [DummyC],
                dependentHTML: `
                <dbui-dummy-c id="dbui-dummy-c-shadow-1"></dbui-dummy-c>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyB
                }
              }
            )(contentWindow);

            const DummyA = getDummyX(
              'dbui-dummy-a', 'DummyA', {
                dependentClasses: [DummyB],
                dependentHTML: `
                <dbui-dummy-b id="dbui-dummy-b-shadow"></dbui-dummy-b>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyA
                }
              }
            )(contentWindow);

            const DummyN = getDummyX(
              'dbui-dummy-n', 'DummyN', {
                dependentClasses: [DummyC],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyN
                }
              }
            )(contentWindow);

            const Dummy0 = getDummyX(
              'dbui-dummy-0', 'Dummy0', {
                dependentClasses: [],
                dependentHTML: `
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummy0
                }
              }
            )(contentWindow);

            let connectedComponents = [];

            function onConnectedCallbackDummy0(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow', 'dbui-dummy-d-shadow',
                'dbui-dummy-c-shadow-1', 'dbui-dummy-b-shadow', 'dbui-dummy-n', 'dbui-dummy-a'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-web-component-root');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-a', 'dbui-dummy-n']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyN(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow', 'dbui-dummy-d-shadow',
                'dbui-dummy-c-shadow-1', 'dbui-dummy-b-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-0');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.length).to.equal(0);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyA(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow', 'dbui-dummy-d-shadow',
                'dbui-dummy-c-shadow-1', 'dbui-dummy-b-shadow', 'dbui-dummy-n'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-0');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-b-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyB(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow', 'dbui-dummy-d-shadow',
                'dbui-dummy-c-shadow-1'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-a');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-c-shadow-1']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyC(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow', 'dbui-dummy-d-shadow'
              ]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-d-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyD(self) {
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-f-shadow', 'dbui-dummy-e-shadow'
              ]);
              const dummyE = self.shadowRoot.querySelector('dbui-dummy-e');
              expect(dummyE.constructor.name).to.equal('DummyE');
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.constructor.name).to.equal('DummyC');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-e-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyE(self) {
              expect(connectedComponents).to.deep.equal(['dbui-dummy-f-shadow']);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-d-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.map((child) => child.id)).to.deep.equal(['dbui-dummy-f-shadow']);
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyF(self) {
              expect(connectedComponents).to.deep.equal([]);
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-e-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.length).to.equal(0);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyG(self) {
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-b-shadow');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.length).to.equal(0);
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyH(self) {
              expect(self.topDbuiAncestor.id).to.equal('dbui-web-component-root');
              expect(self.topDbuiAncestor.isMounted).to.equal(true);
              expect(self.closestDbuiParent.id).to.equal('dbui-dummy-n');
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              expect(self.closestDbuiChildren.length).to.equal(0);
              connectedComponents.push(self.id);
            }

            Promise.all(
              [DBUIRoot.registrationName].map((localName) => contentWindow.customElements.whenDefined(localName))
            ).then(() => {

              // const wrapper = contentWindow.document.querySelector('#wrapper');
              // let dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');
              const dummyA = contentWindow.document.querySelector('dbui-dummy-a');
              const dummyN = contentWindow.document.querySelector('dbui-dummy-n');
              const dummyBShadow = dummyA.shadowRoot.querySelector('dbui-dummy-b');


              expect(connectedComponents.length).to.equal(8);

              // ------------ test 2: mounting shadow child with shadow DOM under shadow node
              connectedComponents = [];
              const dummyC2 = contentWindow.document.createElement('dbui-dummy-c');
              dummyC2.id = 'dbui-dummy-c-shadow-2';
              dummyBShadow.shadowRoot.appendChild(dummyC2);
              expect(dummyC2.closestDbuiParent).to.equal(dummyBShadow);
              expect(dummyBShadow.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-c-shadow-1', 'dbui-dummy-c-shadow-2'
              ]);
              expect(connectedComponents.length).to.equal(4);

              // ------------ test 3: mounting shadow child without shadow DOM under shadow node
              const dummyG = contentWindow.document.createElement('dbui-dummy-g');
              dummyG.id = 'dbui-dummy-g-shadow';
              dummyBShadow.shadowRoot.appendChild(dummyG);
              expect(dummyG.closestDbuiParent).to.equal(dummyBShadow);
              expect(dummyBShadow.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-c-shadow-1', 'dbui-dummy-c-shadow-2', 'dbui-dummy-g-shadow'
              ]);
              expect(connectedComponents.length).to.equal(5);

              // ------------ test 4: mounting shadow child with shadow DOM under light node
              connectedComponents = [];
              const dummyC3 = contentWindow.document.createElement('dbui-dummy-c');
              dummyC3.id = 'dbui-dummy-c-shadow-3';
              dummyN.shadowRoot.appendChild(dummyC3);
              expect(dummyC3.closestDbuiParent).to.equal(dummyN);
              expect(dummyN.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-c-shadow-3'
              ]);
              expect(connectedComponents.length).to.equal(4);

              // ------------ test 5: mounting shadow child without shadow DOM under light node
              const dummyH = contentWindow.document.createElement('dbui-dummy-h');
              dummyH.id = 'dbui-dummy-h-shadow';
              dummyN.shadowRoot.appendChild(dummyH);
              expect(dummyH.closestDbuiParent).to.equal(dummyN);
              expect(dummyN.closestDbuiChildren.map((child) => child.id)).to.deep.equal([
                'dbui-dummy-c-shadow-3', 'dbui-dummy-h-shadow'
              ]);
              expect(connectedComponents.length).to.equal(5);


              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyG.registerSelf();
            DummyH.registerSelf();
            Dummy0.registerSelf();
            DummyN.registerSelf();
            DummyA.registerSelf();
            DBUIRoot.registerSelf();
          }
        });
      });
    });

    describe('in light/shadow DOM', () => {
      it(`
      onConnectedCallback is fired for all light/shadow components in predictable order
      and each component has visibility on its upgraded light/shadow parent and upgraded light/shadow children
      `, (done) => {
        inIframe({
          headStyle: '',
          bodyHTML: `
          <div id="wrapper">
            <dbui-web-component-root id="dbui-web-component-root">
              <dbui-dummy-0 id="dbui-dummy-0">
                <dbui-dummy-a id="dbui-dummy-a">
                  <dbui-dummy-b id="dbui-dummy-b">
                    <dbui-dummy-c id="dbui-dummy-c">
                      <dbui-dummy-g id="dbui-dummy-g">
                      </dbui-dummy-g>
                    </dbui-dummy-c>
                  </dbui-dummy-b>
                </dbui-dummy-a>
                <dbui-dummy-d id="dbui-dummy-d">
                  <dbui-dummy-e id="dbui-dummy-e">
                    <dbui-dummy-f id="dbui-dummy-f">
                    </dbui-dummy-f>
                  </dbui-dummy-e>
                </dbui-dummy-d>
              </dbui-dummy-0>
            </dbui-web-component-root>
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);

            const DummyVV = getDummyX('dbui-dummy-vv', 'DummyVV', {
              dependentClasses: [],
              dependentHTML: `
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyVV,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyV = getDummyX('dbui-dummy-v', 'DummyV', {
              dependentClasses: [DummyVV],
              dependentHTML: `
              <dbui-dummy-vv id="dbui-dummy-vv-shadow"></dbui-dummy-vv>
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyV,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyU = getDummyX('dbui-dummy-u', 'DummyU', {
              dependentClasses: [],
              dependentHTML: `
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyU,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyTT = getDummyX('dbui-dummy-tt', 'DummyTT', {
              dependentClasses: [],
              dependentHTML: `
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyTT,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyT = getDummyX('dbui-dummy-t', 'DummyT', {
              dependentClasses: [DummyTT],
              dependentHTML: `
              <dbui-dummy-tt id="dbui-dummy-tt-shadow"></dbui-dummy-tt>
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyT,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummySS = getDummyX('dbui-dummy-ss', 'DummySS', {
              dependentClasses: [],
              dependentHTML: `
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummySS,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyS = getDummyX('dbui-dummy-s', 'DummyS', {
              dependentClasses: [DummySS],
              dependentHTML: `
              <dbui-dummy-ss id="dbui-dummy-ss-shadow"></dbui-dummy-ss>
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyS,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyR = getDummyX('dbui-dummy-r', 'DummyR', {
              dependentClasses: [],
              dependentHTML: `
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyR,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyQ = getDummyX('dbui-dummy-q', 'DummyQ', {
              dependentClasses: [],
              dependentHTML: `
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyQ,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyPPP = getDummyX('dbui-dummy-ppp', 'DummyPPP', {
              dependentClasses: [],
              dependentHTML: `
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyPPP,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyPP = getDummyX('dbui-dummy-pp', 'DummyPP', {
              dependentClasses: [DummyPPP],
              dependentHTML: `
              <dbui-dummy-ppp id="dbui-dummy-ppp-shadow"></dbui-dummy-ppp>
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyPP,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyP = getDummyX('dbui-dummy-p', 'DummyP', {
              dependentClasses: [DummyPP],
              dependentHTML: `
              <dbui-dummy-pp id="dbui-dummy-pp-shadow"></dbui-dummy-pp>
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyP,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyNNN = getDummyX('dbui-dummy-nnn', 'DummyNNN', {
              dependentClasses: [],
              dependentHTML: `
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyNNN,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyNN = getDummyX('dbui-dummy-nn', 'DummyNN', {
              dependentClasses: [DummyNNN],
              dependentHTML: `
              <dbui-dummy-nnn id="dbui-dummy-nnn-shadow"></dbui-dummy-nnn>
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyNN,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyN = getDummyX('dbui-dummy-n', 'DummyN', {
              dependentClasses: [DummyNN],
              dependentHTML: `
              <dbui-dummy-nn id="dbui-dummy-nn-shadow"></dbui-dummy-nn>
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyN,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyM = getDummyX('dbui-dummy-m', 'DummyM', {
              dependentClasses: [DummyN, DummyP],
              dependentHTML: `
              <dbui-dummy-n id="dbui-dummy-n-shadow">
                <dbui-dummy-p id="dbui-dummy-p-shadow">
                </dbui-dummy-p>
              </dbui-dummy-n>
              `,
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummyM,
                onDisconnectedCallback
              }
            })(contentWindow);

            const Dummy0 = getDummyX('dbui-dummy-0', 'Dummy0', {
              callbacks: {
                onConnectedCallback: onConnectedCallbackDummy0,
                onDisconnectedCallback
              }
            })(contentWindow);

            const DummyA = getDummyX(
              'dbui-dummy-a', 'DummyA', {
                dependentClasses: [DummyQ],
                dependentHTML: `
                <dbui-dummy-q id="dbui-dummy-q-shadow">
                </dbui-dummy-q>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyA,
                  onDisconnectedCallback
                }
              }
            )(contentWindow);

            const DummyB = getDummyX(
              'dbui-dummy-b', 'DummyB', {
                dependentClasses: [DummyM],
                dependentHTML: `
                <dbui-dummy-m id="dbui-dummy-m-shadow">
                </dbui-dummy-m>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyB,
                  onDisconnectedCallback
                }
              }
            )(contentWindow);

            const DummyC = getDummyX(
              'dbui-dummy-c', 'DummyC', {
                dependentClasses: [DummyR, DummyS],
                dependentHTML: `
                <dbui-dummy-r id="dbui-dummy-r-shadow">
                  <dbui-dummy-s id="dbui-dummy-s-shadow">
                    <slot></slot>
                  </dbui-dummy-s>
                </dbui-dummy-r>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyC,
                  onDisconnectedCallback
                }
              }
            )(contentWindow);

            const DummyD = getDummyX(
              'dbui-dummy-d', 'DummyD', {
                dependentClasses: [DummyV],
                dependentHTML: `
                <dbui-dummy-v id="dbui-dummy-v-shadow">
                </dbui-dummy-v>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyD,
                  onDisconnectedCallback
                }
              }
            )(contentWindow);

            const DummyE = getDummyX(
              'dbui-dummy-e', 'DummyE', {
                dependentClasses: [DummyT, DummyU],
                dependentHTML: `
                <dbui-dummy-t id="dbui-dummy-t-shadow">
                  <dbui-dummy-u id="dbui-dummy-u-shadow">
                  </dbui-dummy-u>
                </dbui-dummy-t>
                `,
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyE,
                  onDisconnectedCallback
                }
              }
            )(contentWindow);

            const DummyF = getDummyX(
              'dbui-dummy-f', 'DummyF', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyF,
                  onDisconnectedCallback
                }
              }
            )(contentWindow);

            const DummyG = getDummyX(
              'dbui-dummy-g', 'DummyG', {
                callbacks: {
                  onConnectedCallback: onConnectedCallbackDummyG,
                  onDisconnectedCallback
                }
              }
            )(contentWindow);

            let connectedComponents = [];

            function onDisconnectedCallback(self) {
              connectedComponents = connectedComponents.filter((id) => id !== self.id);
            }

            function onConnectedCallbackDummy0(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-a', 'dbui-dummy-d'],
                closestDbuiParent: 'dbui-web-component-root'
              });
              const allDescendants = selectAllComponents({ exclude: ['wrapper', 'dbuiRoot', 'dummy0'] });
              Object.keys(allDescendants).forEach((key) => {
                const descendant = allDescendants[key];
                expect(descendant.isMounted).to.equal(true);
                expect(descendant._isDelivered).to.equal(true);
                expect(descendant._wasOnConnectedCallbackFired).to.equal(true);
                expect(descendant.closestDbuiParent.isMounted).to.equal(true);
                expect(descendant.topDbuiAncestor.constructor.registrationName).to.equal('dbui-web-component-root');
              });
            }

            function commonTest(self, {
              closestDbuiChildren,
              closestDbuiParent
            } = {}) {
              const _closestDbuiChildren =
                (self.getAttribute('_closestDbuiChildren') &&
                  contentWindow.JSON.parse(self.getAttribute('_closestDbuiChildren'))) ||
                  closestDbuiChildren;
              const _closestDbuiParent =
                (self.getAttribute('_closestDbuiParent') &&
                  contentWindow.JSON.parse(self.getAttribute('_closestDbuiParent'))) ||
                  closestDbuiParent;

              expect(self.closestDbuiParent.id).to.equal(_closestDbuiParent);
              expect(self.closestDbuiChildren.map((c) => c.id)).to.deep.equal(_closestDbuiChildren);
              expect(self.isMounted).to.equal(true);
              expect(self._wasOnConnectedCallbackFired).to.equal(true);
              expect(self.closestDbuiParent.isMounted).to.equal(true);
              const closestDbuiParentRegistrationName = self.closestDbuiParent.constructor.registrationName;
              if (closestDbuiParentRegistrationName !== 'dbui-web-component-root') {
                // basically false unless explicitly specified true
                expect(self.closestDbuiParent._isDelivered)
                  .to.equal(!!+self.getAttribute('_expectClosestDbuiParentAlreadyIsConnected'));
              }
              expect(self.topDbuiAncestor.constructor.registrationName).to.equal('dbui-web-component-root');
              expect(self.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);

              const descendantTest = (node) => {
                expect(node.isMounted).to.equal(true);
                expect(node._isDelivered).to.equal(true);
                expect(node._wasOnConnectedCallbackFired).to.equal(true);
                expect(node.topDbuiAncestor.constructor.registrationName).to.equal('dbui-web-component-root');
                expect(node.closestDbuiParent.isMounted).to.equal(true);
                expect(node.closestDbuiChildren.every((child) => child.isMounted)).to.equal(true);
                expect(node.closestDbuiChildren.every((child) => child._isDelivered)).to.equal(true);
              };

              const selfShadowDescendantsDeep = self.shadowDescendantsDeepLiveQuery;
              selfShadowDescendantsDeep.forEach((shadowDescendant) => {
                descendantTest(shadowDescendant);

                const lightDescendantsForShadowDescendant = shadowDescendant.lightDescendantsLiveQuery;
                lightDescendantsForShadowDescendant.forEach((lightDescendant) => {
                  descendantTest(lightDescendant);
                });
              });

              const lightDescendants = self.lightDescendantsLiveQuery;
              lightDescendants.forEach((lightDescendant) => {
                descendantTest(lightDescendant);

                const shadowDescendantsDeepForLightDescendant = lightDescendant.shadowDescendantsDeepLiveQuery;
                shadowDescendantsDeepForLightDescendant.forEach((shadowDescendant) => {
                  descendantTest(shadowDescendant);

                  const lightDescendantsForShadowDescendant = shadowDescendant.lightDescendantsLiveQuery;
                  lightDescendantsForShadowDescendant.forEach((lightDescendant) => {
                    descendantTest(lightDescendant);
                  });
                });
              });
              connectedComponents.push(self.id);
            }

            function onConnectedCallbackDummyA(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-q-shadow', 'dbui-dummy-b'],
                closestDbuiParent: 'dbui-dummy-0'
              });
            }

            function onConnectedCallbackDummyB(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-m-shadow', 'dbui-dummy-c'],
                closestDbuiParent: 'dbui-dummy-a'
              });
            }

            function onConnectedCallbackDummyC(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-r-shadow', 'dbui-dummy-g'],
                closestDbuiParent: 'dbui-dummy-b'
              });
            }

            function onConnectedCallbackDummyD(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-v-shadow', 'dbui-dummy-e'],
                closestDbuiParent: 'dbui-dummy-0'
              });
            }

            function onConnectedCallbackDummyE(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-t-shadow', 'dbui-dummy-f'],
                closestDbuiParent: 'dbui-dummy-d'
              });
            }

            function onConnectedCallbackDummyF(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-e'
              });
            }

            function onConnectedCallbackDummyG(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-c'
              });
            }

            function onConnectedCallbackDummyM(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-n-shadow'],
                closestDbuiParent: 'dbui-dummy-b'
              });
            }

            function onConnectedCallbackDummyN(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-nn-shadow', 'dbui-dummy-p-shadow'],
                closestDbuiParent: 'dbui-dummy-m-shadow'
              });
            }

            function onConnectedCallbackDummyNN(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-nnn-shadow'],
                closestDbuiParent: 'dbui-dummy-n-shadow'
              });
            }

            function onConnectedCallbackDummyNNN(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-nn-shadow'
              });
            }

            function onConnectedCallbackDummyP(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-pp-shadow'],
                closestDbuiParent: 'dbui-dummy-n-shadow'
              });
            }

            function onConnectedCallbackDummyPP(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-ppp-shadow'],
                closestDbuiParent: 'dbui-dummy-p-shadow'
              });
            }

            function onConnectedCallbackDummyPPP(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-pp-shadow'
              });
            }

            function onConnectedCallbackDummyQ(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-a'
              });
            }

            function onConnectedCallbackDummyR(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-s-shadow'],
                closestDbuiParent: 'dbui-dummy-c'
              });
            }

            function onConnectedCallbackDummyS(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-ss-shadow'],
                closestDbuiParent: 'dbui-dummy-r-shadow'
              });
            }

            function onConnectedCallbackDummySS(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-s-shadow'
              });
            }

            function onConnectedCallbackDummyT(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-tt-shadow', 'dbui-dummy-u-shadow'],
                closestDbuiParent: 'dbui-dummy-e'
              });
            }

            function onConnectedCallbackDummyTT(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-t-shadow'
              });
            }

            function onConnectedCallbackDummyU(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-t-shadow'
              });
            }

            function onConnectedCallbackDummyV(self) {
              commonTest(self, {
                closestDbuiChildren: ['dbui-dummy-vv-shadow'],
                closestDbuiParent: 'dbui-dummy-d'
              });
            }

            function onConnectedCallbackDummyVV(self) {
              commonTest(self, {
                closestDbuiChildren: [],
                closestDbuiParent: 'dbui-dummy-v-shadow'
              });
            }

            function selectAllComponents({ exclude = [] } = {}) {
              const wrapper = contentWindow.document.querySelector('#wrapper');
              const dbuiRoot = contentWindow.document.querySelector('dbui-web-component-root');

              const dummy0 = contentWindow.document.querySelector('#dbui-dummy-0');
              const dummyA = contentWindow.document.querySelector('#dbui-dummy-a');
              const dummyB = contentWindow.document.querySelector('#dbui-dummy-b');
              const dummyC = contentWindow.document.querySelector('#dbui-dummy-c');
              const dummyD = contentWindow.document.querySelector('#dbui-dummy-d');
              const dummyE = contentWindow.document.querySelector('#dbui-dummy-e');
              const dummyF = contentWindow.document.querySelector('#dbui-dummy-f');
              const dummyG = contentWindow.document.querySelector('#dbui-dummy-g');

              const dummyT_shadow = dummyE.shadowRoot.querySelector('#dbui-dummy-t-shadow');
              const dummyU_shadow = dummyE.shadowRoot.querySelector('#dbui-dummy-u-shadow');
              const dummyV_shadow = dummyD.shadowRoot.querySelector('#dbui-dummy-v-shadow');
              const dummyR_shadow = dummyC.shadowRoot.querySelector('#dbui-dummy-r-shadow');
              const dummyS_shadow = dummyC.shadowRoot.querySelector('#dbui-dummy-s-shadow');
              const dummyM_shadow = dummyB.shadowRoot.querySelector('#dbui-dummy-m-shadow');
              const dummyQ_shadow = dummyA.shadowRoot.querySelector('#dbui-dummy-q-shadow');

              const dummyN_shadow = dummyM_shadow.shadowRoot.querySelector('#dbui-dummy-n-shadow');
              const dummyP_shadow = dummyM_shadow.shadowRoot.querySelector('#dbui-dummy-p-shadow');
              const dummyNN_shadow = dummyN_shadow.shadowRoot.querySelector('#dbui-dummy-nn-shadow');
              const dummyNNN_shadow = dummyNN_shadow.shadowRoot.querySelector('#dbui-dummy-nnn-shadow');
              const dummyPP_shadow = dummyP_shadow.shadowRoot.querySelector('#dbui-dummy-pp-shadow');
              const dummyPPP_shadow = dummyPP_shadow.shadowRoot.querySelector('#dbui-dummy-ppp-shadow');
              const dummySS_shadow = dummyS_shadow.shadowRoot.querySelector('#dbui-dummy-ss-shadow');
              const dummyTT_shadow = dummyT_shadow.shadowRoot.querySelector('#dbui-dummy-tt-shadow');
              const dummyVV_shadow = dummyV_shadow.shadowRoot.querySelector('#dbui-dummy-vv-shadow');

              const res = {
                wrapper, dbuiRoot,
                dummy0, dummyA, dummyB, dummyC, dummyD, dummyE, dummyF, dummyG,
                dummyT_shadow, dummyU_shadow, dummyV_shadow, dummyR_shadow, dummyS_shadow, dummyM_shadow, dummyQ_shadow,
                dummyN_shadow, dummyP_shadow, dummyNN_shadow, dummyNNN_shadow, dummyPP_shadow, dummyPPP_shadow,
                dummySS_shadow, dummyTT_shadow, dummyVV_shadow
              };
              return Object.keys(res).filter((key) => !exclude.includes(key)).reduce((acc, key) => {
                acc[key] = res[key];
                return acc;
              }, {});
            }

            Promise.all(
              [DBUIRoot.registrationName].map((localName) => contentWindow.customElements.whenDefined(localName))
            ).then(() => {

              let wrapper, dbuiRoot, dummy0, dummyA, dummyB, dummyC, dummyD, dummyE, dummyF, dummyG;
              // dummyT_shadow, dummyU_shadow, dummyV_shadow, dummyR_shadow, dummyS_shadow, dummyM_shadow, dummyQ_shadow,
              // dummyN_shadow, dummyP_shadow, dummyNN_shadow, dummyNNN_shadow, dummyPP_shadow, dummyPPP_shadow,
              // dummySS_shadow, dummyTT_shadow, dummyVV_shadow;

              const standardConnectOrder = [
                'dbui-dummy-q-shadow', 'dbui-dummy-nnn-shadow', 'dbui-dummy-nn-shadow',
                'dbui-dummy-ppp-shadow', 'dbui-dummy-pp-shadow', 'dbui-dummy-p-shadow',
                'dbui-dummy-n-shadow', 'dbui-dummy-m-shadow', 'dbui-dummy-ss-shadow',
                'dbui-dummy-s-shadow', 'dbui-dummy-r-shadow', 'dbui-dummy-vv-shadow',
                'dbui-dummy-v-shadow', 'dbui-dummy-tt-shadow', 'dbui-dummy-u-shadow',
                'dbui-dummy-t-shadow', 'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d',
                'dbui-dummy-g', 'dbui-dummy-c', 'dbui-dummy-b', 'dbui-dummy-a', 'dbui-dummy-0'
              ];

              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal(standardConnectOrder);
              ({ wrapper, dummy0, dbuiRoot } = selectAllComponents());

              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);

              // --------------------test 2 re-appending dummy0

              dummy0.remove();
              expect(connectedComponents.length).to.equal(0);

              dbuiRoot.appendChild(dummy0);

              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal(standardConnectOrder);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);

              // --------------------test 3 re-appending dbuiRoot

              dbuiRoot.remove();
              expect(connectedComponents.length).to.equal(0);

              wrapper.appendChild(dbuiRoot);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal(standardConnectOrder);


              // --------------------test 4 re-writing dummy0.innerHTML

              dummy0.innerHTML = '';
              expect(connectedComponents.length).to.equal(1);

              dummy0.innerHTML = `
              <dbui-dummy-a id="dbui-dummy-a" _expectClosestDbuiParentAlreadyIsConnected="1">
                <dbui-dummy-b id="dbui-dummy-b">
                  <dbui-dummy-c id="dbui-dummy-c">
                    <dbui-dummy-g id="dbui-dummy-g">
                    </dbui-dummy-g>
                  </dbui-dummy-c>
                </dbui-dummy-b>
              </dbui-dummy-a>
              <dbui-dummy-d id="dbui-dummy-d" _expectClosestDbuiParentAlreadyIsConnected="1">
                <dbui-dummy-e id="dbui-dummy-e">
                  <dbui-dummy-f id="dbui-dummy-f">
                  </dbui-dummy-f>
                </dbui-dummy-e>
              </dbui-dummy-d>
              `;

              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-0', 'dbui-dummy-q-shadow', 'dbui-dummy-nnn-shadow',
                'dbui-dummy-nn-shadow', 'dbui-dummy-ppp-shadow', 'dbui-dummy-pp-shadow',
                'dbui-dummy-p-shadow', 'dbui-dummy-n-shadow', 'dbui-dummy-m-shadow',
                'dbui-dummy-ss-shadow', 'dbui-dummy-s-shadow', 'dbui-dummy-r-shadow',
                'dbui-dummy-g', 'dbui-dummy-c', 'dbui-dummy-b', 'dbui-dummy-a', 'dbui-dummy-vv-shadow',
                'dbui-dummy-v-shadow', 'dbui-dummy-tt-shadow', 'dbui-dummy-u-shadow',
                'dbui-dummy-t-shadow', 'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d'
              ]);


              // --------------------test 5 re-writing wrapper.innerHTML

              wrapper.innerHTML = '';
              expect(connectedComponents.length).to.equal(0);

              wrapper.innerHTML = `
              <dbui-web-component-root id="dbui-web-component-root">
                <dbui-dummy-0 id="dbui-dummy-0">
                  <div id="temp"></div>
                  <dbui-dummy-a id="dbui-dummy-a">
                    <dbui-dummy-b id="dbui-dummy-b">
                      <dbui-dummy-c id="dbui-dummy-c">
                        <dbui-dummy-g id="dbui-dummy-g">
                        </dbui-dummy-g>
                      </dbui-dummy-c>
                    </dbui-dummy-b>
                  </dbui-dummy-a>
                  <dbui-dummy-d id="dbui-dummy-d">
                    <dbui-dummy-e id="dbui-dummy-e">
                      <dbui-dummy-f id="dbui-dummy-f">
                      </dbui-dummy-f>
                    </dbui-dummy-e>
                  </dbui-dummy-d>
                </dbui-dummy-0>
              </dbui-web-component-root>
              `;

              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal(standardConnectOrder);

              // --------------------test 6 appending new light nodes under dummy0

              ({ dummyA, dummy0, dummyD, dummyE } = selectAllComponents());
              dummyA.remove();
              expect(connectedComponents.length).to.equal(9);

              dummyA = contentWindow.document.createElement('dbui-dummy-a');
              dummyB = contentWindow.document.createElement('dbui-dummy-b');
              dummyC = contentWindow.document.createElement('dbui-dummy-c');
              dummyG = contentWindow.document.createElement('dbui-dummy-g');
              dummyA.id = 'dbui-dummy-a';
              dummyA.setAttribute('_expectClosestDbuiParentAlreadyIsConnected', '1');
              dummyB.id = 'dbui-dummy-b';
              dummyC.id = 'dbui-dummy-c';
              dummyG.id = 'dbui-dummy-g';

              dummyA.appendChild(dummyB);
              dummyB.appendChild(dummyC);
              dummyC.appendChild(dummyG);
              dummy0.insertBefore(dummyA, dummyD);
              dummyA.removeAttribute('_expectClosestDbuiParentAlreadyIsConnected');

              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-vv-shadow', 'dbui-dummy-v-shadow', 'dbui-dummy-tt-shadow',
                'dbui-dummy-u-shadow', 'dbui-dummy-t-shadow', 'dbui-dummy-f', 'dbui-dummy-e',
                'dbui-dummy-d', 'dbui-dummy-0', 'dbui-dummy-q-shadow', 'dbui-dummy-nnn-shadow',
                'dbui-dummy-nn-shadow', 'dbui-dummy-ppp-shadow', 'dbui-dummy-pp-shadow',
                'dbui-dummy-p-shadow', 'dbui-dummy-n-shadow', 'dbui-dummy-m-shadow',
                'dbui-dummy-ss-shadow', 'dbui-dummy-s-shadow', 'dbui-dummy-r-shadow',
                'dbui-dummy-g', 'dbui-dummy-c', 'dbui-dummy-b', 'dbui-dummy-a'
              ]);

              // --------------------test 7 re-appending light node

              dummyE.remove();
              dummyE.setAttribute('_expectClosestDbuiParentAlreadyIsConnected', '1');
              expect(connectedComponents.length).to.equal(19);
              dummyD.appendChild(dummyE);
              dummyE.removeAttribute('_expectClosestDbuiParentAlreadyIsConnected');
              expect(connectedComponents.length).to.equal(24);

              // --------------------test 8 appending new light nodes
              dummyD.innerHTML = '';
              expect(connectedComponents.length).to.equal(19);

              dummyE = contentWindow.document.createElement('dbui-dummy-e');
              dummyE.setAttribute('_expectClosestDbuiParentAlreadyIsConnected', '1');
              dummyF = contentWindow.document.createElement('dbui-dummy-f');
              dummyE.id = 'dbui-dummy-e';
              dummyF.id = 'dbui-dummy-f';
              dummyE.appendChild(dummyF);
              dummyD.appendChild(dummyE);
              dummyE.removeAttribute('_expectClosestDbuiParentAlreadyIsConnected');

              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-vv-shadow', 'dbui-dummy-v-shadow', 'dbui-dummy-d',
                'dbui-dummy-0', 'dbui-dummy-q-shadow', 'dbui-dummy-nnn-shadow',
                'dbui-dummy-nn-shadow', 'dbui-dummy-ppp-shadow', 'dbui-dummy-pp-shadow',
                'dbui-dummy-p-shadow', 'dbui-dummy-n-shadow', 'dbui-dummy-m-shadow',
                'dbui-dummy-ss-shadow', 'dbui-dummy-s-shadow', 'dbui-dummy-r-shadow',
                'dbui-dummy-g', 'dbui-dummy-c', 'dbui-dummy-b', 'dbui-dummy-a',
                'dbui-dummy-tt-shadow', 'dbui-dummy-u-shadow', 'dbui-dummy-t-shadow',
                'dbui-dummy-f', 'dbui-dummy-e'
              ]);

              // --------------------test 9 ~randomly re-connecting nodes under dummy0

              let allComponents = selectAllComponents({ exclude: ['wrapper', 'dbuiRoot'] });
              let allComponentsKeys = Object.keys(allComponents);
              allComponentsKeys.forEach((key) => {
                const component = allComponents[key];
                component._onDisconnectedCallback();
              });
              expect(connectedComponents.length).to.equal(0);

              let randomIndexes = [8, 1, 12, 21, 4, 11, 13, 7, 17, 16, 6, 5, 3, 9, 22, 2, 15, 0, 20, 19, 10, 18, 14, 23];

              allComponents.dummy0._onConnectedCallback();

              randomIndexes.forEach((idx) => {
                const key = allComponentsKeys[idx];
                if (key === 'dummy0') return;
                const component = allComponents[key];
                component._onConnectedCallback();
              });

              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal(standardConnectOrder);

              // --------------------test 10 ~randomly re-connecting nodes under dbuiRoot

              allComponents = selectAllComponents({ exclude: ['wrapper', 'dbuiRoot'] });
              allComponentsKeys = Object.keys(allComponents);
              allComponentsKeys.forEach((key) => {
                const component = allComponents[key];
                component._onDisconnectedCallback();
              });
              expect(connectedComponents.length).to.equal(0);

              randomIndexes = [0, 18, 2, 1, 3, 20, 15, 4, 8, 17, 22, 10, 7, 14, 13, 19, 21, 6, 23, 5, 11, 16, 9, 12];

              randomIndexes.forEach((idx) => {
                const key = allComponentsKeys[idx];
                const component = allComponents[key];
                component._onConnectedCallback();
              });

              expect(connectedComponents.length).to.equal(24);
              expect(connectedComponents).to.deep.equal(standardConnectOrder);

              // --------------------test 11 randomly! re-connecting nodes under dbuiRoot

              allComponents = selectAllComponents({ exclude: ['wrapper', 'dbuiRoot'] });


              let testCount = 10;
              while (testCount) {
                testCount -= 1;
                allComponentsKeys = Object.keys(allComponents);
                allComponentsKeys.forEach((key) => {
                  const component = allComponents[key];
                  component._onDisconnectedCallback();
                });
                expect(connectedComponents.length).to.equal(0);

                randomIndexes = randomArrayNum(24);
                /* eslint no-loop-func: 0 */
                randomIndexes.forEach((idx) => {
                  const key = allComponentsKeys[idx];
                  const component = allComponents[key];
                  component._onConnectedCallback();
                });

                expect(connectedComponents.length).to.equal(24);
                expect(connectedComponents).to.deep.equal(standardConnectOrder);
                expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
                expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
                expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              }

              ({ dummy0, dummyD, dummyA, dummyG } = selectAllComponents());
              const tempTiv = contentWindow.document.querySelector('#temp');

              // --------------------test 12 appending light node under light node
              dummyD.setAttribute('_expectClosestDbuiParentAlreadyIsConnected', '1');
              dummyD.setAttribute('_closestDbuiParent', '"dbui-dummy-g"');
              dummyG.appendChild(dummyD);

              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-q-shadow', 'dbui-dummy-nnn-shadow', 'dbui-dummy-nn-shadow',
                'dbui-dummy-ppp-shadow', 'dbui-dummy-pp-shadow', 'dbui-dummy-p-shadow',
                'dbui-dummy-n-shadow', 'dbui-dummy-m-shadow', 'dbui-dummy-ss-shadow',
                'dbui-dummy-s-shadow', 'dbui-dummy-r-shadow', 'dbui-dummy-g', 'dbui-dummy-c',
                'dbui-dummy-b', 'dbui-dummy-a', 'dbui-dummy-0', 'dbui-dummy-vv-shadow',
                'dbui-dummy-v-shadow', 'dbui-dummy-tt-shadow', 'dbui-dummy-u-shadow',
                'dbui-dummy-t-shadow', 'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d'
              ]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingConnectionsDuringDisconnectFlow.length).to.equal(0);


              // insertBefore light node
              dummyD.setAttribute('_closestDbuiParent', '"dbui-dummy-0"');
              dummy0.insertBefore(dummyD, tempTiv);

              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-q-shadow', 'dbui-dummy-nnn-shadow', 'dbui-dummy-nn-shadow',
                'dbui-dummy-ppp-shadow', 'dbui-dummy-pp-shadow', 'dbui-dummy-p-shadow',
                'dbui-dummy-n-shadow', 'dbui-dummy-m-shadow', 'dbui-dummy-ss-shadow',
                'dbui-dummy-s-shadow', 'dbui-dummy-r-shadow', 'dbui-dummy-g', 'dbui-dummy-c',
                'dbui-dummy-b', 'dbui-dummy-a', 'dbui-dummy-0', 'dbui-dummy-vv-shadow',
                'dbui-dummy-v-shadow', 'dbui-dummy-tt-shadow', 'dbui-dummy-u-shadow',
                'dbui-dummy-t-shadow', 'dbui-dummy-f', 'dbui-dummy-e', 'dbui-dummy-d'
              ]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingConnectionsDuringDisconnectFlow.length).to.equal(0);


              // replace light node
              dummy0.replaceChild(dummyD, dummyA);

              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-0', 'dbui-dummy-vv-shadow', 'dbui-dummy-v-shadow', 'dbui-dummy-tt-shadow',
                'dbui-dummy-u-shadow', 'dbui-dummy-t-shadow', 'dbui-dummy-f', 'dbui-dummy-e',
                'dbui-dummy-d'
              ]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingConnectionsDuringDisconnectFlow.length).to.equal(0);


              dummyA.setAttribute('_expectClosestDbuiParentAlreadyIsConnected', '1');
              // insertBefore light node
              dummy0.insertBefore(dummyA, dummyD);

              expect(connectedComponents).to.deep.equal([
                'dbui-dummy-0', 'dbui-dummy-vv-shadow', 'dbui-dummy-v-shadow', 'dbui-dummy-tt-shadow',
                'dbui-dummy-u-shadow', 'dbui-dummy-t-shadow', 'dbui-dummy-f', 'dbui-dummy-e',
                'dbui-dummy-d', 'dbui-dummy-q-shadow', 'dbui-dummy-nnn-shadow', 'dbui-dummy-nn-shadow',
                'dbui-dummy-ppp-shadow', 'dbui-dummy-pp-shadow', 'dbui-dummy-p-shadow',
                'dbui-dummy-n-shadow', 'dbui-dummy-m-shadow', 'dbui-dummy-ss-shadow',
                'dbui-dummy-s-shadow', 'dbui-dummy-r-shadow', 'dbui-dummy-g', 'dbui-dummy-c',
                'dbui-dummy-b', 'dbui-dummy-a'
              ]);
              expect(dbuiRoot._descendantsQueueLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingLightDomConnections.length).to.equal(0);
              expect(dbuiRoot._pendingRuntimeSetupForLightDom.length).to.equal(0);
              expect(dbuiRoot._pendingConnectionsDuringDisconnectFlow.length).to.equal(0);


              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyA.registerSelf();
            Dummy0.registerSelf();
            DummyD.registerSelf();
            DummyB.registerSelf();
            DummyC.registerSelf();
            DummyF.registerSelf();
            DummyE.registerSelf();
            DummyG.registerSelf();
            DBUIRoot.registerSelf();
          }
        });
      });
    });

    describe('browsers native behavior', () => {
      it(`
      Shadow DOM grandchildren are always already upgraded when shadow children are being connected.
      However light children in shadow DOM (children in slots)
      are upgraded after their light parent was connected.
      `, (done) => {
        inIframe({
          onLoad: ({ contentWindow, iframe }) => {
            const win = contentWindow;

            let connectedComponents = [];
            class DBUIBehaviorTestF extends win.HTMLElement {
              constructor() {
                super();
                const tmpl = win.document.createElement('template');
                tmpl.innerHTML = `
                <span>dbui-behavior-test-f</span>
                `;
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
              }

              connectedCallback() {
                const parent = this.getRootNode().host;
                const parentName = parent.constructor.name;
                const parentId = parent.id;
                const parentIsConnected = parent.isConnected;
                const thisIsConnected = this.isConnected;
                // Proves that parent is reachable upgraded and connected
                // even if parent connectedCallback was not fired.
                expect(parentName).to.equal('DBUIBehaviorTestE');
                expect(parentId).to.equal('dbui-behavior-test-e-light-in-shadow');
                expect(parentIsConnected).to.equal(true);
                expect(thisIsConnected).to.equal(true);

                connectedComponents.push(this.id);
              }
            }

            class DBUIBehaviorTestE extends win.HTMLElement {
              constructor() {
                super();
                const tmpl = win.document.createElement('template');
                tmpl.innerHTML = `
                <span>dbui-behavior-test-e</span>
                <dbui-behavior-test-f id="dbui-behavior-test-f-shadow"></dbui-behavior-test-f>
                `;
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
              }

              connectedCallback() {
                const descendantTagName = 'dbui-behavior-test-f';
                const descendantClass = DBUIBehaviorTestF;
                const node = this.shadowRoot.querySelector(descendantTagName);
                const nodeIsUpgraded = node instanceof descendantClass;

                expect(nodeIsUpgraded).to.equal(true);

                connectedComponents.push(this.id);
              }
            }

            let dbuiBehaviorTestEIsUpgraded;
            class DBUIBehaviorTestD extends win.HTMLElement {
              constructor() {
                super();
                const tmpl = win.document.createElement('template');
                tmpl.innerHTML = `
                <span>dbui-behavior-test-d</span>
                <slot></slot>
                `;
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
              }

              connectedCallback() {
                const descendantTagName = 'dbui-behavior-test-e';
                const descendantClass = DBUIBehaviorTestE;
                const node = this.querySelector(descendantTagName);
                const nodeIsUpgraded = node instanceof descendantClass;
                // assert false just in flow 1, 3
                expect(nodeIsUpgraded).to.equal(dbuiBehaviorTestEIsUpgraded);

                connectedComponents.push(this.id);
              }
            }

            class DBUIBehaviorTestC extends win.HTMLElement {
              constructor() {
                super();
                const tmpl = win.document.createElement('template');
                tmpl.innerHTML = `
                <span>dbui-behavior-test-c</span>
                <dbui-behavior-test-d id="dbui-behavior-test-d-shadow">
                  <dbui-behavior-test-e id="dbui-behavior-test-e-light-in-shadow"></dbui-behavior-test-e>
                </dbui-behavior-test-d>
                `;
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
              }

              connectedCallback() {
                const descendantTagName = 'dbui-behavior-test-d';
                const descendantClass = DBUIBehaviorTestD;
                const node = this.shadowRoot.querySelector(descendantTagName);
                const nodeIsUpgraded = node instanceof descendantClass;

                const descendantTagName2 = 'dbui-behavior-test-e';
                const descendantClass2 = DBUIBehaviorTestE;
                const node2 = this.shadowRoot.querySelector(descendantTagName2);
                const node2IsUpgraded = node2 instanceof descendantClass2;

                expect(nodeIsUpgraded).to.equal(true);
                expect(node2IsUpgraded).to.equal(true);

                connectedComponents.push(this.id);
              }
            }

            class DBUIBehaviorTestB extends win.HTMLElement {
              constructor() {
                super();
                const tmpl = win.document.createElement('template');
                tmpl.innerHTML = `
                <span>dbui-behavior-test-b</span>
                <dbui-behavior-test-c id="dbui-behavior-test-c-shadow"></dbui-behavior-test-c>
                `;
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
              }

              connectedCallback() {
                const descendantTagName = 'dbui-behavior-test-c';
                const descendantClass = DBUIBehaviorTestC;
                const node = this.shadowRoot.querySelector(descendantTagName);
                const nodeIsUpgraded = node instanceof descendantClass;
                const descendantTagName2 = 'dbui-behavior-test-d';
                const descendantClass2 = DBUIBehaviorTestD;
                const node2 = node.shadowRoot.querySelector(descendantTagName2);
                const node2IsUpgraded = node2 instanceof descendantClass2;

                expect(nodeIsUpgraded).to.equal(true);
                expect(node2IsUpgraded).to.equal(true);

                connectedComponents.push(this.id);
              }
            }

            let dbuiBehaviorTestBIsUpgraded;
            class DBUIBehaviorTestA extends win.HTMLElement {
              constructor() {
                super();
                const tmpl = win.document.createElement('template');
                tmpl.innerHTML = `
                <span>dbui-behavior-test-a</span>
                <dbui-behavior-test-b id="dbui-behavior-test-b-shadow"></dbui-behavior-test-b>
                `;
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
              }

              connectedCallback() {
                const descendantTagName = 'dbui-behavior-test-b';
                const descendantClass = DBUIBehaviorTestB;
                const node = this.shadowRoot.querySelector(descendantTagName);
                const nodeIsUpgraded = node instanceof descendantClass;

                expect(nodeIsUpgraded).to.equal(dbuiBehaviorTestBIsUpgraded);

                connectedComponents.push(this.id);

                // Not making any absolute assertion in dbui-behavior-test-a since browsers behavior is different.
                // Some (Safari) does not provide upgraded shadow children
                // when light DOM component.connectedCallback is fired.
                // However, deeper in the shadow tree, shadow children are provided upgraded
                // when shadow component.connectedCallback is fired.
                // dbui-behavior-test-b upgraded is:
                //  - false (Safari innerHTML) false (dom insert)
                //  - true (Chrome innerHTML) false (dom insert)
              }
            }

            class DBUIBehaviorTest0 extends win.HTMLElement {
              constructor() {
                super();
                const tmpl = win.document.createElement('template');
                tmpl.innerHTML = `
                <span>dbui-behavior-test-0</span>
                `;
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
              }

              connectedCallback() {
              }
            }

            const div = win.document.createElement('div');
            win.customElements.define('dbui-behavior-test-b', DBUIBehaviorTestB);
            win.customElements.define('dbui-behavior-test-a', DBUIBehaviorTestA);
            win.customElements.define('dbui-behavior-test-c', DBUIBehaviorTestC);
            win.customElements.define('dbui-behavior-test-d', DBUIBehaviorTestD);
            win.customElements.define('dbui-behavior-test-e', DBUIBehaviorTestE);
            win.customElements.define('dbui-behavior-test-f', DBUIBehaviorTestF);
            win.customElements.define('dbui-behavior-test-0', DBUIBehaviorTest0);

            // --------------test 1: writing wrapper innerHTML
            // d f e c b a - a d f e c b (Safari):
            // top is last and is preceded by shadow bottom to top
            // when b is connected c d e f are upgraded and connected
            dbuiBehaviorTestEIsUpgraded = false;
            dbuiBehaviorTestBIsUpgraded = !isSafari(win);
            win.document.body.appendChild(div);
            div.innerHTML = `
            <dbui-behavior-test-a id="dbui-behavior-test-a-light"></dbui-behavior-test-a>
            `;
            expect(connectedComponents).to.deep.equal(!isSafari(win) ? [
              'dbui-behavior-test-d-shadow', 'dbui-behavior-test-f-shadow', 'dbui-behavior-test-e-light-in-shadow',
              'dbui-behavior-test-c-shadow', 'dbui-behavior-test-b-shadow', 'dbui-behavior-test-a-light',
            ] : [
              'dbui-behavior-test-a-light', 'dbui-behavior-test-d-shadow', 'dbui-behavior-test-f-shadow',
              'dbui-behavior-test-e-light-in-shadow', 'dbui-behavior-test-c-shadow', 'dbui-behavior-test-b-shadow',
            ]);

            // --------------test 2: re-mounting wrapper
            // a b c d e f:
            // top is first and is followed by shadow top to bottom
            // when b is connected c d e f are upgraded (due to re-mounting) but not connected
            connectedComponents = [];
            dbuiBehaviorTestEIsUpgraded = true;
            dbuiBehaviorTestBIsUpgraded = true;
            div.remove();
            win.document.body.appendChild(div);
            expect(connectedComponents).to.deep.equal([
              'dbui-behavior-test-a-light', 'dbui-behavior-test-b-shadow', 'dbui-behavior-test-c-shadow',
              'dbui-behavior-test-d-shadow', 'dbui-behavior-test-e-light-in-shadow', 'dbui-behavior-test-f-shadow',
            ]);
            div.remove();

            // --------------test 3: inserting node under wrapper and wrapper inside DOM
            // a d f e c b:
            // top is first and is followed by shadow bottom to top
            // when b is connected c d e f are upgraded and connected
            connectedComponents = [];
            dbuiBehaviorTestEIsUpgraded = false;
            dbuiBehaviorTestBIsUpgraded = false;
            const div2 = win.document.createElement('div');
            const dbuiBehaviorTestA = win.document.createElement('dbui-behavior-test-a');
            dbuiBehaviorTestA.id = 'dbui-behavior-test-a-light';
            div2.appendChild(dbuiBehaviorTestA);
            win.document.body.appendChild(div2);
            expect(connectedComponents).to.deep.equal([
              'dbui-behavior-test-a-light', 'dbui-behavior-test-d-shadow', 'dbui-behavior-test-f-shadow',
              'dbui-behavior-test-e-light-in-shadow', 'dbui-behavior-test-c-shadow', 'dbui-behavior-test-b-shadow'
            ]);

            // --------------test 4: inserting node with shadow DOM under shadow DOM
            // a d f e c b:
            // top is first and is followed by shadow bottom to top
            // when b is connected c d e f are upgraded and connected
            div2.remove();
            connectedComponents = [];
            const div3 = win.document.createElement('div');
            const dbuiBehaviorTest0 = win.document.createElement('dbui-behavior-test-0');
            const dbuiBehaviorTestA2 = win.document.createElement('dbui-behavior-test-a');
            dbuiBehaviorTest0.id = 'dbui-behavior-test-0';
            dbuiBehaviorTestA2.id = 'dbui-behavior-test-a-2';
            div3.appendChild(dbuiBehaviorTest0);
            win.document.body.appendChild(div3);
            dbuiBehaviorTest0.shadowRoot.appendChild(dbuiBehaviorTestA2);
            expect(connectedComponents).to.deep.equal([
              'dbui-behavior-test-a-2', 'dbui-behavior-test-d-shadow', 'dbui-behavior-test-f-shadow',
              'dbui-behavior-test-e-light-in-shadow', 'dbui-behavior-test-c-shadow', 'dbui-behavior-test-b-shadow'
            ]);


            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          }
        });
      });
    });
  });
});
