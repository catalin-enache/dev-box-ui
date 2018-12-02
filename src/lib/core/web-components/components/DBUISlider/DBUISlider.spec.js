import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUISlider from './DBUISlider';
import dbuiWebComponentsSetUp from '../../helpers/dbuiWebComponentsSetup';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

describe('DBUISlider', () => {
  it.only('behaves as expected - live testing', (done) => {
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
        width: 100px;
        height: 90%;
        
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

      `,
      bodyHTML: `
      <div id="container">
        <div id="locale-provider" dir="rtl"></div>
        <div id="wrapper-slider-one">
          <dbui-slider id="slider-one" sync-locale-with="#locale-provider" percent="0.8" steps="3" dir="rtl" verticalL show-value></dbui-slider>
        </div>
      </div>
      
      `,
      onLoad: ({ contentWindow, iframe }) => {
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
          DBUISlider.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          const wrapperSliderOne = contentWindow.document.querySelector('#wrapper-slider-one');
          const sliderOne = contentWindow.document.querySelector('#slider-one');
          sliderOne.remove();
          wrapperSliderOne.appendChild(sliderOne);

          setTimeout(() => {
            setTimeout(() => {
              iframe.remove();
              done();
            }, 55000);
          }, 0);
        });

        DBUISlider.registerSelf();
      }
    });
  });
});
