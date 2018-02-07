import { expect, assert } from 'chai';
import sinon from 'sinon';
import getDBUIWebComponentCore from './DBUIWebComponentCore';
import DBUICommonCssVars from './DBUICommonCssVars';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUILocaleService from '../../../services/DBUILocaleService';
import appendStyles from '../../../internals/appendStyles';
import inIframe from '../../../../../../testUtils/inIframe';

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

      static get propertiesToDefine() {
        return { bar: 'BAR' };
      }

      static get propertiesToUpgrade() {
        return ['foo'];
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
            <p>dummy one component</p>
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
            <p>dummy one parent component</p>
            <dummy-one></dummy-one>
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
          expect(contentWindow.document.querySelector('style[dbui-common-css-vars]').innerText).to.equal(DBUICommonCssVars);
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

  describe('isConnected', () => {
    it('is true after connectedCallback and false after disconnectedCallback', (done) => {
      inIframe({
        bodyHTML: `
          <dummy-one-parent></dummy-one-parent>
          `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOneParent = getDummyOneParent(contentWindow);
          const dummyOneParentInstance = contentWindow.document.querySelector(DummyOneParent.registrationName);

          contentWindow.customElements.whenDefined(DummyOneParent.registrationName).then(() => {
            const parentNode = dummyOneParentInstance.parentNode;

            expect(dummyOneParentInstance.isConnected).to.equal(true);
            dummyOneParentInstance.remove();
            expect(dummyOneParentInstance.isConnected).to.equal(false);
            parentNode.appendChild(dummyOneParentInstance);
            expect(dummyOneParentInstance.isConnected).to.equal(true);
            parentNode.removeChild(dummyOneParentInstance);
            expect(dummyOneParentInstance.isConnected).to.equal(false);

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

  describe('onLocaleChange', () => {
    it('is called when locale is changed', (done) => {
      inIframe({
        bodyHTML: `
          <dummy-one></dummy-one>
          `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInstance = contentWindow.document.querySelector(DummyOne.registrationName);

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            expect(dummyOneInstance._localeObject).to.eql({ dir: 'ltr', lang: 'en' });
            contentWindow.document.documentElement.setAttribute('lang', 'sp');

            setTimeout(() => {
              expect(dummyOneInstance._localeObject).to.eql({ dir: 'ltr', lang: 'sp' });
              contentWindow.document.documentElement.setAttribute('dir', 'rtl');

              setTimeout(() => {
                expect(dummyOneInstance._localeObject).to.eql({ dir: 'rtl', lang: 'sp' });

                iframe.remove();
                done();
              }, 0);
            }, 0);

          });

          DummyOne.registerSelf();

        }
      });
    });
  });


  describe('useShadow and childrenTree', () => {
    describe('when useShadow', () => {
      it('childrenTree return shadowRoot', (done) => {
        inIframe({
          bodyHTML: `
          <dummy-one-parent></dummy-one-parent>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyOneParent = getDummyOneParent(contentWindow);
            const dummyOneParentInstance = contentWindow.document.querySelector(DummyOneParent.registrationName);

            contentWindow.customElements.whenDefined(DummyOneParent.registrationName).then(() => {

              // shadow dom structure was build as expected
              expect(
                dummyOneParentInstance.shadowRoot
              ).to.not.equal(null);
              expect(dummyOneParentInstance
                .childrenTree
              ).to.equal(dummyOneParentInstance.shadowRoot);

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

    describe('when NOT useShadow', () => {
      it('childrenTree return self instance', (done) => {
        inIframe({
          bodyHTML: `
          <dummy-one-parent></dummy-one-parent>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyOneParent = getDummyOneParent(contentWindow);
            const useShadowStub = sinon.stub(DummyOneParent, 'useShadow').get(() => {
              return false;
            });
            const dummyOneParentInstance = contentWindow.document.querySelector(DummyOneParent.registrationName);

            contentWindow.customElements.whenDefined(DummyOneParent.registrationName).then(() => {

              // shadow dom structure was build as expected
              expect(
                dummyOneParentInstance.shadowRoot
              ).to.equal(null);
              expect(dummyOneParentInstance
                .childrenTree
              ).to.equal(dummyOneParentInstance);

              useShadowStub.restore();

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
              .childrenTree.querySelector('div p')
              .innerText
            ).to.equal('dummy one parent component');
            expect(dummyOneParentInstance
              .childrenTree.querySelector(DummyOne.registrationName)
              .childrenTree.querySelector('div p')
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

  describe('propertiesToDefine', () => {
    it('are defined', (done) => {
      inIframe({
        bodyHTML: `
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneDefineProperty = DummyOne.prototype._defineProperty;
          const spyDummyOneDefineProperty = sinon.stub(DummyOne.prototype, '_defineProperty')
            .callsFake(dummyOneDefineProperty);
          const dummyOneInst = contentWindow.document.querySelector('dummy-one');

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            expect(spyDummyOneDefineProperty.callCount).to.equal(1);
            assert(spyDummyOneDefineProperty.calledWithExactly('bar', 'BAR'), 'called with bar, BAR');
            expect(dummyOneInst.getAttribute('bar')).to.equal('BAR');

            spyDummyOneDefineProperty.restore();
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

  describe('observerdAttributes', () => {
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

  describe('disconnectedCallback', () => {
    it('unregisterLocaleChange', (done) => {
      inIframe({
        bodyHTML: `
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUILocaleService = getDBUILocaleService(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInst = contentWindow.document.querySelector('dummy-one');

          // before connected
          expect(DBUILocaleService._callbacks.length).to.equal(0);

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            // after connected
            expect(DBUILocaleService._callbacks.length).to.equal(1);
            dummyOneInst.remove();
            // after disconnected
            expect(DBUILocaleService._callbacks.length).to.equal(0);

            iframe.remove();
            done();
          });

          DummyOne.registerSelf();
        }
      });
    });
  });
});
