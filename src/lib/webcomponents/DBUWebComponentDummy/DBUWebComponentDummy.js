
import getDBUWebComponentBase from '../DBUWebComponentBase/DBUWebComponentBase';
import ensureSingleRegistration from '../internals/ensureSingleRegistration';

console.log('importing getDBUWebComponent');

const registrationName = 'dbu-web-component-dummy';

export default function getDBUWebComponentDummy(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const { DBUWebComponentBase, defineCommonStaticMethods } = getDBUWebComponentBase(win);
    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
      :host {
        display: block;
        color: maroon;
      }
      
      :host b {
        text-shadow: var(--b-text-shadow, none);
      }
      
      :host([dir=rtl]) b {
        text-decoration: underline;
        padding: 5px;
        border: 1px solid red;
      }
      :host([dir=ltr]) b {
        text-decoration: overline;
        padding: 5px;
        border: 1px solid green;
      }
      
      :host([dir=rtl]) span[x-has-slot] {
        float: left;
      }
      
      :host([dir=ltr]) span[x-has-slot] {
        float: right;
      }
      
      :host([dir=ltr]) *[dir=rtl] {
        display: none;
      }
      :host([dir=rtl]) *[dir=ltr] {
        display: none;
      }
      
      </style>
      
      <b dir="ltr">I'm in shadow dom! ltr (DBUWebComponentDummy)</b>
      <span x-has-slot><span>[</span><slot></slot><span>]</span></span>
      <b dir="rtl">I'm in shadow dom! rtl (DBUWebComponentDummy)</b>
    `;

    class DBUWebComponentDummy extends DBUWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      onLocaleChange(locale) {
        console.log('onLocaleChange', locale);
      }
    }

    defineCommonStaticMethods(DBUWebComponentDummy);

    return DBUWebComponentDummy;
  });
}

