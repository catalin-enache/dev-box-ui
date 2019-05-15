import { expect } from 'chai';
import inIframe from '../../../../../../../testUtils/inIframe';
import getDBUISlider from '../DBUISlider';
import dbuiWebComponentsSetUp from '../../../helpers/dbuiWebComponentsSetup';
import getDBUIWebComponentRoot from '../../DBUIWebComponentRoot/DBUIWebComponentRoot';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../../internals/ensureSingleRegistration';

describe('DBUISlider', () => {
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      
      #wrapper-slider-one {
        position: absolute;
        top: 100px;
        width: 90%;
        height: 180px;
        border: 5px solid green;
      }
      
      #slider-one {
        width: 300px;
        height: 100%;
        
        /*
        --dbui-slider-inner-size: 30px;
        --dbui-slider-outer-padding: 3px;
        --dbui-slider-draggable-size: 20px;
        --dbui-slider-middle-border-radius: 10px;
        --dbui-slider-outer-border-radius: 10px;
        --dbui-slider-draggable-border-radius: 10px;
        --dbui-slider-draggable-color: rgba(0, 0, 255, 0.2);
        */
      }
      
      ::-webkit-scrollbar {
          width: 30px;  /* remove scrollbar space */
          height: 30px;  /* remove scrollbar space */
          background: blue;  /* optional: just make scrollbar invisible */
      }
      /* optional: show position indicator in red */
      /*
      ::-webkit-scrollbar-thumb {
          background: #FF0000;
      }
      */

      `,
      bodyHTML: `
      <dbui-web-component-root id="dbui-web-component-root">
        <div id="container">
          <div id="locale-provider" dir="rtl"></div>
          <div id="wrapper-slider-one">
            <dbui-slider
            id="slider-one"
            sync-locale-with="#locale-provider"
            percent="0.9"
            steps="0"
            step="1"
            dir="ltr"
            vertical
            debug-show-value
            ratio="0.5"
            capture-arrow-keys
            percent-precision="6"
            ></dbui-slider>
          </div>
        </div>
      </dbui-web-component-root>
      `,

      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUISlider = getDBUISlider(contentWindow);
        dbuiWebComponentsSetUp(contentWindow)([{
          registrationName: DBUISlider.registrationName,
          componentStyle: `
          :host([dbui-dir=ltr]) #draggable {
            color: red;
          }
          
          :host([dbui-dir=rtl]) #draggable {
            color: blue;
          }
          `
        }]);

        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          const wrapperSliderOne = contentWindow.document.querySelector('#wrapper-slider-one');
          const sliderOne = contentWindow.document.querySelector('#slider-one');

          sliderOne.addEventListener('dbui-event-slidemove', (evt) => {
            console.log('test slidemove', evt);
          });

          sliderOne.remove();
          wrapperSliderOne.appendChild(sliderOne);

          setTimeout(() => {
            wrapperSliderOne.style.height = '93px';
            // sliderOne.percent = 0.5;
            setTimeout(() => {
              iframe.remove();
              done();
            }, 55000);
          }, 1000);
        });

        DBUISlider.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });
});
