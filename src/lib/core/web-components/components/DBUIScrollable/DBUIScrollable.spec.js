import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIScrollable from './DBUIScrollable';
import dbuiWebComponentsSetUp from '../../helpers/dbuiWebComponentsSetup';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

/*
<p>9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa9</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa9</p>
*/

describe('DBUIScrollable', () => {
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      #dbui-scrollable-one {
        width: 200px;
        height: 200px;
        background-color: rgba(0, 0, 0, 0.2);
        border: 10px solid black;
        box-sizing: border-box;
        
        /*margin-top: 10px;
        margin-left: 10px;*/
      }
      
      #scrollable-content {
        /*width: 400px;*/
        /*height: 500px;*/
        /*border: 0px solid orange;*/
      }

      `,
      bodyHTML: `
      <div id="container">
        <div id="locale-provider" dir="rtl"></div>
        <div id="wrapper-scrollable-one">
          <dbui-scrollable id="dbui-scrollable-one" sync-locale-with="#locale-provider">
            <div id="scrollable-content" dir="rtl">
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
            </div>
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
          const dynamicContent = document.createElement('div');
          dynamicContent.style.cssText = `
          width: 500px;
          height: 500px;
          background-color: gray;
          border: 8px solid red;
          `;
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);

          setTimeout(() => {
            // scrollableContent.appendChild(dynamicContent);
            setTimeout(() => {
              // dynamicContent.remove();
              setTimeout(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 55000);
              }, 0);
            }, 1000);
          }, 1000);
        });

        DBUIScrollable.registerSelf();
      }
    });
  });
});
