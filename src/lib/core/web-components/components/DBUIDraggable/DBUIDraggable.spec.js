import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIDraggable from './DBUIDraggable';

describe('DBUIDraggable', () => {
  it.only('behaves as expected', (done) => {
    inIframe({
      headStyle: `
      p {
        width: 300px;
        height: 100px;
      }
      
      #container {
        position: relative;
      }
      
      #wrapper-draggable-one, #wrapper-draggable-two, #wrapper-draggable-three {
        position: absolute;
        width: 500px;
        height: 180px;
      }
      
      #wrapper-draggable-one { top: 0px; }
      
      #wrapper-draggable-two { top: 200px; }
      
      #wrapper-draggable-three { top: 400px; }
      
      
      #wrapper-draggable-one, #wrapper-draggable-two, #wrapper-draggable-three {
        border: 1px solid green;
      }
      
      dbui-draggable {
        border: 1px solid #ddd;
      }
      `,
      bodyHTML: `
      <span id="locale-provider" dir="rtl"></span>
      <div id="container">

        <div id="wrapper-draggable-one" dir="rtl">
          <dbui-draggable id="draggable-one" drag-target="#wrapper-draggable-one" translate-x="10" translate-y="10">
            <p id="draggable-two-content">draggable content 1</p>
          </dbui-draggable>
        </div>
        
        <div id="wrapper-draggable-two">
          <dbui-draggable id="draggable-two" sync-locale-with="#locale-provider">
            <p id="draggable-two-content">draggable content 2</p>
          </dbui-draggable>
        </div>
        
        <div id="wrapper-draggable-three">
          <dbui-draggable id="draggable-three" dir="rtl">
            <p id="draggable-three-content">draggable content 3</p>
          </dbui-draggable>
        </div>
        
      </div>
      
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);

        const container = contentWindow.document.querySelector('#container');

        const wrapperDraggableOne = contentWindow.document.querySelector('#wrapper-draggable-one');
        const wrapperDraggableTwo = contentWindow.document.querySelector('#wrapper-draggable-two');
        const wrapperDraggableThree = contentWindow.document.querySelector('#wrapper-draggable-three');

        const draggableOne = contentWindow.document.querySelector('#draggable-one');
        const draggableTwo = contentWindow.document.querySelector('#draggable-two');
        const draggableThree = contentWindow.document.querySelector('#draggable-three');

        draggableOne.addEventListener('translate', (evt) => {
          const {
            translateX,
            translateY
          } = evt.detail;
          // wrapperDraggableTwo.style.transform = `translate(${translateX}px,${translateY}px)`;
        });

        draggableTwo.applyCorrection = ({ translateX, translateY, width, height }) => {
          const maxX = parseInt(contentWindow.getComputedStyle(wrapperDraggableTwo, null).width, 10) - width;
          const maxY = parseInt(contentWindow.getComputedStyle(wrapperDraggableTwo, null).height, 10) - height;
          const revisedTranslateX = Math.max(0, Math.min(translateX, maxX));
          const revisedTranslateY = Math.max(0, Math.min(translateY, maxY));
          return { translateX: revisedTranslateX, translateY: revisedTranslateY };
        };

        draggableTwo.addEventListener('translate', (evt) => {
          const {
            translateX,
            translateY
          } = evt.detail;
          // draggableThree.style.transform = `translate(${translateX}px,${translateY}px)`;
          // draggableThree.setAttribute('translate-x', translateX);
          // draggableThree.translateY = translateY;
          // draggableTwo._targetToDrag.style.transform = `translate(${translateX}px,${translateY}px)`;
        });

        draggableThree.addEventListener('translate', (evt) => {
          const {
            translateX,
            translateY
          } = evt.detail;
          // draggableThree.style.transform = `translate(${translateX}px,${translateY}px)`;
          // draggableThree.setAttribute('translate-x', translateX);
          // draggableThree.translateY = translateY;
        });

        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          setTimeout(() => {
            // draggableOne.remove();
            // draggableOne.dragTarget = '#wrapper-draggable-three';
          }, 2000);

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
