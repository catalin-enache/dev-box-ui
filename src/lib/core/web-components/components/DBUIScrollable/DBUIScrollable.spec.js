import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIScrollable from './DBUIScrollable';
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
`

describe('DBUIScrollable', () => {
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body {
        background-color: bisque;
      }
      #dbui-scrollable-one {
        width: 200px;
        height: 200px;
        background-color: rgba(0, 0, 255, 0.2);
        border: 0px solid black;
        box-sizing: border-box;
        
        /*margin-top: 10px;
        margin-left: 10px;*/
        /* --dbui-scrollable-vertical-slider-thickness: 20px; */
      }
      
      #scrollable-content {
        /*width: 400px;
        height: 500px;*/
        border: 2px solid orange;
      }

      `,
      bodyHTML: `
      <div id="container">
        <div id="locale-provider" dir="ltr"></div>
        <div id="wrapper-scrollable-one">
          <dbui-scrollable id="dbui-scrollable-one" sync-locale-with="#locale-provider">
            <div id="scrollable-content" dir="ltr">${'content'}</div>
            <input type="text" />
          </dbui-scrollable>
        </div>
      </div>

      `,

      onLoad: ({ contentWindow, iframe }) => {
        const DBUIScrollable = getDBUIScrollable(contentWindow);
        dbuiWebComponentsSetUp(contentWindow)([{
          registrationName: DBUIScrollable.registrationName,
          componentStyle: `
          `
        }]);

        Promise.all([
          DBUIScrollable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          const wrapperScrollableOne = contentWindow.document.querySelector('#wrapper-scrollable-one');
          const scrollableOne = contentWindow.document.querySelector('#dbui-scrollable-one');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');
          const dynamicContent = contentWindow.document.createElement('div');
          dynamicContent.style.cssText = `
          /*width: 201px;
          height: 201px;*/
          background-color: gray;
          border: 1px solid red;
          `;
          dynamicContent.innerText = '?';
          dynamicContent.tabIndex = 0;
          dynamicContent.setAttribute('contenteditable', 'true');
          dynamicContent.addEventListener('mousedown', (evt) => {
            console.log('dynamicContent mousedown', evt);
            dynamicContent.focus();
          });

          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);

          setTimeout(() => {
            scrollableContent.appendChild(dynamicContent);
            dynamicContent.focus();
            setTimeout(() => {
              // dynamicContent.remove();
              setTimeout(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 55000);
              }, 0);
            }, 3000);
          }, 3000);
        });

        DBUIScrollable.registerSelf();
      }
    });
  });
});
