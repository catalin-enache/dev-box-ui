
import getDBUIWebComponentBase from '../DBUIWebComponentBase/DBUIWebComponentBase';
import ensureSingleRegistration from '../internals/ensureSingleRegistration';
import Focusable from '../behaviours/Focusable';

const registrationName = 'dbui-web-component-form-input-text';

export default function getDBUIWebComponentFormInputText(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const { DBUIWebComponentBase, defineCommonStaticMethods } = getDBUIWebComponentBase(win);
    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
      :host {
        all: initial; 
        display: inline-block;
        width: 100%;
        /*height: var(--dbui-web-component-form-input-height);*/
        /*line-height: var(--dbui-web-component-form-input-height);*/
        height: 200px;
        padding: 0px;
        font-size: 18px;
        color: var(--dbui-web-component-form-input-color);
        background-color: var(--dbui-web-component-form-input-background-color);
        unicode-bidi: bidi-override;
        box-sizing: border-box;
        border: none;
        border-bottom: var(--dbui-web-component-form-input-border-width) var(--dbui-web-component-form-input-border-style) var(--dbui-web-component-form-input-border-color);
      }
      
      :host [tabindex] {
        width: 100%;
        height: 50px;
        line-height: 50px;
        border: none;
        margin: 0px;
        padding: 0px;
        background-color: transparent;
        border-radius: 0px;
      }
      
      :host [tabindex]:focus {
        background-color: rgba(255, 0, 0, .3);
        outline: none;
      }

      :host([focused]) {
        background-color: rgba(0, 255, 0, .3);
      }
      
      :host([disabled]) {
        background-color: rgba(0, 0, 0, .3);
      }
      
      :host([hidden]) {
        display: none;
      }

      :host([dir=rtl]) {
      
      }
      
      :host([dir=ltr]) {
      
      }
      </style>
      <div contenteditable="true" tabindex="0"></div>
      <div contenteditable="true" tabindex="0"></div>
      <input type="text" tabindex="0" />
      <input type="text" tabindex="0" />
    `;

    class DBUIWebComponentFormInputText extends DBUIWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      static get propertiesToDefine() {
        return {
          role: 'form-input'
        };
      }

      // onLocaleChange(locale) {
      //   // console.log('onLocaleChange', locale);
      // }

    }

    return defineCommonStaticMethods(
      Focusable(
        DBUIWebComponentFormInputText
      )
    );

  });
}

getDBUIWebComponentFormInputText.registrationName = registrationName;

