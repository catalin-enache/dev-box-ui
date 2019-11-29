import { expect, assert } from 'chai';
import sinon from 'sinon';
import getDBUIWebComponentBase from '../DBUIWebComponentBase';
import getDBUIWebComponentRoot from '../../DBUIWebComponentRoot/DBUIWebComponentRoot';
import DBUICommonCssVars from '../DBUICommonCssVars';
import DBUICommonCssClasses from '../DBUICommonCssClasses';
import ensureSingleRegistration from '../../../../internals/ensureSingleRegistration';
import appendStyles from '../../../../internals/appendStyles';
import inIframe from '../../../../../../../testUtils/inIframe';
import monkeyPatch from '../../../../../../../testUtils/monkeyPatch';
import { sendTapEvent } from '../../../../../../../testUtils/simulateEvents';


function getDummyX(
  registrationName, className,
  {
    style = ':host { display: block; } div { padding-left: 10px; }',
    dependentClasses = [], dependentHTML = '', properties = {},
    callbacks = {
      // onConnectedCallback
    }
  } = {}
) {
  function factory(win) {
    return ensureSingleRegistration(win, registrationName, () => {
      const DBUIWebComponentBase = getDBUIWebComponentBase(win);

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

        // static get sharedStyleSheet() {
        //   return '* { color: green; }';
        // }

        static get properties() {
          return properties;
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

        constructor() {
          super();
          console.log('constructor done', className);
          this.className = className;
        }

        onConnectedCallback() {
          super.onConnectedCallback();
          callbacks.onConnectedCallback && callbacks.onConnectedCallback(this);
        }

        onDisconnectedCallback() {
          super.onDisconnectedCallback();
          callbacks.onDisconnectedCallback && callbacks.onDisconnectedCallback(this);
        }

        onPropertyChangedCallback(name, oldValue, newValue) {
          super.onPropertyChangedCallback(name, oldValue, newValue);
          if (name === 'dir') {
            this.shadowRoot.querySelector('b').innerHTML += `(${newValue})`;
          }
          callbacks.onPropertyChangedCallback &&
            callbacks.onPropertyChangedCallback(this, name, oldValue, newValue);
        }
      };

      return klass;
    });
  }
  return factory;
}

function getDbuiXClasses(contentWindow, {
  onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback
}) {
  const DBUIDummyOne = getDummyX('dbui-dummy-one', 'DBUIDummyOne', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwo = getDummyX('dbui-dummy-two', 'DBUIDummyTwo', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyThree = getDummyX('dbui-dummy-three', 'DBUIDummyThree', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyFour = getDummyX('dbui-dummy-four', 'DBUIDummyFour', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyFive = getDummyX('dbui-dummy-five', 'DBUIDummyFive', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummySix = getDummyX('dbui-dummy-six', 'DBUIDummySix', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummySeven = getDummyX('dbui-dummy-seven', 'DBUIDummySeven', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyEight = getDummyX('dbui-dummy-eight', 'DBUIDummyEight', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyNine = getDummyX('dbui-dummy-nine', 'DBUIDummyNine', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTen = getDummyX('dbui-dummy-ten', 'DBUIDummyTen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyEleven = getDummyX('dbui-dummy-eleven', 'DBUIDummyEleven', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwelve = getDummyX('dbui-dummy-twelve', 'DBUIDummyTwelve', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyThirteen = getDummyX('dbui-dummy-thirteen', 'DBUIDummyThirteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyFourteen = getDummyX('dbui-dummy-fourteen', 'DBUIDummyFourteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyFifteen = getDummyX('dbui-dummy-fifteen', 'DBUIDummyFifteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummySixteen = getDummyX('dbui-dummy-sixteen', 'DBUIDummySixteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummySeventeen = getDummyX('dbui-dummy-seventeen', 'DBUIDummySeventeen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyEighteen = getDummyX('dbui-dummy-eighteen', 'DBUIDummyEighteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyNineteen = getDummyX('dbui-dummy-nineteen', 'DBUIDummyNineteen', {
    dependentClasses: [DBUIDummyEighteen, DBUIDummySeventeen],
    // DBUIDummySeventeen can be added later at runtime
    dependentHTML: `
    <dbui-dummy-eighteen></dbui-dummy-eighteen>
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwenty = getDummyX('dbui-dummy-twenty', 'DBUIDummyTwenty', {
    dependentClasses: [DBUIDummyNineteen],
    dependentHTML: `
    <dbui-dummy-nineteen></dbui-dummy-nineteen>
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyOne = getDummyX('dbui-dummy-twenty-one', 'DBUIDummyTwenty-one', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyTwo = getDummyX('dbui-dummy-twenty-two', 'DBUIDummyTwentyTwo', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyThree = getDummyX('dbui-dummy-twenty-three', 'DBUIDummyTwentyThree', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyFour = getDummyX('dbui-dummy-twenty-four', 'DBUIDummyTwentyFour', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyFive = getDummyX('dbui-dummy-twenty-five', 'DBUIDummyTwentyFive', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentySix = getDummyX('dbui-dummy-twenty-six', 'DBUIDummyTwentySix', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentySeven = getDummyX('dbui-dummy-twenty-seven', 'DBUIDummyTwentySeven', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyEight = getDummyX('dbui-dummy-twenty-eight', 'DBUIDummyTwentyEight', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyNine = getDummyX('dbui-dummy-twenty-nine', 'DBUIDummyTwentyNine', {
    dependentClasses: [DBUIDummyTwentyOne, DBUIDummyTwenty],
    dependentHTML: `
    <dbui-dummy-twenty-one>
      <dbui-dummy-twenty></dbui-dummy-twenty>
    </dbui-dummy-twenty-one>
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  const DBUIDummyThirty = getDummyX('dbui-dummy-thirty', 'DBUIDummyThirty', {
    dependentClasses: [
      DBUIDummyTwentyNine, DBUIDummyTwentyEight,
      DBUIDummyTwentySeven, DBUIDummyTwentySix, DBUIDummyTwentyFive, DBUIDummyTwentyFour
    ],
    dependentHTML: `
    <dbui-dummy-twenty-nine></dbui-dummy-twenty-nine>
    `,
    callbacks: { onConnectedCallback, onDisconnectedCallback, onPropertyChangedCallback }
  })(contentWindow);

  return {
    DBUIDummyThirty, DBUIDummyTwentyThree, DBUIDummyTwentyTwo
  };
}


xdescribe('DBUIWebComponentBase', () => {
  describe('when loaded', () => {
    it('does stuff', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy-thirty></dbui-dummy-thirty>
        `,
        onLoad: ({ contentWindow, iframe, html }) => {
          console.log('test', { html });
          const {
            DBUIDummyThirty, DBUIDummySeventeen
          } = getDbuiXClasses(contentWindow, {
            onConnectedCallback: (self) => {
              console.log('test onConnectedCallback', self.tagName, (self.shadowDomDbuiAncestor || {}).constructor.name || '??');
            },
            onDisconnectedCallback: (self) => {
              console.log('test onDisconnectedCallback', self.tagName, self.shadowDomDbuiAncestor);
            },
            onPropertyChangedCallback(self, name, oldValue, newValue) {
              console.log('test onPropertyChangedCallback', self.tagName, { name, oldValue, newValue });
            }
          });

          const dummyThirty = contentWindow.document.querySelector('dbui-dummy-thirty');
          console.log('test dummyTwentyTwoOne.constructor', dummyThirty.constructor.name);


          contentWindow.customElements.whenDefined(DBUIDummyThirty.registrationName).then(() => {

            // twenty-one, eighteen, nineteen, twenty, twenty-nine, thirty

            const parent = dummyThirty.parentElement;
            dummyThirty.remove();
            const descendant = dummyThirty
              .shadowRoot.querySelector('dbui-dummy-twenty-nine')
              .shadowRoot.querySelector('dbui-dummy-twenty')
              .shadowRoot.querySelector('dbui-dummy-nineteen')
              .shadowRoot.querySelector('dbui-dummy-eighteen');
            console.log('descendant', descendant);
            const seventeen = document.createElement('dbui-dummy-seventeen');
            descendant.appendChild(seventeen);
            parent.appendChild(dummyThirty);
            // dummyThirty.remove();

            setTimeout(() => {
              iframe.remove();
              done();
            }, 55000);
          });

          DBUIDummyThirty.registerSelf();
        }
      });
    });
  });
});
