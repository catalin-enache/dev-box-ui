import { expect } from 'chai';
import inIframe from '../../../../../../../testUtils/inIframe';
import { getDummyX } from '../../../../../../../testUtils/dbuiClassFactory';
import ContextProviderAware from '../ContextProvider';

describe.only('ContextProvider', () => {
  it('provides context for descendants', (done) => {
    inIframe({
      bodyHTML: `
      <dbui-cp num="1" id="cp1">
        <div>
          <dbui-dummy-one id="d1">
            <div>
              <dbui-dummy-one id="d2">
                <dbui-cp num="2" id="cp2">
                  <div>
                    <dbui-dummy-one id="d3">
                      <div>
                        <dbui-dummy-one id="d4"></dbui-dummy-one>
                      </div>
                    </dbui-dummy-one>
                  </div>
                </dbui-cp>
              </dbui-dummy-one>
            </div>
          </dbui-dummy-one>
        </div>
      </dbui-cp>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUICP = getDummyX('dbui-cp', 'DBUICP', {
          dependentHTML: '<span id="details"></span>',
          callbacks: {
            onConnectedCallback: (self) => {
              self.shadowRoot.querySelector('#details').innerHTML =
                `num: ${self.num}`;
            },
            onPropertyChangedCallback: (self) => {
              self.shadowRoot.querySelector('#details').innerHTML =
                `num: ${self.num}`;
            }
          }
        })(contentWindow);

        const ContextProviderElement = ContextProviderAware({
          // descendantsFilter: () => true,
          // onlyDeclaredProperties: false,
          win: contentWindow,
          properties: {
            num: { type: Number, attribute: true, defaultValue: 0 },
            str: { type: String, attribute: true, defaultValue: 'x' },
            provider: { type: DBUICP, attribute: false, defaultValue: (self) => self }
          }
        })(DBUICP);

        const DBUIDummyOne = getDummyX('dbui-dummy-one', 'DBUIDummyOne', {
          properties: {
            num: { type: Number, attribute: true, defaultValue: 0 },
            provider: { type: DBUICP, attribute: false, defaultValue: null }
          },
          dependentHTML: '<span id="details"></span>',
          callbacks: {
            onConnectedCallback: (self) => {
              self.shadowRoot.querySelector('#details').innerHTML =
                `num: ${self.num}`;
            },
            onPropertyChangedCallback: (self) => {
              self.shadowRoot.querySelector('#details').innerHTML =
                `num: ${self.num}`;
            }
          }
        })(contentWindow);

        const dbuiCP = contentWindow.document.querySelector('dbui-cp');
        // const dummyOne = contentWindow.document.querySelector('dbui-dummy-one');

        contentWindow.customElements.whenDefined(ContextProviderElement.registrationName).then(() => {

          setTimeout(() => {
            iframe.remove();
            done();
          }, 55000);
        });

        DBUIDummyOne.registerSelf();
        ContextProviderElement.registerSelf();

        setTimeout(() => {
          // DBUIDummyOne.registerSelf();
          dbuiCP.appendChild(contentWindow.document.createElement('dbui-dummy-one'));

          setTimeout(() => {
            dbuiCP.setAttribute('num', '3');
            // dbuiCP.num = 2;
          }, 1000);

        }, 1000);
      }
    });
  });
});
