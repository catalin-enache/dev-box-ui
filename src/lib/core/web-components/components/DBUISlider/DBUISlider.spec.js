import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUISlider from './DBUISlider';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

describe('DBUISlider', () => {
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      
      #wrapper-slider-one {
        position: absolute;
        width: 500px;
        height: 180px;
        border: 5px solid green;
      }
      
      #slider-one {
        width: 80%;
      }

      `,
      bodyHTML: `
      <div id="container">
        <div id="wrapper-slider-one">
          <dbui-slider id="slider-one"></dbui-slider>
        </div>
      </div>
      
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUISlider = getDBUISlider(contentWindow);


        Promise.all([
          DBUISlider.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          setTimeout(() => {
            setTimeout(() => {
              iframe.remove();
              done();
            }, 2000);
          }, 55000);
        });

        DBUISlider.registerSelf();
      }
    });
  });
});
