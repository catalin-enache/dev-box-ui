import { expect } from 'chai';
import inIframe from '../../../../../../../testUtils/inIframe';
import getDBUIWebComponentBase
  from '../../../components/DBUIWebComponentBase/DBUIWebComponentBase';
import { getDummyX } from '../../../../../../../testUtils/dbuiClassFactory';
import ContextProviderAware from '../ContextProvider';

const renderPropertiesValues = (self, properties) => {
  self.shadowRoot.querySelector('#details').innerHTML =
    Object.keys(properties).reduce((acc, name) => {
      acc += ` ${name}: ${self[name]} `;
      return acc;
    }, '');
};

const getDummyComp = (contentWindow, registrationName, className, {
  properties = {
    num: { type: Number, attribute: true, defaultValue: 0 },
    // provider: { type: Provider, attribute: false, defaultValue: null }
  },
  callbacks = {
    // onConnectedCallback
  }
} = {}) => {
  return getDummyX(registrationName, className, {
    properties,
    dependentHTML: '<span id="details"></span>',
    callbacks: {
      onConnectedCallback: (self) => {
        renderPropertiesValues(self, properties);
        callbacks.onConnectedCallback && callbacks.onConnectedCallback(self);
      },
      onPropertyChangedCallback: (self, name, oldValue, value) => {
        renderPropertiesValues(self, properties);
        callbacks.onPropertyChangedCallback && callbacks.onPropertyChangedCallback(self, name, oldValue, value);
      }
    }
  })(contentWindow);
};

const getProvider = (contentWindow, registrationName, className, {
  properties = {
    num: { type: Number, attribute: true, defaultValue: 1 }
  },
  descendantsFilter,
  onlyDeclaredProperties,
  callbacks = {
    // onConnectedCallback
  }
} = {}) => {
  const Provider = getDummyX(registrationName, className, {
    dependentHTML: '<span id="details"></span>',
    callbacks: {
      onConnectedCallback: (self) => {
        renderPropertiesValues(self, properties);
        callbacks.onConnectedCallback && callbacks.onConnectedCallback(self);
      },
      onPropertyChangedCallback: (self, name, oldValue, value) => {
        renderPropertiesValues(self, properties);
        callbacks.onPropertyChangedCallback && callbacks.onPropertyChangedCallback(self, name, oldValue, value);
      }
    }
  })(contentWindow);

  return ContextProviderAware({
    descendantsFilter,
    onlyDeclaredProperties,
    win: contentWindow,
    properties: {
      ...properties,
      provider: { type: getDBUIWebComponentBase(contentWindow), attribute: false, defaultValue: (self) => self }
    }
  })(Provider);
};

describe('ContextProvider', () => {

  it(`
  Properties declared are merged into static properties in order to
  integrate with onPropertyChange mechanism.
  `, (done) => {
    inIframe({
      bodyHTML: `
      <dbui-cp></dbui-cp>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const Provider = getProvider(contentWindow, 'dbui-cp', 'DBUICP', {
          properties: {
            num: { type: Number, attribute: true, defaultValue: 1 },
            str: { type: String, attribute: true, defaultValue: 'x' }
          }
        });

        contentWindow.customElements.whenDefined(Provider.registrationName).then(() => {

          expect('num' in Provider.properties).to.equal(true);
          expect('str' in Provider.properties).to.equal(true);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        Provider.registerSelf();
      }
    });
  });

  it(`
  While provider is mounted, it updates properties for existing and newly added descendants
  at definition time and at runtime.
  `, (done) => {
    inIframe({
      bodyHTML: `
      <dbui-cp id="cp-one">
        <div id="one"></div>
      </dbui-cp>
      <dbui-cp id="cp-two">
      </dbui-cp>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const Provider = getProvider(contentWindow, 'dbui-cp', 'DBUICP', {
          descendantsFilter: () => true
        });
        const cpOne = contentWindow.document.querySelector('#cp-one');
        const cpTwo = contentWindow.document.querySelector('#cp-two');
        const one = contentWindow.document.querySelector('#one');

        cpTwo.addEventListener('dbui-event-node-added', () => {
          expect(one.num).to.equal(3);
          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        contentWindow.customElements.whenDefined(Provider.registrationName).then(() => {
          expect(one.num).to.equal(1);
          cpOne.num = 2;
          expect(one.num).to.equal(2);
          cpTwo.num = 3;
          cpTwo.appendChild(one);
        });

        Provider.registerSelf();
      }
    });
  });

  it(`
  While provider is un-mounted properties changes are not propagated to descendants (existing or newly added)
  but they will be updated at next mount.
  `, (done) => {
    inIframe({
      bodyHTML: `
      <dbui-cp>
        <dbui-dummy-one></dbui-dummy-one>
      </dbui-cp>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const Provider = getProvider(contentWindow, 'dbui-cp', 'DBUICP', {});
        const DummyOne = getDummyComp(contentWindow, 'dbui-dummy-one', 'DummyOne', {});

        const dummyCp = contentWindow.document.querySelector('dbui-cp');
        const dummyCpParent = dummyCp.parentElement;
        const dummyOne = contentWindow.document.querySelector('dbui-dummy-one');
        const dummyWhatever = contentWindow.document.createElement('dbui-dummy-whatever');

        contentWindow.customElements.whenDefined(Provider.registrationName).then(() => {

          expect(dummyOne.num).to.equal(1);

          dummyCp.remove();

          dummyCp.appendChild(dummyWhatever);
          expect(dummyWhatever.num).to.equal(undefined);
          dummyCp.num = 2;
          expect(dummyOne.num).to.equal(1); // unchanged
          expect(dummyWhatever.num).to.equal(undefined); // unchanged

          dummyCpParent.appendChild(dummyCp);

          expect(dummyOne.num).to.equal(2); // changed on mount
          expect(dummyWhatever.num).to.equal(2); // changed on mount

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);

        });

        Provider.registerSelf();
        DummyOne.registerSelf();
      }
    });
  });

  it(`
  While provider is mounted, when descendant is removed it dispatches dbui-event-node-removed.
  When descendant is added it dispatches dbui-event-node-added.
  These happen only for descendants passing descendantsFilter.
  `, (done) => {
    inIframe({
      bodyHTML: `
      <dbui-cp>
        <dbui-dummy-one></dbui-dummy-one>
        <div></div>
      </dbui-cp>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const Provider = getProvider(contentWindow, 'dbui-cp', 'DBUICP', {});
        const DummyOne = getDummyComp(contentWindow, 'dbui-dummy-one', 'DummyOne', {});

        const removedNodes = [];
        const addedNodes = [];

        const dummyCp = contentWindow.document.querySelector('dbui-cp');
        const dummyOne = contentWindow.document.querySelector('dbui-dummy-one');
        const div = contentWindow.document.querySelector('div');

        dummyCp.addEventListener('dbui-event-node-removed', (evt) => {
          removedNodes.push(evt.detail.descendant);
        });

        dummyCp.addEventListener('dbui-event-node-added', (evt) => {
          addedNodes.push(evt.detail.descendant);
          expect(removedNodes.length).to.equal(1);
          expect(removedNodes[0]).to.equal(dummyOne);
          expect(addedNodes.length).to.equal(1);
          expect(addedNodes[0]).to.equal(dummyOne);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        contentWindow.customElements.whenDefined(Provider.registrationName).then(() => {

          dummyOne.remove();
          div.remove();
          dummyCp.appendChild(div);
          dummyCp.appendChild(dummyOne);

        });

        Provider.registerSelf();
        DummyOne.registerSelf();
      }
    });
  });

  it(`
  While provider is unmounted, when descendant is removed it does NOT dispatch dbui-event-node-removed.
  When descendant is added it does NOT dispatch dbui-event-node-added.
  Note: while provider is unmounted the DOM observer is disconnected.
  `, (done) => {
    inIframe({
      bodyHTML: `
      <dbui-cp>
        <dbui-dummy-one></dbui-dummy-one>
        <div></div>
      </dbui-cp>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const Provider = getProvider(contentWindow, 'dbui-cp', 'DBUICP', {});
        const DummyOne = getDummyComp(contentWindow, 'dbui-dummy-one', 'DummyOne', {});

        const removedNodes = [];
        const addedNodes = [];

        const dummyCp = contentWindow.document.querySelector('dbui-cp');
        const dummyCpParent = dummyCp.parentElement;
        const dummyOne = contentWindow.document.querySelector('dbui-dummy-one');
        const div = contentWindow.document.querySelector('div');

        dummyCp.addEventListener('dbui-event-node-removed', (evt) => {
          removedNodes.push(evt.detail.descendant);
        });

        dummyCp.addEventListener('dbui-event-node-added', (evt) => {
          addedNodes.push(evt.detail.descendant);
        });

        contentWindow.customElements.whenDefined(Provider.registrationName).then(() => {

          dummyCp.remove();
          dummyOne.remove();
          div.remove();
          dummyCp.appendChild(dummyOne);
          dummyCpParent.appendChild(dummyCp);

          expect(removedNodes.length).to.equal(0);
          expect(addedNodes.length).to.equal(0);
          expect(dummyCp.children.length).to.equal(1);
          expect(dummyCp.children[0]).to.equal(dummyOne);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);

        });

        DummyOne.registerSelf();
        Provider.registerSelf();
      }
    });
  });

  it(`
  Provider can send self down via property.
  `, (done) => {
    inIframe({
      bodyHTML: `
      <dbui-cp>
        <dbui-dummy-one></dbui-dummy-one>
        <div></div>
      </dbui-cp>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const Provider = getProvider(contentWindow, 'dbui-cp', 'DBUICP', {
          onlyDeclaredProperties: false,
          descendantsFilter: () => true
        });

        const DummyOne = getDummyComp(contentWindow, 'dbui-dummy-one', 'DummyOne', {
          properties: {
            provider: { type: Provider, attribute: false, defaultValue: null }
          },
        });

        const dummyOne = contentWindow.document.querySelector('dbui-dummy-one');
        const div = contentWindow.document.querySelector('div');

        contentWindow.customElements.whenDefined(Provider.registrationName).then(() => {

          expect(div.provider instanceof Provider).to.equal(true);
          expect(dummyOne.provider instanceof Provider).to.equal(true);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        Provider.registerSelf();
        DummyOne.registerSelf();
      }
    });
  });

  describe('descendants', () => {
    it(`
    Iterates over descendants skipping same provider and
    considering only descendants passing descendantsFilter.
    `, (done) => {
      inIframe({
        bodyHTML: `
        <dbui-cp-one id="cp-one-outer">
          <p id="p"></p>
          <div id="one"></div>
          <dbui-cp-two id="cp-two">
            <div id="two"></div>
            <dbui-cp-one id="cp-one-inner">
              <div id="three"></div>
            </dbui-cp-one>
          </dbui-cp-two>
        </dbui-cp-one>
        <dbui-cp-three id="cp-three-outer">
          <div id="four"></div>
          <dbui-cp-three num="2" id="cp-three-inner">
            <div id="five"></div>
          </dbui-cp-three>
        </dbui-cp-three>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const ProviderOne = getProvider(contentWindow, 'dbui-cp-one', 'DBUICPOne', {
            onlyDeclaredProperties: false,
            descendantsFilter: (descendant) => ['div'].includes(descendant.nodeName.toLowerCase()),
            properties: {
              num: { type: Number, attribute: true, defaultValue: 1 },
              otherStr: { type: String, attribute: true, defaultValue: 'y' }
            }
          });

          const ProviderTwo = getProvider(contentWindow, 'dbui-cp-two', 'DBUICPTwo', {
            onlyDeclaredProperties: false,
            descendantsFilter: () => true,
            properties: {
              num: { type: Number, attribute: true, defaultValue: 2 },
              str: { type: String, attribute: true, defaultValue: 'x' }
            }
          });

          const ProviderThree = getProvider(contentWindow, 'dbui-cp-three', 'DBUICPThree', {
            onlyDeclaredProperties: false,
            descendantsFilter: () => true
          });

          const cpOneOuter = contentWindow.document.querySelector('#cp-one-outer');
          const cpOneInner = contentWindow.document.querySelector('#cp-one-inner');
          const cpTwo = contentWindow.document.querySelector('#cp-two');
          const cpThreeOuter = contentWindow.document.querySelector('#cp-three-outer');
          const three = contentWindow.document.querySelector('#three');
          const four = contentWindow.document.querySelector('#four');
          const five = contentWindow.document.querySelector('#five');


          contentWindow.customElements.whenDefined(ProviderOne.registrationName).then(() => {

            const cpOneOuterDescendants = [...cpOneOuter.descendants];
            const cpOneInnerDescendants = [...cpOneInner.descendants];
            const cpTwoDescendants = [...cpTwo.descendants];
            const cpThreeOuterDescendants = [...cpThreeOuter.descendants];

            // Proof that the filtering works.
            expect(cpOneOuterDescendants.map((desc) => desc.id)).to.deep.equal(['one', 'two']);
            expect(cpOneInnerDescendants.map((desc) => desc.id)).to.deep.equal(['three']);
            expect(cpTwoDescendants.map((desc) => desc.id)).to.deep.equal(['two', 'cp-one-inner', 'three']);

            // Proof that providers of the same time are not walked through and
            // inner providers of the same time are allowed control over their descendants.
            expect(cpThreeOuterDescendants.length).to.equal(1); // the div
            expect(four.num).to.equal(1);
            expect(five.num).to.equal(2);

            // Proof that ancestor providers override descendant providers on common controlled properties.
            expect(cpOneOuter.num).to.equal(1);
            expect(cpTwo.num).to.equal(2);
            expect(cpOneInner.num).to.equal(2);
            expect(three.num).to.equal(2);

            // Proof that all providers contribute to descendants updates.
            expect(three.str).to.equal('x');
            expect(three.otherStr).to.equal('y');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          ProviderOne.registerSelf();
          ProviderThree.registerSelf();
          ProviderTwo.registerSelf();

        }
      });
    });
  });

  describe('onlyDeclaredProperties', () => {
    it(`
    Only properties declared by descendant will be updated when this flag is true.
    However this requires that targeted descendant to be already registered
    or declared properties will not be available to be inspected since descendant constructor is not available.
    `, (done) => {
      inIframe({
        bodyHTML: `
        <dbui-cp>
          <dbui-dummy-one></dbui-dummy-one>
          <dbui-dummy-two></dbui-dummy-two>
          <dbui-dummy-three></dbui-dummy-three>
          <div></div>
        </dbui-cp>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const Provider = getProvider(contentWindow, 'dbui-cp', 'DBUICP', {
            onlyDeclaredProperties: true,
            descendantsFilter: () => true,
            properties: {
              num: { type: Number, attribute: true, defaultValue: 1 },
              str: { type: String, attribute: true, defaultValue: 'x' },
            },
          });

          const DummyOne = getDummyComp(contentWindow, 'dbui-dummy-one', 'DummyOne', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 }
            },
          });

          const DummyTwo = getDummyComp(contentWindow, 'dbui-dummy-two', 'DummyTwo', {
            properties: {
              str: { type: String, attribute: true, defaultValue: '' }
            },
          });

          const DummyThree = getDummyComp(contentWindow, 'dbui-dummy-three', 'DummyThree', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 },
              str: { type: String, attribute: true, defaultValue: '' }
            },
          });

          const dummyOne = contentWindow.document.querySelector('dbui-dummy-one');
          const dummyTwo = contentWindow.document.querySelector('dbui-dummy-two');
          const dummyThree = contentWindow.document.querySelector('dbui-dummy-three');
          const div = contentWindow.document.querySelector('div');

          contentWindow.customElements.whenDefined(Provider.registrationName).then(() => {

            expect(dummyOne.num).to.equal(1); // the only declared
            expect(dummyOne.str).to.equal(undefined); // not declared
            expect(dummyTwo.num).to.equal(undefined); // not declared
            expect(dummyTwo.str).to.equal('x'); // the only declared
            expect(dummyThree.num).to.equal(0); // not updated due to being registered after provider
            expect(dummyThree.str).to.equal(''); // not updated due to being registered after provider
            expect(div.num).to.equal(undefined); // not declared
            expect(div.str).to.equal(undefined); // not declared

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
          DummyTwo.registerSelf();
          Provider.registerSelf();
          DummyThree.registerSelf();
        }
      });
    });
  });

});
