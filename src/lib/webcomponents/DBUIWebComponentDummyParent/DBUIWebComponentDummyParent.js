

import getDBUIWebComponentBase from '../DBUIWebComponentBase/DBUIWebComponentBase';
import getDBUIWebComponentDummy from '../DBUIWebComponentDummy/DBUIWebComponentDummy';
import ensureSingleRegistration from '../internals/ensureSingleRegistration';

const registrationName = 'dbui-web-component-dummy-parent';

export default function getDBUIWebComponentDummyParent(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentBase(win);
    const DBUIWebComponentDummy = getDBUIWebComponentDummy(win);

    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
      :host {
        display: inline-block;
        width: 100%;
        max-width: 400px;
      }
      </style>
      <div>
        <div>
          <b>Dummy Parent shadow</b>
        </div>
        <div>
          <dbui-web-component-dummy><slot></slot></dbui-web-component-dummy>
        </div>
      </div>
    `;

    class DBUIWebComponentDummyParent extends DBUIWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      static get dependencies() {
        return [DBUIWebComponentDummy];
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIWebComponentDummyParent
      )
    );
  });
}

getDBUIWebComponentDummyParent.registrationName = registrationName;

