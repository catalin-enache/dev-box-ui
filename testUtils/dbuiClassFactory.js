import ensureSingleRegistration from '../src/lib/core/internals/ensureSingleRegistration';
import getDBUIWebComponentBase
  from '../src/lib/core/web-components/components/DBUIWebComponentBase/DBUIWebComponentBase';

/* eslint import/prefer-default-export: 0 */
export function getDummyX(
  registrationName, className,
  {
    style = ':host { display: block; } div { padding-left: 10px; }',
    dependentClasses = [], dependentHTML = '', properties = {},
    callbacks = {
      // onConnectedCallback
    }
  } = {}
) {
  function factory(win) {
    return ensureSingleRegistration(win, registrationName, () => {
      const DBUIWebComponentBase = getDBUIWebComponentBase(win);

      const klass = class extends DBUIWebComponentBase {
        static get registrationName() {
          return registrationName;
        }

        static get name() {
          return className;
        }

        static get dependencies() {
          return [...super.dependencies, ...dependentClasses];
        }

        static get properties() {
          return {
            ...super.properties,
            ...properties
          };
        }

        static get templateInnerHTML() {
          return `
            <style>${style}</style>
            <div>
              <b>${registrationName}</b>
              ${dependentHTML}
              ${dependentHTML.includes('<slot></slot>') ? '' : '<slot></slot>'}
            </div>
          `;
        }

        onConnectedCallback() {
          super.onConnectedCallback();
          callbacks.onConnectedCallback && callbacks.onConnectedCallback(this);
        }

        onDisconnectedCallback() {
          super.onDisconnectedCallback();
          callbacks.onDisconnectedCallback && callbacks.onDisconnectedCallback(this);
        }

        onPropertyChangedCallback(name, oldValue, newValue) {
          super.onPropertyChangedCallback(name, oldValue, newValue);
          callbacks.onPropertyChangedCallback &&
            callbacks.onPropertyChangedCallback(this, name, oldValue, newValue);
        }
      };

      return klass;
    });
  }
  return factory;
}
