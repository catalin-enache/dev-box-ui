'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIDummyParent;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _DBUIDummy = require('../DBUIDummy/DBUIDummy');

var _DBUIDummy2 = _interopRequireDefault(_DBUIDummy);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-dummy-parent';

function getDBUIDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);
    const DBUIDummy = (0, _DBUIDummy2.default)(win);

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

    return Registerable(defineCommonStaticMethods(DBUIDummyParent));
  });
}

getDBUIDummyParent.registrationName = registrationName;