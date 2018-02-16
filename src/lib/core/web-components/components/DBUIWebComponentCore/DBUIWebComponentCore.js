
import getDBUILocaleService from '../../../services/DBUILocaleService';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import DBUIWebComponentMessage from './DBUIWebComponentMessage';
import DBUICommonCssVars from './DBUICommonCssVars';

const PARENT_TARGET_TYPE = 'PARENT';
const CHILDREN_TARGET_TYPE = 'CHILDREN';
const CHANNEL_INTERNAL = 'Internal';
const MESSAGE_ANCESTORS_CHAIN_CONNECTED = 'ANCESTORS_CHAIN_CONNECTED';

const registrationName = 'DBUIWebComponentBase';

function defineCommonCSSVars(win) {
  const { document } = win;
  const commonStyle = document.createElement('style');
  commonStyle.setAttribute('dbui-common-css-vars', '');
  commonStyle.innerHTML = DBUICommonCssVars;
  document.querySelector('head').appendChild(commonStyle);
}

export default function getDBUIWebComponentCore(win) {
  const LocaleService = getDBUILocaleService(win);

  return ensureSingleRegistration(win, registrationName, () => {
    defineCommonCSSVars(win);

    const { document, HTMLElement, customElements } = win;

    class DBUIWebComponentBase extends HTMLElement {

      static get registrationName() {
        throw new Error('registrationName must be defined in derived classes');
      }

      static get templateInnerHTML() {
        return '<style></style><slot></slot>';
      }

      static get dependencies() {
        return [];
      }

      static get useShadow() {
        return true;
      }

      static get propertiesToUpgrade() {
        return [];
      }

      static get propertiesToDefine() {
        return { 'dbui-web-component': '' };
      }

      // web components standard API
      static get observedAttributes() {
        return [];
      }

      constructor(...args) {
        super();

        const { useShadow } = this.constructor;
        if (useShadow) {
          this.attachShadow({
            mode: 'open',
            // delegatesFocus: true
            // Not working on IPad so we do an workaround
            // by setting "focused" attribute when needed.
          });
        }
        this._isConnected = false;
        this._ancestorsConnected = false;
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this._handleLocaleChange = this._handleLocaleChange.bind(this);
        this.onLocaleChange = this.onLocaleChange.bind(this);
        this.unregisterLocaleChange = null;

        // provide support for traits if any as they cant override constructor
        this.init && this.init(...args);
      }

      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
      // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox
      /* eslint no-prototype-builtins: 0 */
      _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
          const value = this[prop];
          // get rid of the property that might shadow a setter/getter
          delete this[prop];
          // this time if a setter was defined it will be properly called
          this[prop] = value;
          // if a getter was defined, it will be called from now on
        }
      }

      _defineProperty(key, value) {
        if (!this.hasAttribute(key)) {
          this.setAttribute(key, value);
        }
      }

      // web components standard API
      connectedCallback() {
        this._isConnected = true;
        window.addEventListener('beforeunload', this.disconnectedCallback, false);
        this.unregisterLocaleChange =
          LocaleService.onLocaleChange(this._handleLocaleChange);
        const { propertiesToUpgrade, propertiesToDefine } = this.constructor;
        propertiesToUpgrade.forEach((property) => {
          this._upgradeProperty(property);
        });
        Object.keys(propertiesToDefine).forEach((property) => {
          this._defineProperty(property, propertiesToDefine[property]);
        });
        // if in light dom notify descendants that ancestor chain is connected
        if (!this.dbuiParentHost) {
          this.sendMessageToChildren({
            channel: CHANNEL_INTERNAL,
            message: MESSAGE_ANCESTORS_CHAIN_CONNECTED
          });
        }
      }

      // web components standard API
      disconnectedCallback() {
        this._isConnected = false;
        this.unregisterLocaleChange();
        window.removeEventListener('beforeunload', this.disconnectedCallback, false);
      }

      // web components standard API
      attributeChangedCallback() {
        // no op
      }

      onLocaleChange() {
        // no op
      }

      get ancestorsConnected() {
        return this._ancestorsConnected;
      }

      get dbuiChildren() {
        return this.childrenTree.querySelectorAll('[dbui-web-component]');
      }

      get dbuiParentHost() {
        return this.getRootNode().host;
      }

      createMessage({
        channel, message, data, rememberNodesPath, targetType
      } = {}) {
        const messageInst = new DBUIWebComponentMessage({
          channel,
          message,
          data,
          source: this,
          rememberNodesPath,
          metadata: {
            targetType
          }
        });
        // will be ignored if rememberNodesPath was false at message creation
        messageInst.appendVisitedNode(this);
        return messageInst;
      }

      sendMessage(messageInst) {
        const { targetType } = messageInst.metadata;
        if (targetType === PARENT_TARGET_TYPE) {
          const dbuiParentHost = this.dbuiParentHost;
          if (dbuiParentHost) {
            dbuiParentHost._propagateMessage(messageInst.cloneOrInstance);
          }
        } else if (targetType === CHILDREN_TARGET_TYPE) {
          const dbuChildren = this.dbuiChildren;
          dbuChildren.forEach((child) => {
            child._propagateMessage(messageInst.cloneOrInstance);
          });
        }
      }

      _propagateMessage(messageInst) {
        // Will be ignored if rememberNodesPath was false at message creation
        messageInst.appendVisitedNode(this);
        this.onMessageReceived(messageInst);
        // Inside onMessageReceived there is a chance that
        // message#stopPropagation has been called.
        if (messageInst.shouldPropagate) {
          this.sendMessage(messageInst);
        }
      }

      onMessageReceived(messageInst) {
        // console.log(this.id, 'isConnected', this.isConnected, `received message ${messageInst.message}`, 'path', JSON.stringify(messageInst.visitedNodes.map((node) => node.id)), 'source', messageInst.source.id);
        const { channel } = messageInst;
        this[`on${channel}Message`] &&
          this[`on${channel}Message`](messageInst);
      }

      [`on${CHANNEL_INTERNAL}Message`](messageInst) {
        const { message } = messageInst;
        message === MESSAGE_ANCESTORS_CHAIN_CONNECTED &&
          this.onAncestorsChainConnected(messageInst);
      }

      // eslint-disable-next-line
      onAncestorsChainConnected(messageInst) {
        this._ancestorsConnected = true;
        // console.log(this.id, 'isConnected', this.isConnected, 'onAncestorsChainConnected', messageInst.source.id);
      }

      sendMessageToParent({ channel, message, data, rememberNodesPath }) {
        this.sendMessage(this.createMessage({
          channel,
          message,
          data,
          rememberNodesPath,
          targetType: PARENT_TARGET_TYPE
        }));
      }

      sendMessageToChildren({ channel, message, data, rememberNodesPath }) {
        this.sendMessage(this.createMessage({
          channel,
          message,
          data,
          rememberNodesPath,
          targetType: CHILDREN_TARGET_TYPE
        }));
      }

      get isConnected() {
        return this._isConnected;
      }

      get childrenTree() {
        return this.constructor.useShadow ? this.shadowRoot : this;
      }

      _insertTemplate() {
        const { template } = this.constructor;

        if (template) {
          this.childrenTree.appendChild(template.content.cloneNode(true));
        }
      }

      _handleLocaleChange(locale) {
        this.setAttribute('dir', locale.dir);
        this.setAttribute('lang', locale.lang);
        this.onLocaleChange(locale);
      }

    }

    function defineCommonStaticMethods(klass) {
      const templateInnerHTML = klass.templateInnerHTML;
      const template = document.createElement('template');
      template.innerHTML = templateInnerHTML;

      Object.defineProperty(klass, 'template', {
        get() { return template; },
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(klass, 'componentStyle', {
        get() {
          return klass.template.content.querySelector('style').innerHTML;
        },
        set(value) {
          klass.template.content.querySelector('style').innerHTML = value;
        },
        enumerable: false,
        configurable: true
      });

      return klass;
    }

    function Registerable(klass) {
      klass.registerSelf = () => {
        const registrationName = klass.registrationName;
        const dependencies = klass.dependencies;
        // Make sure our dependencies are registered before we register self
        dependencies.forEach((dependency) => dependency.registerSelf());
        // Don't try to register self if already registered
        if (customElements.get(registrationName)) return registrationName;
        // Give a chance to override web-component style if provided before being registered.
        const componentStyle = ((win.DBUIWebComponents || {})[registrationName] || {}).componentStyle;
        if (componentStyle) {
          klass.componentStyle += '\n\n/* ==== overrides ==== */\n\n';
          klass.componentStyle += componentStyle;
        }
        // Do registration
        customElements.define(registrationName, klass);
        return registrationName;
      };

      Object.defineProperty(klass, 'prototypeChainInfo', {
        get() {
          const chain = [klass];
          let parentProto = Object.getPrototypeOf(klass);
          while (parentProto !== HTMLElement) {
            chain.push(parentProto);
            parentProto = Object.getPrototypeOf(parentProto);
          }
          chain.push(parentProto);
          return chain;
        },
        enumerable: false,
        configurable: true
      });

      return klass;
    }

    return {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    };
  });
}
