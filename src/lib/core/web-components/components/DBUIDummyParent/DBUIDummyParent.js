

import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import getDBUIDummy from '../DBUIDummy/DBUIDummy';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

const registrationName = 'dbui-dummy-parent';

export default function getDBUIDummyParent(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);
    const DBUIDummy = getDBUIDummy(win);

    class DBUIDummyParent extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
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
              <dbui-dummy><slot></slot></dbui-dummy>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [DBUIDummy];
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIDummyParent
      )
    );
  });
}

getDBUIDummyParent.registrationName = registrationName;

