
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIDraggable from '../DBUIDraggable/DBUIDraggable';

const DRAGGABLE_ID = 'draggable';

const registrationName = 'dbui-slider';

/*
TODO:
*/

export default function getDBUISlider(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIDraggable = getDBUIDraggable(win);

    class DBUISlider extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            all: initial;
            cursor: pointer;
            touch-action: none;
            display: inline-block;
            width: 100%;
            height: 80px;
          }
          
          :host([dbui-dir=ltr]) {
            /* pass */
          }
          
          :host([dbui-dir=rtl]) {
            /* pass */
          }
          
          #wrapper-outer {
            width: 100%;
            /*height: 100%;*/
            padding: 5px;
            background-color: rgba(255, 0, 0, 0.2);
          }
          
          #wrapper-middle {
            position: relative;
            width: 100%;
            /*height: 100%;*/
            background-color: rgba(0, 255, 0, 0.2);
            border-radius: 0px;
          }
          
          #inner {
            position: absolute;
            border: 0px solid black;
            top: 50%;
            transform: translate(0px, -50%);
            left: 15px;
            right: 15px;
            
            height: 1px;
            box-sizing: border-box;
            background-color: rgba(0, 0, 255, 0.2);
          }
          
          #${DRAGGABLE_ID} {
            width: 30px;
            height: 30px;
            border-radius: 0px;
            background-color: rgba(0, 0, 0, 0.2);
          }
          
          </style>
          <div id="wrapper-outer">
            <div id="wrapper-middle">
              <div id="inner"></div>
              <dbui-draggable
                id="${DRAGGABLE_ID}"
                constraint='boundingClientRectOf({ "selector": "parent", "stepsX": 0, "stepsY": 0 })'
              ></dbui-draggable>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIDraggable];
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade];
      }

      static get observedAttributes() {
        return [...super.observedAttributes];
      }

      constructor() {
        super();
        this._onDraggableMove = this._onDraggableMove.bind(this);
      }

      _onDraggableMove(evt) {
        console.log(evt.detail);
      }

      _registerChild(child) {
        super._registerChild(child);
        // console.log('DBUISlider child registered', this.shadowRoot.querySelector(`#${DRAGGABLE_ID}`));
        if (child.id === DRAGGABLE_ID) {
          child.addEventListener('translate', this._onDraggableMove);
        }
      }

      onConnectedCallback() {
        console.log('DBUISlider onConnectedCallback', 'this.shadowRoot.querySelector(`#${DRAGGABLE_ID}`)');
        // this.querySelector('dbui-draggable').addEventListener('translate', this._onDraggableMove);
      }

      onDisconnectedCallback() {
        this.querySelector('dbui-draggable').removeEventListener('translate', this._onDraggableMove);
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUISlider
      )
    );
  });
}

getDBUISlider.registrationName = registrationName;

