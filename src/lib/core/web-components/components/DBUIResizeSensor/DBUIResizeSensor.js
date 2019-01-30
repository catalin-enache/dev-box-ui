
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

const registrationName = 'dbui-resize-sensor';

const getResizeSensor = (self) => {
  if (self._resizeSensor) {
    return self._resizeSensor;
  }
  self._resizeSensor = self.shadowRoot.querySelector('#resize-sensor');
  return self._resizeSensor;
};

const dispatchResizeEvent = (self, { width, height }) => {
  const win = self.ownerDocument.defaultView;
  self.dispatchEvent(new win.CustomEvent('resize', {
    detail: { width, height }
  }));
};

export default function getDBUIResizeSensor(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    class DBUIResizeSensor extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            /*all: initial;*/
            display: inline-block;
            position: relative;
          }
          #resize-sensor {
            display: block;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
            border: none;
            padding: 0px;
            margin: 0px;
          }
          </style>
          <slot></slot>
          <iframe id="resize-sensor" src=""></iframe>
        `;
      }

      constructor() {
        super();
        this._resizeSensor = null;
        this._onResize = this._onResize.bind(this);
      }

      get dimensions() {
        const { height, width } = this.getBoundingClientRect();
        return { height: Math.round(height), width: Math.round(width) };
      }

      _onResize() {
        dispatchResizeEvent(this, this.dimensions);
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getResizeSensor(this).contentWindow.addEventListener('resize', this._onResize);
        this._onResize();
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getResizeSensor(this).contentWindow.removeEventListener('resize', this._onResize);
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIResizeSensor
      )
    );
  });
}

getDBUIResizeSensor.registrationName = registrationName;

