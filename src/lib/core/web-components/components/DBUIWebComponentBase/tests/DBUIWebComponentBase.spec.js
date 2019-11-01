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
    style = 'host: { display: block; } div { padding-left: 10px; }',
    dependentClasses = [], dependentHTML = '',
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

        static get sharedStyleSheet() {
          return '* { color: green; }';
        }

        static get observedAttributes() {
          // web components standard API
          return [...super.observedAttributes, 'dbui-dir'];
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

        onAttributeChangedCallback(name, oldValue, newValue) {
          super.onAttributeChangedCallback(name, oldValue, newValue);
          if (name === 'dir') {
            this.shadowRoot.querySelector('b').innerHTML += `(${newValue})`;
          }
          callbacks.onAttributeChangedCallback &&
            callbacks.onAttributeChangedCallback(this, name, oldValue, newValue);
        }
      };

      return klass;
    });
  }
  return factory;
}

function getDbuiXClasses(contentWindow, { onConnectedCallback, onAttributeChangedCallback }) {
  const DBUIDummyOne = getDummyX('dbui-dummy-one', 'DBUIDummyOne', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwo = getDummyX('dbui-dummy-two', 'DBUIDummyTwo', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyThree = getDummyX('dbui-dummy-three', 'DBUIDummyThree', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyFour = getDummyX('dbui-dummy-four', 'DBUIDummyFour', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyFive = getDummyX('dbui-dummy-five', 'DBUIDummyFive', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummySix = getDummyX('dbui-dummy-six', 'DBUIDummySix', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummySeven = getDummyX('dbui-dummy-seven', 'DBUIDummySeven', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyEight = getDummyX('dbui-dummy-eight', 'DBUIDummyEight', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyNine = getDummyX('dbui-dummy-nine', 'DBUIDummyNine', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTen = getDummyX('dbui-dummy-ten', 'DBUIDummyTen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyEleven = getDummyX('dbui-dummy-eleven', 'DBUIDummyEleven', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwelve = getDummyX('dbui-dummy-twelve', 'DBUIDummyTwelve', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyThirteen = getDummyX('dbui-dummy-thirteen', 'DBUIDummyThirteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyFourteen = getDummyX('dbui-dummy-fourteen', 'DBUIDummyFourteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyFifteen = getDummyX('dbui-dummy-fifteen', 'DBUIDummyFifteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummySixteen = getDummyX('dbui-dummy-sixteen', 'DBUIDummySixteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummySeventeen = getDummyX('dbui-dummy-seventeen', 'DBUIDummySeventeen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyEighteen = getDummyX('dbui-dummy-eighteen', 'DBUIDummyEighteen', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyNineteen = getDummyX('dbui-dummy-nineteen', 'DBUIDummyNineteen', {
    dependentClasses: [DBUIDummyEighteen],
    dependentHTML: `
    <dbui-dummy-eighteen></dbui-dummy-eighteen>
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwenty = getDummyX('dbui-dummy-twenty', 'DBUIDummyTwenty', {
    dependentClasses: [DBUIDummyNineteen],
    dependentHTML: `
    <dbui-dummy-nineteen></dbui-dummy-nineteen>
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyOne = getDummyX('dbui-dummy-twenty-one', 'DBUIDummyTwenty-one', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyTwo = getDummyX('dbui-dummy-twenty-two', 'DBUIDummyTwentyTwo', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyThree = getDummyX('dbui-dummy-twenty-three', 'DBUIDummyTwentyThree', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyFour = getDummyX('dbui-dummy-twenty-four', 'DBUIDummyTwentyFour', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyFive = getDummyX('dbui-dummy-twenty-five', 'DBUIDummyTwentyFive', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentySix = getDummyX('dbui-dummy-twenty-six', 'DBUIDummyTwentySix', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentySeven = getDummyX('dbui-dummy-twenty-seven', 'DBUIDummyTwentySeven', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyEight = getDummyX('dbui-dummy-twenty-eight', 'DBUIDummyTwentyEight', {
    dependentClasses: [],
    dependentHTML: `
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyTwentyNine = getDummyX('dbui-dummy-twenty-nine', 'DBUIDummyTwentyNine', {
    dependentClasses: [DBUIDummyTwentyOne, DBUIDummyTwenty],
    dependentHTML: `
    <dbui-dummy-twenty-one>
      <dbui-dummy-twenty></dbui-dummy-twenty>
    </dbui-dummy-twenty-one>
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  const DBUIDummyThirty = getDummyX('dbui-dummy-thirty', 'DBUIDummyThirty', {
    dependentClasses: [
      DBUIDummyTwentyNine, DBUIDummyTwentyEight,
      DBUIDummyTwentySeven, DBUIDummyTwentySix, DBUIDummyTwentyFive, DBUIDummyTwentyFour
    ],
    dependentHTML: `
    <dbui-dummy-twenty-nine></dbui-dummy-twenty-nine>
    <dbui-dummy-twenty-eight></dbui-dummy-twenty-eight>
    <dbui-dummy-twenty-seven>
      <dbui-dummy-twenty-six></dbui-dummy-twenty-six>
      <dbui-dummy-twenty-five>
        <dbui-dummy-twenty-four>
          <slot></slot>
        </dbui-dummy-twenty-four>
      </dbui-dummy-twenty-five>
    </dbui-dummy-twenty-seven>
    `,
    callbacks: { onConnectedCallback, onAttributeChangedCallback }
  })(contentWindow);

  return {
    DBUIDummyThirty, DBUIDummyTwentyThree, DBUIDummyTwentyTwo
  };
}


describe('DBUIWebComponentBase', () => {
  describe('when loaded', () => {
    it.only('does stuff', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy-thirty dir="aaa">
          <dbui-dummy-twenty-two></dbui-dummy-twenty-two>
          <dbui-dummy-twenty-three></dbui-dummy-twenty-three>
          <dbui-dummy-thirty dir="bbb"></dbui-dummy-thirty>
        </dbui-dummy-thirty>
        `,
        onLoad: ({ contentWindow, iframe, html }) => {
          console.log({ html });
          const {
            DBUIDummyThirty, DBUIDummyTwentyThree, DBUIDummyTwentyTwo
          } = getDbuiXClasses(contentWindow, {
            onConnectedCallback: (self) => {
              console.log(self.tagName);
            },
            onAttributeChangedCallback(self, name, oldValue, newValue) {
              console.log(self.tagName, name, oldValue, newValue);
            }
          });


          contentWindow.customElements.whenDefined(DBUIDummyThirty.registrationName).then(() => {

            const dummyThirty = contentWindow.document.querySelector(DBUIDummyThirty.registrationName);
            dummyThirty.remove();
            console.log('---------------------- replacing body innerHTML -------------------');
            contentWindow.document.body.innerHTML = `
              <dbui-dummy-thirty dir="aaa">
                <dbui-dummy-twenty-two></dbui-dummy-twenty-two>
                <dbui-dummy-twenty-three></dbui-dummy-twenty-three>
                <dbui-dummy-thirty dir="bbb"></dbui-dummy-thirty>
              </dbui-dummy-thirty>`;

            setTimeout(() => {
              iframe.remove();
              done();
            }, 55000);
          });

          DBUIDummyTwentyTwo.registerSelf();
          DBUIDummyTwentyThree.registerSelf();
          DBUIDummyThirty.registerSelf();
        }
      });
    });
  });
});
