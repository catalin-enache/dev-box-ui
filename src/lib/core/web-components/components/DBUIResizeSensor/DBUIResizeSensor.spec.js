import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIResizeSensor from './DBUIResizeSensor';
import dbuiWebComponentsSetUp from '../../helpers/dbuiWebComponentsSetup';
import onScreenConsole from '../../../utils/onScreenConsole';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';


const content = `
<p>9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa9</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa9</p>
`;

describe('DBUIResizeSensor', () => {
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body {
        background-color: bisque;
      }
      #dbui-resize-sensor {
        /*background-color: rgba(0, 0, 255, 0.2);*/
        border: 1px solid black;
        box-sizing: border-box;
      }
      
      #scrollable-content {
        /*width: 400px;
        height: 500px;*/
        border: 0px solid orange;
      }

      `,
      bodyHTML: `
      <div id="container">
        <div id="locale-provider" dir="ltr"></div>
        <div id="wrapper-resize-sensor">
          <dbui-resize-sensor id="dbui-resize-sensor" sync-locale-with="#locale-provider">
            <div id="scrollable-content" dir="ltr">${content}</div>
            <input type="text" />
          </dbui-resize-sensor>
        </div>
      </div>

      `,

      onLoad: ({ contentWindow, iframe }) => {
        const DBUIResizeSensor = getDBUIResizeSensor(contentWindow);
        dbuiWebComponentsSetUp(contentWindow)([{
          registrationName: DBUIResizeSensor.registrationName,
          componentStyle: `
          `
        }]);

        Promise.all([
          DBUIResizeSensor.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          const wrapperResizeSensor = contentWindow.document.querySelector('#wrapper-resize-sensor');
          const resizeSensor = contentWindow.document.querySelector('#dbui-resize-sensor');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');

          resizeSensor.addEventListener('resize', (evt) => {
            console.log('resize', evt.detail);
          });

          const dynamicContent = contentWindow.document.createElement('div');
          dynamicContent.style.cssText = `
          background-color: rgba(0, 0, 0, 0.2);
          border: 0px solid red;
          `;
          dynamicContent.innerText = `kkkkkkkkkkkkkkkkkkkkkkkk
          
          
          
          
          
          
          
          
          `;
          dynamicContent.tabIndex = 0;
          dynamicContent.setAttribute('contenteditable', 'true');
          scrollableContent.appendChild(dynamicContent);

          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);

          setTimeout(() => {
            resizeSensor.style.width = '350px';
            resizeSensor.style.height = '350px';
            setTimeout(() => {
              // dynamicContent.remove();
              setTimeout(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 55000);
              }, 0);
            }, 3000);
          }, 1000);
        });

        DBUIResizeSensor.registerSelf();
      }
    });
  });
});
