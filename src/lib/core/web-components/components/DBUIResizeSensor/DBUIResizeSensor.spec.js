import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIResizeSensor from './DBUIResizeSensor';
import dbuiWebComponentsSetUp from '../../helpers/dbuiWebComponentsSetup';

const content = `
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
`;

describe('DBUIResizeSensor', () => {
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body {
        background-color: bisque;
      }
      
      #dbui-resize-sensor {
        border: 1px solid black;
        box-sizing: border-box;
      }
      
      #scrollable-content {
        margin: 0;
        padding: 0;
        font-size: 10px;
        line-height: 10px;
        outline: none;
      }
      `,
      bodyHTML: `
      <div id="container">
        <div id="wrapper-resize-sensor">
          <dbui-resize-sensor id="dbui-resize-sensor">
            <pre id="scrollable-content" contenteditable="true">${content}</pre>
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
          // const wrapperResizeSensor = contentWindow.document.querySelector('#wrapper-resize-sensor');
          const resizeSensor = contentWindow.document.querySelector('#dbui-resize-sensor');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');

          console.log('initial size', resizeSensor.dimensionsAndCoordinates);
          resizeSensor.addEventListener('resize', (evt) => {
            console.log('test resize', evt.target.dimensionsAndCoordinates);
          });

          setTimeout(() => {
            scrollableContent.innerHTML += 'ooooo';
            setTimeout(() => {
              scrollableContent.innerHTML += 'oooooooooooooooooooooo';
              setTimeout(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 55000);
              }, 0);
            }, 100);
          }, 0);
        });

        DBUIResizeSensor.registerSelf();
      }
    });
  });
  describe('when inner content changes or resizeSensor dimension is updated via CSS', () => {
    it('dispatches resize event', (done) => {
      inIframe({
        headStyle: `
        body {
          background-color: bisque;
        }
        
        #dbui-resize-sensor {
          border: 1px solid black;
          box-sizing: border-box;
        }
        
        #scrollable-content {
          margin: 0;
          padding: 0;
          font-size: 10px;
          line-height: 10px;
          outline: none;
        }
        `,
        bodyHTML: `
        <div id="container">
          <dbui-resize-sensor id="dbui-resize-sensor">
            <pre id="scrollable-content" contenteditable="true">${content}</pre>
          </dbui-resize-sensor>
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
            const resizeSensor = contentWindow.document.querySelector('#dbui-resize-sensor');
            const scrollableContent = contentWindow.document.querySelector('#scrollable-content');

            const { width: initialWidth, height: initialHeight } = resizeSensor.dimensionsAndCoordinates;

            function onContentExpand(evt) {
              const { width, height } = evt.target.dimensionsAndCoordinates;
              expect(width).to.be.above(initialWidth);
              expect(height).to.be.above(initialHeight);
              resizeSensor.removeEventListener('resize', onContentExpand);
              resizeSensor.addEventListener('resize', onContentShrink);
              setTimeout(() => {
                scrollableContent.innerHTML = 'oooooo2';
              }, 0);
            }

            function onContentShrink(evt) {
              const { width, height } = evt.target.dimensionsAndCoordinates;
              expect(width).to.be.below(initialWidth);
              expect(height).to.be.below(initialHeight);
              resizeSensor.removeEventListener('resize', onContentShrink);
              resizeSensor.addEventListener('resize', onResizeSensorExpand);
              setTimeout(() => {
                resizeSensor.style.width = '300px';
                resizeSensor.style.height = '300px';
              }, 0);
            }

            function onResizeSensorExpand(evt) {
              const { width, height } = evt.target.dimensionsAndCoordinates;
              expect(width).to.equal(300);
              expect(height).to.equal(300);
              resizeSensor.removeEventListener('resize', onResizeSensorExpand);
              resizeSensor.addEventListener('resize', onResizeSensorShrink);
              setTimeout(() => {
                resizeSensor.style.width = '299px';
                resizeSensor.style.height = '299px';
              }, 0);
            }

            function onResizeSensorShrink(evt) {
              const { width, height } = evt.target.dimensionsAndCoordinates;
              expect(width).to.equal(299);
              expect(height).to.equal(299);
              resizeSensor.removeEventListener('resize', onResizeSensorShrink);
              resizeSensor.remove();
              iframe.remove();
              done();
            }

            resizeSensor.addEventListener('resize', onContentExpand);

            setTimeout(() => {
              scrollableContent.innerHTML += 'oooooooooooooooooooooo1';
            });
          });

          DBUIResizeSensor.registerSelf();
        }
      });
    });
  });
});
