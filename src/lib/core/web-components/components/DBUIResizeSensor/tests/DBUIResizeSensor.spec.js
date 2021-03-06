import { expect } from 'chai';
import inIframe from '../../../../../../../testUtils/inIframe';
import getDBUIWebComponentRoot from '../../DBUIWebComponentRoot/DBUIWebComponentRoot';
import getDBUIResizeSensor from '../DBUIResizeSensor';
import dbuiWebComponentsSetUp from '../../../helpers/dbuiWebComponentsSetup';

const content = `oooooooooooooooooooo
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
      
      #wrapper-resize-sensor {
        margin-left: 200px;
        margin-top: 200px;
      }
      
      #dbui-resize-sensor {
        border: 1px solid black;
        box-sizing: border-box;
      }
      
      #wrapper-scrollable-content {
        display: inline-block;
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
      <dbui-web-component-root id="dbui-web-component-root">
        <div id="container">
          <div id="wrapper-resize-sensor">
            <dbui-resize-sensor id="dbui-resize-sensor">
              <div id="wrapper-scrollable-content">
                <pre id="scrollable-content" contenteditable="true">${content}</pre>
              </div>             
            </dbui-resize-sensor>
          </div>
        </div>
      </dbui-web-component-root>
      `,

      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIResizeSensor = getDBUIResizeSensor(contentWindow);
        dbuiWebComponentsSetUp(contentWindow)([{
          registrationName: DBUIResizeSensor.registrationName,
          componentStyle: `
          `
        }]);

        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          // const wrapperResizeSensor = contentWindow.document.querySelector('#wrapper-resize-sensor');
          const resizeSensor = contentWindow.document.querySelector('#dbui-resize-sensor');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');
          // const wrapperScrollableContent = contentWindow.document.querySelector('#wrapper-scrollable-content');

          console.log('initial size', resizeSensor.dimensionsAndCoordinates);
          resizeSensor.addEventListener('dbui-event-resize', (evt) => {
            console.log('test resize', evt.target.dimensionsAndCoordinates);
          });

          setTimeout(() => {
            console.log('+ few chars');
            scrollableContent.innerHTML += 'ooooo';
            setTimeout(() => {
              console.log('+ many chars');
              scrollableContent.innerHTML += 'oooooooooooooooooooooo';
              setTimeout(() => {
                console.log('- many chars');
                scrollableContent.innerText = `${content}ooooo`;
                setTimeout(() => {
                  console.log('- few chars');
                  scrollableContent.innerText = content;
                  setTimeout(() => {
                    console.log('- width');
                    scrollableContent.style.width = `${resizeSensor.offsetWidth - 1}px`;
                    setTimeout(() => {
                      console.log('- height');
                      scrollableContent.style.height = `${resizeSensor.offsetHeight - 1}px`;
                      setTimeout(() => {
                        console.log('+ width');
                        scrollableContent.style.width = `${resizeSensor.offsetWidth + 1}px`;
                        setTimeout(() => {
                          console.log('+ height');
                          scrollableContent.style.height = `${resizeSensor.offsetHeight + 1}px`;
                          setTimeout(() => {
                            scrollableContent.style.removeProperty('width');
                            scrollableContent.style.removeProperty('height');
                            // wrapperScrollableContent.style.height = '200px';
                            setTimeout(() => {
                              iframe.remove();
                              done();
                            }, 55000);
                          }, 100);
                        }, 100);
                      }, 100);
                    }, 100);
                  }, 100);
                }, 100);
              }, 100);
            }, 100);
          }, 100);
        });

        DBUIResizeSensor.registerSelf();
        DBUIRoot.registerSelf();
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
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="container">
            <dbui-resize-sensor id="dbui-resize-sensor">
              <pre id="scrollable-content" contenteditable="true">${content}</pre>
            </dbui-resize-sensor>
          </div>
        </dbui-web-component-root>
        `,

        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DBUIResizeSensor = getDBUIResizeSensor(contentWindow);
          dbuiWebComponentsSetUp(contentWindow)([{
            registrationName: DBUIResizeSensor.registrationName,
            componentStyle: `
            `
          }]);

          Promise.all([
            DBUIRoot.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {
            const resizeSensor = contentWindow.document.querySelector('#dbui-resize-sensor');
            const scrollableContent = contentWindow.document.querySelector('#scrollable-content');

            const { width: initialWidth, height: initialHeight } = resizeSensor.dimensionsAndCoordinates;

            function onContentExpand(evt) {
              const { width, height } = evt.target.dimensionsAndCoordinates;
              expect(width).to.be.above(initialWidth);
              expect(height).to.be.above(initialHeight);
              resizeSensor.removeEventListener('dbui-event-resize', onContentExpand);
              resizeSensor.addEventListener('dbui-event-resize', onContentShrink);
              setTimeout(() => {
                scrollableContent.innerHTML = 'oooooo2';
              }, 0);
            }

            function onContentShrink(evt) {
              const { width, height } = evt.target.dimensionsAndCoordinates;
              expect(width).to.be.below(initialWidth);
              expect(height).to.be.below(initialHeight);
              resizeSensor.removeEventListener('dbui-event-resize', onContentShrink);
              resizeSensor.addEventListener('dbui-event-resize', onResizeSensorExpand);
              setTimeout(() => {
                resizeSensor.style.width = '300px';
                resizeSensor.style.height = '300px';
              }, 0);
            }

            function onResizeSensorExpand(evt) {
              const { width, height } = evt.target.dimensionsAndCoordinates;
              expect(width).to.equal(300);
              expect(height).to.equal(300);
              resizeSensor.removeEventListener('dbui-event-resize', onResizeSensorExpand);
              resizeSensor.addEventListener('dbui-event-resize', onResizeSensorShrink);
              setTimeout(() => {
                resizeSensor.style.width = '299px';
                resizeSensor.style.height = '299px';
              }, 0);
            }

            function onResizeSensorShrink(evt) {
              const { width, height } = evt.target.dimensionsAndCoordinates;
              expect(width).to.equal(299);
              expect(height).to.equal(299);
              resizeSensor.removeEventListener('dbui-event-resize', onResizeSensorShrink);
              resizeSensor.remove();
              iframe.remove();
              done();
            }

            resizeSensor.addEventListener('dbui-event-ready', () => {
              resizeSensor.addEventListener('dbui-event-resize', onContentExpand);
              scrollableContent.innerHTML += 'oooooooooooooooooooooo1';
            });
          });

          DBUIResizeSensor.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });
});
