import { expect, assert } from 'chai';
import sinon from 'sinon';
import getDBUIWebComponentCore from './DBUIWebComponentCore';
import DBUICommonCssVars from './DBUICommonCssVars';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import appendStyles from '../../../internals/appendStyles';
import inIframe from '../../../../../../testUtils/inIframe';

/* eslint camelcase: 0 */

function getDummyNoRegistrationNameNoTemplate(win) {
  return ensureSingleRegistration(win, dummyOneRegistrationName, () => {
    const {
      DBUIWebComponentBase
    } = getDBUIWebComponentCore(win);

    return class getDummyNoRegistrationNameNoTemplate extends DBUIWebComponentBase {};
  });
}

const dummyOneRegistrationName = 'dummy-one';
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

      init() {
        this._init = true;
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
          </div>
        `;
      }

      onLocaleChange(locale) {
        this._localeObject = locale;
      }

      static get observedAttributes() {
        return ['baz'];
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

const dummyOneParentRegistrationName = 'dummy-one-parent';
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
                <dummy-one id="shadow-dummy-one"></dummy-one>
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
    it('injects dbui-common-css-vars into window document head', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          // style[dbui-common-css-vars] not injected yet
          expect(contentWindow.document.querySelector('style[dbui-common-css-vars]')).to.equal(null);
          getDBUIWebComponentCore(contentWindow);
          // style[dbui-common-css-vars] has been injected
          expect(
            contentWindow.document.querySelector('style[dbui-common-css-vars]'
            ).innerText).to.equal(DBUICommonCssVars);
          iframe.remove();
          done();
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
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInstance = contentWindow.document.querySelector(DummyOne.registrationName);

          const notDefinedElementsBefore = [...contentWindow.document.querySelectorAll(':not(:defined)')]
            .map((element) => (element.localName));
          // localName exists in list returned by :not(:defined) CSS selector
          expect(notDefinedElementsBefore).to.eql([DummyOne.registrationName]);
          // prototype has not been upgraded yet
          expect(dummyOneInstance.constructor).to.equal(contentWindow.HTMLElement);
          expect(dummyOneInstance.constructor.name).to.equal('HTMLElement');

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
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
        }
      });
    });

    it('calls init to support mixins', (done) => {
      inIframe({
        bodyHTML: `
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInstance = contentWindow.document.querySelector(DummyOne.registrationName);
          expect(dummyOneInstance._init).to.equal(undefined);

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            expect(dummyOneInstance._init).to.equal(true);

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

  describe('dependencies', () => {
    describe('when registerSelf', () => {
      it('registers the dependencies first', (done) => {
        inIframe({
          bodyHTML: `
          <dummy-one-parent></dummy-one-parent>
          `,
          onLoad: ({ contentWindow, iframe }) => {
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
          <dummy-one-parent></dummy-one-parent>
          `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOneParent = getDummyOneParent(contentWindow);
          const dummyOneParentInstance = contentWindow.document.querySelector(DummyOneParent.registrationName);

          contentWindow.customElements.whenDefined(DummyOneParent.registrationName).then(() => {
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
        <dummy-one-parent></dummy-one-parent>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const DummyOneParent = getDummyOneParent(contentWindow);
          const dummyOneParentInstance = contentWindow.document.querySelector(DummyOneParent.registrationName);

          contentWindow.customElements.whenDefined(DummyOneParent.registrationName).then(() => {

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
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneUpgradeProperty = DummyOne.prototype._upgradeProperty;
          const spyDummyOneUpgradeProperty = sinon.stub(DummyOne.prototype, '_upgradeProperty')
            .callsFake(dummyOneUpgradeProperty);
          const dummyOneInst = contentWindow.document.querySelector('dummy-one');
          dummyOneInst.foo = 'fooValue';
          // foo setter has not been called yet
          expect(dummyOneInst._foo).to.equal(undefined);

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            expect(spyDummyOneUpgradeProperty.callCount).to.equal(1);
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
        }
      });
    });
  });

  describe('attributesToDefine', () => {
    it('are defined if not set by user', (done) => {
      inIframe({
        bodyHTML: `
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneDefineAttribute = DummyOne.prototype._defineAttribute;
          const spyDummyOneDefineAttribute = sinon.stub(DummyOne.prototype, '_defineAttribute')
            .callsFake(dummyOneDefineAttribute);
          const dummyOneInst = contentWindow.document.querySelector('dummy-one');

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            expect(spyDummyOneDefineAttribute.callCount).to.equal(2);
            assert(spyDummyOneDefineAttribute.calledWithExactly('bar', 'BAR'), 'called with bar, BAR');
            expect(dummyOneInst.getAttribute('bar')).to.equal('BAR');

            spyDummyOneDefineAttribute.restore();
            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
        }
      });
    });

    it('are NOT defined if already set by user', (done) => {
      inIframe({
        bodyHTML: `
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneDefineAttribute = DummyOne.prototype._defineAttribute;
          const spyDummyOneDefineAttribute = sinon.stub(DummyOne.prototype, '_defineAttribute')
            .callsFake(dummyOneDefineAttribute);
          const dummyOneInst = contentWindow.document.querySelector('dummy-one');
          dummyOneInst.setAttribute('bar', 'customBar');

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            expect(spyDummyOneDefineAttribute.callCount).to.equal(2);
            assert(spyDummyOneDefineAttribute.calledWithExactly('bar', 'BAR'), 'called with bar, BAR');
            // user defined property was not overridden with default value
            expect(dummyOneInst.getAttribute('bar')).to.equal('customBar');

            spyDummyOneDefineAttribute.restore();
            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
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
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dummy-one');

          dummyOneInst.setAttribute('baz', 3);

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

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
        }
      });
    });
  });

  describe('getClosestAncestorMatchingCondition', () => {
    it('return closest ancestor matching condition', (done) => {
      inIframe({
        bodyHTML: `
        <div id="one" foo="bar">
          <div id="two">
            <dummy-one></dummy-one>
          </div>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dummy-one');

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            const closestAncestorMatchingCondition =
              dummyOneInst.getClosestAncestorMatchingCondition((node) => {
                return node.getAttribute('foo') === 'bar';
              });
            expect(closestAncestorMatchingCondition.id).to.equal('one');
            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
        }
      });
    });
  });
});
