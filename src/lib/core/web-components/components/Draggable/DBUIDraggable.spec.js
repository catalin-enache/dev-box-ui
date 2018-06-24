import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIDraggable from './DBUIDraggable';

describe('DBUIDraggable', () => {
  it.only('behaves as expected', (done) => {
    inIframe({
      headStyle: '',
      bodyHTML: `
      <div id="container">
        <dbui-draggable id="draggable-one" style="top: 0px">
          <p id="draggable-two-content" style="width: 300px; height: 100px;">draggable content 1</p>
        </dbui-draggable>
        <dbui-draggable id="draggable-two" style="top: 150px">
          <p id="draggable-two-content" style="width: 300px; height: 100px;">draggable content 2</p>
        </dbui-draggable>
        <dbui-draggable id="draggable-three" style="top: 300px">
          <p id="draggable-three-content" style="width: 300px; height: 100px;">draggable content 3</p>
        </dbui-draggable>
      </div>
      
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);

        const container = contentWindow.document.querySelector('#container');
        const draggable = contentWindow.document.querySelector('#draggable-one');

        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          setTimeout(() => {
            iframe.remove();
            done();
          }, 55000);
        });

        DBUIDraggable.registerSelf();
      }
    });
  });
});
