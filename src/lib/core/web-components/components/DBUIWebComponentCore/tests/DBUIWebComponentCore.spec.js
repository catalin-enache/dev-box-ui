import { expect, assert } from 'chai';
import sinon from 'sinon';
import getDBUIWebComponentCore from '../DBUIWebComponentCore';
import getDBUIWebComponentRoot from '../../DBUIWebComponentRoot/DBUIWebComponentRoot';
import DBUICommonCssVars from '../DBUICommonCssVars';
import DBUICommonCssClasses from '../DBUICommonCssClasses';
import ensureSingleRegistration from '../../../../internals/ensureSingleRegistration';
import appendStyles from '../../../../internals/appendStyles';
import inIframe from '../../../../../../../testUtils/inIframe';
import monkeyPatch from '../../../../../../../testUtils/monkeyPatch';
import { sendTapEvent } from '../../../../../../../testUtils/simulateEvents';

/* eslint camelcase: 0 */

function getDummyNoRegistrationNameNoTemplate(win) {
  return ensureSingleRegistration(win, dummyOneRegistrationName, () => {
    const {
      DBUIWebComponentBase
    } = getDBUIWebComponentCore(win);

    return class getDummyNoRegistrationNameNoTemplate extends DBUIWebComponentBase {};
  });
}

const dummyOneRegistrationName = 'dbui-dummy-one';
const dummyOneStyle = ':host { color: blue; }';
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

      static get attributesToDefine() {
        return {
          ...super.attributesToDefine,
          ...{ bar: 'BAR' }
        };
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade, 'foo'];
      }

      /**
       * @return {string}
       */
      get foo() {
        return `||${this._foo}||`;
      }

      /**
       * @param value {string}
       */
      set foo(value) {
        this._foo = `__${value}__`;
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyOneStyle}</style>
          <div>
            <p style="padding: 0px; margin: 0px;">dummy one component</p>
            <slot></slot>
          </div>
        `;
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'baz'];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        this._attributeChangedName = name;
        this._attributeChangedOldValue = oldValue;
        this._attributeChangedNewValue = newValue;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DummyOne
      )
    );
  });
}
getDummyOne.registrationName = dummyOneRegistrationName;

const dummyOneParentRegistrationName = 'dbui-dummy-one-parent';
const dummyOneParentStyle = ':host div { background-color: #eee; }';
function getDummyOneParent(win) {
  return ensureSingleRegistration(win, dummyOneParentRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DummyOne = getDummyOne(win);

    class DummyOneParent extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyOneParentRegistrationName;
      }

      static get dependencies() {
        return [DummyOne];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyOneParentStyle}</style>
          <div>
            <p style="padding: 0px; margin: 0px;">dummy one parent component</p>
            <ul style="padding-top: 0px; padding-bottom: 0px; margin-top: 0px; margin-bottom: 0px;">
              <li>
                <dbui-dummy-one id="shadow-dummy-one"></dbui-dummy-one>
              </li>
            </ul>
          </div>
        `;
      }
    }

    return Registerable(
      defineCommonStaticMethods(
        DummyOneParent
      )
    );
  });
}
getDummyOneParent.registrationName = dummyOneParentRegistrationName;


describe('DBUIWebComponentBase', () => {
  describe('when loaded', () => {
    it('injects dbui-common-css into window document head', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          // style[dbui-common-css-vars] not injected yet
          expect(contentWindow.document.querySelector('style[dbui-common-css-vars]')).to.equal(null);
          expect(contentWindow.document.querySelector('style[dbui-common-css-classes]')).to.equal(null);
          getDBUIWebComponentCore(contentWindow);
          // style[dbui-common-css-vars] has been injected
          expect(
            contentWindow.document.querySelector('style[dbui-common-css-vars]'
            ).innerText).to.equal(DBUICommonCssVars);
          expect(
            contentWindow.document.querySelector('style[dbui-common-css-classes]'
            ).innerText).to.equal(DBUICommonCssClasses);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        }
      });
    });

    it('always returns the same reference', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const inst1 = getDBUIWebComponentCore(contentWindow).DBUIWebComponentBase;
          const inst2 = getDBUIWebComponentCore(contentWindow).DBUIWebComponentBase;
          const inst3 = getDBUIWebComponentCore(contentWindow).DBUIWebComponentBase;

          expect(Object.getPrototypeOf(inst1)).to.equal(contentWindow.HTMLElement);
          // same reference
          expect(inst1).to.equal(inst2);
          expect(inst2).to.equal(inst3);
          iframe.remove();
          done();
        }
      });
    });
  });

  describe('registerSelf and registrationName', () => {
    it('registers the component using registrationName', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one></dbui-dummy-one>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInstance = contentWindow.document.querySelector(DummyOne.registrationName);

          const notDefinedElementsBefore = [...contentWindow.document.querySelectorAll(':not(:defined)')]
            .map((element) => (element.localName));
          // localName exists in list returned by :not(:defined) CSS selector
          expect(notDefinedElementsBefore).to.eql([DBUIRoot.registrationName, DummyOne.registrationName]);
          // prototype has not been upgraded yet
          expect(dummyOneInstance.constructor).to.equal(contentWindow.HTMLElement);
          expect(dummyOneInstance.constructor.name).to.equal('HTMLElement');

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {
            const notDefinedElementsAfter = [...contentWindow.document.querySelectorAll(':not(:defined)')]
              .map((element) => (element.localName));
            // localName does not exist anymore in list returned by :not(:defined) CSS selector
            expect(notDefinedElementsAfter).to.eql([]);
            // prototype has been upgraded
            expect(dummyOneInstance.constructor).to.equal(DummyOne);
            expect(dummyOneInstance.constructor.name).to.equal('DummyOne');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('dependencies', () => {
    describe('when registerSelf', () => {
      it('registers the dependencies', (done) => {
        inIframe({
          bodyHTML: `
          <dbui-web-component-root id="dbui-web-component-root">
            <dbui-dummy-one-parent></dbui-dummy-one-parent>
          </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyOneParent = getDummyOneParent(contentWindow);
            const DummyOne = getDummyOne(contentWindow);
            const dummyOneRegisterSelf = DummyOne.registerSelf;
            const spyDummyOneRegisterSelf = sinon.stub(DummyOne, 'registerSelf')
              .callsFake(dummyOneRegisterSelf);

            contentWindow.customElements.whenDefined(DummyOneParent.registrationName).then(() => {
              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyOneParent.registerSelf();
            DBUIRoot.registerSelf();
            // registerSelf took care of registering the dependencies
            expect(spyDummyOneRegisterSelf.callCount).to.equal(1);
            spyDummyOneRegisterSelf.restore();
          }
        });
      });
    });
  });

  describe('isMounted and isDisconnected', () => {
    it(`
    isMounted is true after connectedCallback and false after disconnectedCallback,
    isDisconnected is false after connectedCallback and true after disconnectedCallback.
    We need isDisconnected info when DOM tree is constructed
    - after constructor() and before connectedCallback() -
    when closestDbuiParent should not return null.
    `, (done) => {
      inIframe({
        bodyHTML: `
          <dbui-web-component-root id="dbui-web-component-root">
            <dbui-dummy-one-parent></dbui-dummy-one-parent>
          </dbui-web-component-root>
          `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOneParent = getDummyOneParent(contentWindow);
          const dummyOneParentInstance = contentWindow.document.querySelector(DummyOneParent.registrationName);

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {
            const parentNode = dummyOneParentInstance.parentNode;
            expect(dummyOneParentInstance.isMounted).to.equal(true);
            expect(dummyOneParentInstance.isDisconnected).to.equal(false);
            dummyOneParentInstance.remove();
            expect(dummyOneParentInstance.isMounted).to.equal(false);
            expect(dummyOneParentInstance.isDisconnected).to.equal(true);
            parentNode.appendChild(dummyOneParentInstance);
            expect(dummyOneParentInstance.isMounted).to.equal(true);
            expect(dummyOneParentInstance.isDisconnected).to.equal(false);

            parentNode.removeChild(dummyOneParentInstance);
            expect(dummyOneParentInstance.isMounted).to.equal(false);
            expect(dummyOneParentInstance.isDisconnected).to.equal(true);

            iframe.remove();
            done();
          });

          DummyOneParent.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('prototypeChainInfo', () => {
    it('returns prototype chain for the component', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const { DBUIWebComponentBase } = getDBUIWebComponentCore(contentWindow);
          const DummyOneParent = getDummyOneParent(contentWindow);

          const prototypeChainInfo = DummyOneParent.prototypeChainInfo;

          expect(prototypeChainInfo[0]).to.equal(DummyOneParent);
          expect(prototypeChainInfo[2]).to.equal(contentWindow.HTMLElement);
          expect(prototypeChainInfo[1]).to.equal(DBUIWebComponentBase);

          iframe.remove();
          done();
        }
      });
    });
  });

  describe('templateInnerHTML', () => {
    it('defines the component HTML structure', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one-parent></dbui-dummy-one-parent>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const DummyOneParent = getDummyOneParent(contentWindow);
          const dummyOneParentInstance = contentWindow.document.querySelector(DummyOneParent.registrationName);

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {

            // shadow dom structure was build as expected
            expect(dummyOneParentInstance
              .shadowRoot.querySelector('div p')
              .innerText
            ).to.equal('dummy one parent component');
            expect(dummyOneParentInstance
              .shadowRoot.querySelector(DummyOne.registrationName)
              .shadowRoot.querySelector('div p')
              .innerText
            ).to.equal('dummy one component');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOneParent.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('template', () => {
    it('returns template instance built from templateInnerHTML', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOneParent = getDummyOneParent(contentWindow);
          expect(DummyOneParent.template.innerHTML)
            .to.equal(DummyOneParent.templateInnerHTML);
          iframe.remove();
          done();
        }
      });
    });
  });

  describe('componentStyle', () => {
    it('returns style part of template', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOneParent = getDummyOneParent(contentWindow);
          expect(DummyOneParent.componentStyle)
            .to.equal(dummyOneParentStyle);
          expect(DummyOneParent.componentStyle)
            .to.equal(DummyOneParent.template.content.querySelector('style').innerText);
          iframe.remove();
          done();
        }
      });
    });

    it('is updated if related bit is found on window', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOneParent = getDummyOneParent(contentWindow);
          appendStyles(contentWindow)([{
            registrationName: [DummyOneParent.registrationName],
            componentStyle: `
              border-radius: 5px;
            `
          }]);

          // before registering the style is NOT updated
          expect(DummyOneParent.componentStyle)
            .to.not.have.string('overrides');

          DummyOneParent.registerSelf();

          // after registering the style is updated
          expect(DummyOneParent.componentStyle)
            .to.have.string('overrides');
          expect(DummyOneParent.componentStyle)
            .to.have.string('border-radius: 5px;');

          iframe.remove();
          done();
        }
      });
    });
  });

  describe('propertiesToUpgrade', () => {
    it('are upgraded', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one></dbui-dummy-one>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneUpgradeProperty = DummyOne.prototype._upgradeProperty;
          const spyDummyOneUpgradeProperty = sinon.stub(DummyOne.prototype, '_upgradeProperty')
            .callsFake(dummyOneUpgradeProperty);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');
          dummyOneInst.foo = 'fooValue';
          // foo setter has not been called yet
          expect(dummyOneInst._foo).to.equal(undefined);

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {
            expect(spyDummyOneUpgradeProperty.callCount).to.equal(2);
            assert(spyDummyOneUpgradeProperty.calledWithExactly('foo'), 'called with foo');
            // foo setter has been called as a result of upgrading foo property
            expect(dummyOneInst._foo).to.equal('__fooValue__');
            // foo getter is called as a result of upgrading foo property
            expect(dummyOneInst.foo).to.equal('||__fooValue__||');

            spyDummyOneUpgradeProperty.restore();
            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('attributesToDefine', () => {
    it('are defined if not set by user', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one></dbui-dummy-one>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneDefineAttribute = DummyOne.prototype._defineAttribute;
          const spyDummyOneDefineAttribute = sinon.stub(DummyOne.prototype, '_defineAttribute')
            .callsFake(dummyOneDefineAttribute);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {
            expect(spyDummyOneDefineAttribute.callCount).to.equal(2);
            assert(spyDummyOneDefineAttribute.calledWithExactly('bar', 'BAR'), 'called with bar, BAR');
            expect(dummyOneInst.getAttribute('bar')).to.equal('BAR');

            spyDummyOneDefineAttribute.restore();
            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });

    it('are NOT defined if already set by user', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one></dbui-dummy-one>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneDefineAttribute = DummyOne.prototype._defineAttribute;
          const spyDummyOneDefineAttribute = sinon.stub(DummyOne.prototype, '_defineAttribute')
            .callsFake(dummyOneDefineAttribute);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');
          dummyOneInst.setAttribute('bar', 'customBar');

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {
            expect(spyDummyOneDefineAttribute.callCount).to.equal(2);
            assert(spyDummyOneDefineAttribute.calledWithExactly('bar', 'BAR'), 'called with bar, BAR');
            // user defined property was not overridden with default value
            expect(dummyOneInst.getAttribute('bar')).to.equal('customBar');

            spyDummyOneDefineAttribute.restore();
            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('registrationName', () => {
    it('is required', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const DummyNoRegistrationNameNoTemplate =
            getDummyNoRegistrationNameNoTemplate(contentWindow);
          const registrationNameGetter =
            Object.getOwnPropertyDescriptor(
              Object.getPrototypeOf(DummyNoRegistrationNameNoTemplate), 'registrationName'
            );
          let thrownErr = null;
          const spyRegistrationName =
            // eslint-disable-next-line
            sinon.stub(DummyNoRegistrationNameNoTemplate, 'registrationName').get(() => {
              try {
                return registrationNameGetter.get();
              } catch (err) {
                thrownErr = err;
              }
            });

          DummyNoRegistrationNameNoTemplate.registrationName;
          expect(thrownErr.message).to.include('registrationName must be defined in derived');

          spyRegistrationName.restore();

          iframe.remove();
          done();
        }
      });
    });
  });

  describe('templateInnerHTML', () => {
    it('has default when not specified', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const DummyNoRegistrationNameNoTemplate =
            getDummyNoRegistrationNameNoTemplate(contentWindow);

          const templateInnerHTML = DummyNoRegistrationNameNoTemplate.templateInnerHTML;
          expect(templateInnerHTML).to.equal('<style></style><slot></slot>');

          iframe.remove();
          done();
        }
      });
    });
  });

  describe('observedAttributes', () => {
    it('are observed', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one></dbui-dummy-one>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');

          dummyOneInst.setAttribute('baz', 3);

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {

            expect(dummyOneInst._attributeChangedName).to.equal('baz');
            expect(dummyOneInst._attributeChangedOldValue).to.equal(null);
            expect(dummyOneInst._attributeChangedNewValue).to.equal('3');

            dummyOneInst.removeAttribute('baz');

            expect(dummyOneInst._attributeChangedName).to.equal('baz');
            expect(dummyOneInst._attributeChangedOldValue).to.equal('3');
            expect(dummyOneInst._attributeChangedNewValue).to.equal(null);

            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('getClosestAncestorMatchingCondition', () => {
    it('return closest ancestor matching condition', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="one" foo="bar">
            <div id="two">
              <dbui-dummy-one></dbui-dummy-one>
            </div>
          </div>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {
            const closestAncestorMatchingCondition =
              dummyOneInst.getClosestAncestorMatchingCondition((node) => {
                return node.getAttribute('foo') === 'bar';
              });
            expect(closestAncestorMatchingCondition.id).to.equal('one');
            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('observedDynamicAttributes', () => {
    describe('when NOT hasDynamicAttributes', () => {
      it('does not have _dynamicAttributesObserver', (done) => {
        inIframe({
          bodyHTML: `
            <dbui-web-component-root id="dbui-web-component-root">
              <dbui-dummy-one></dbui-dummy-one>
            </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyOne = getDummyOne(contentWindow);
            const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');

            contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {

              expect(dummyOneInst._dynamicAttributesObserver).to.equal(null);
              expect(dummyOneInst.hasDynamicAttributes).to.equal(false);
              expect(dummyOneInst.observedDynamicAttributes).to.deep.equal([]);

              iframe.remove();
              done();
            });

            DummyOne.registerSelf();
            DBUIRoot.registerSelf();
          }
        });
      });
    });

    describe('when hasDynamicAttributes', () => {
      it('has _dynamicAttributesObserver observing observedDynamicAttributes', (done) => {
        inIframe({
          bodyHTML: `
            <dbui-web-component-root id="dbui-web-component-root">
              <div id="container">
                <dbui-dummy-one dynamic-one="one" dynamic-two="two"></dbui-dummy-one>
              </div>
            </dbui-web-component-root>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
            const DummyOne = getDummyOne(contentWindow);

            monkeyPatch(DummyOne).proto.set('hasDynamicAttributes', () => {
              return {
                get() {
                  return true;
                }
              };
            });

            monkeyPatch(DummyOne).proto.set('observedDynamicAttributes', () => {
              return {
                get() {
                  // noinspection JSCheckFunctionSignatures
                  return Array.from(this.attributes)
                    .filter((attr) => attr.name.startsWith('dynamic-'))
                    .map((attr) => attr.name);
                }
              };
            });

            const container = contentWindow.document.querySelector('#container');
            const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');

            contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {
              const dynamicAttributesObserver1 = dummyOneInst._dynamicAttributesObserver;

              expect(dynamicAttributesObserver1)
                .to.be.an.instanceof(contentWindow.MutationObserver);

              const attributeChangedCallbackCalls = [];

              const attributeChangedCallback = dummyOneInst.attributeChangedCallback;
              dummyOneInst.attributeChangedCallback = (name, oldValue, newValue) => {
                attributeChangedCallbackCalls.push({
                  name, oldValue, newValue
                });
                attributeChangedCallback.call(this, name, oldValue, newValue);
              };

              expect(dummyOneInst.observedDynamicAttributes).to.deep.equal([
                'dynamic-one', 'dynamic-two'
              ]);

              dummyOneInst.setAttribute('dynamic-one', '_one');

              setTimeout(() => {
                expect(attributeChangedCallbackCalls[0]).to.deep.equal({
                  name: 'dynamic-one', newValue: '_one', oldValue: 'one'
                });

                dummyOneInst.setAttribute('dynamic-three', 'three');

                setTimeout(() => {
                  expect(dummyOneInst.observedDynamicAttributes).to.deep.equal([
                    'dynamic-one', 'dynamic-two', 'dynamic-three'
                  ]);
                  expect(dummyOneInst._previouslyObservedDynamicAttributes['dynamic-three']).to.equal('three');

                  expect(attributeChangedCallbackCalls[1]).to.deep.equal({
                    name: 'dynamic-three', newValue: 'three', oldValue: null
                  });

                  setTimeout(() => {
                    dummyOneInst.removeAttribute('dynamic-three');

                    setTimeout(() => {
                      expect(dummyOneInst.observedDynamicAttributes).to.deep.equal([
                        'dynamic-one', 'dynamic-two'
                      ]);
                      expect(Object.keys(dummyOneInst._previouslyObservedDynamicAttributes))
                        .to.not.include('dynamic-three');
                      expect(attributeChangedCallbackCalls[2]).to.deep.equal({
                        name: 'dynamic-three', newValue: null, oldValue: 'three'
                      });

                      dummyOneInst.remove();

                      expect(dummyOneInst._dynamicAttributesObserver)
                        .to.equal(null);

                      container.appendChild(dummyOneInst);

                      const dynamicAttributesObserver2 = dummyOneInst._dynamicAttributesObserver;
                      expect(dynamicAttributesObserver2)
                        .to.be.an.instanceof(contentWindow.MutationObserver);
                      expect(dynamicAttributesObserver2).to.not.equal(dynamicAttributesObserver1);

                      dummyOneInst.setAttribute('dynamic-one', 'one');

                      setTimeout(() => {
                        expect(attributeChangedCallbackCalls[3]).to.deep.equal({
                          name: 'dynamic-one', newValue: 'one', oldValue: '_one'
                        });

                        iframe.remove();
                        done();
                      });

                    });
                  });
                });
              });
            });

            DummyOne.registerSelf();
            DBUIRoot.registerSelf();
          }
        });
      });
    });
  });

  describe('vNativeScrollbarThickness, hNativeScrollbarThickness', () => {
    it('returns the thickness of native h/v scrolls', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
          <dbui-web-component-root id="dbui-web-component-root">
            <dbui-dummy-one></dbui-dummy-one>
          </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');
          Promise.all([
            DBUIRoot.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {
            expect(dummyOneInst.vNativeScrollbarThickness).to.equal(dummyOneInst.hNativeScrollbarThickness);
            expect(dummyOneInst.vNativeScrollbarThickness).to.be.within(0, 25);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('isDesktopBrowser, isMobileBrowser', () => {
    it('returns true if vNativeScrollbarThickness > 0 else false', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one></dbui-dummy-one>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');
          Promise.all([
            DBUIRoot.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {
            expect(dummyOneInst.vNativeScrollbarThickness).to.equal(dummyOneInst.hNativeScrollbarThickness);
            expect(dummyOneInst.vNativeScrollbarThickness).to.be.within(0, 25);
            if (dummyOneInst.vNativeScrollbarThickness > 0) {
              expect(dummyOneInst.isDesktopBrowser).to.equal(true);
              expect(dummyOneInst.isMobileBrowser).to.equal(false);
            } else {
              expect(dummyOneInst.isDesktopBrowser).to.equal(false);
              expect(dummyOneInst.isMobileBrowser).to.equal(true);
            }

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('hasNegativeRTLScroll', () => {
    it('returns boolean', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one></dbui-dummy-one>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');
          Promise.all([
            DBUIRoot.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {
            expect(typeof dummyOneInst.hasNegativeRTLScroll).to.equal('boolean');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('unselectable attribute', () => {
    it('makes component unselectable', (done) => {
      inIframe({
        headStyle: `
        /*
        :root {
          -webkit-touch-callout:none;               
          -webkit-text-size-adjust:none;          
          -webkit-tap-highlight-color:rgba(0,0,0,0);
        }
        */
        `,
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="container">
            <div>light DOM text</div>
            <dbui-dummy-one unselectable>dummy one slot text content</dbui-dummy-one>
            <div>light DOM text</div>
          </div>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dbui-dummy-one');

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {

            expect(dummyOneInst.style.userSelect).to.equal('none');
            expect(dummyOneInst.unselectable).to.equal(true);

            dummyOneInst.unselectable = false;
            expect(dummyOneInst.hasAttribute('unselectable')).to.equal(false);
            expect(dummyOneInst.style.userSelect || '').to.equal('');

            dummyOneInst.unselectable = true;
            expect(dummyOneInst.style.userSelect).to.equal('none');
            expect(dummyOneInst.hasAttribute('unselectable')).to.equal(true);
            expect(dummyOneInst.style.userSelect).to.equal('none');

            const contentWindowGetSelection = contentWindow.getSelection;
            let contentWindowGetSelectionCalls = 0;
            contentWindow.getSelection = () => {
              return {
                removeAllRanges() {
                  contentWindowGetSelectionCalls += 1;
                }
              };
            };

            sendTapEvent(dummyOneInst, 'start');
            sendTapEvent(dummyOneInst, 'move');
            sendTapEvent(dummyOneInst, 'end');

            expect(contentWindowGetSelectionCalls).to.equal(2);

            contentWindow.getSelection = contentWindowGetSelection;

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });
});
