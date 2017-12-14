

import getDBUWebComponentBase from '../DBUWebComponentBase/DBUWebComponentBase';
import getDBUWebComponentDummy from '../DBUWebComponentDummy/DBUWebComponentDummy';
import ensureSingleRegistration from '../internals/ensureSingleRegistration';

const registrationName = 'dbu-web-component-dummy-parent';

export default function getDBUWebComponentDummyParent(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const { DBUWebComponentBase, defineCommonStaticMethods } = getDBUWebComponentBase(win);
    const DBUWebComponentDummy = getDBUWebComponentDummy(win);

    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
      :host {display: inline-block;}
      </style>
      <div>
        <div>
          <b>Dummy Parent shadow</b>
        </div>
        <div>
          <dbu-web-component-dummy><slot></slot></dbu-web-component-dummy>
        </div>
      </div>
    `;

    class DBUWebComponentDummyParent extends DBUWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      static get dependencies() {
        return [DBUWebComponentDummy];
      }

    }

    defineCommonStaticMethods(DBUWebComponentDummyParent);

    return DBUWebComponentDummyParent;
  });
}

getDBUWebComponentDummyParent.registrationName = registrationName;

