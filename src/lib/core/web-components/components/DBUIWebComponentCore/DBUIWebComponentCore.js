
import getDBUILocaleService from '../../../services/DBUILocaleService';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import Publisher from '../../../utils/Publisher';
import DBUIWebComponentMessage from './DBUIWebComponentMessage';
import DBUICommonCssVars from './DBUICommonCssVars';

const PARENT_TARGET_TYPE = 'PARENT';
const CHILDREN_TARGET_TYPE = 'CHILDREN';
const SHADOW_DOM_TYPE = 'ShadowDom';
const LIGHT_DOM_TYPE = 'LightDom';
const CHANNEL_INTERNAL = 'Internal';
const MESSAGE_SHADOW_DOM_ANCESTORS_CHAIN_CONNECTED = 'SHADOW_DOM_ANCESTORS_CHAIN_CONNECTED';
const EVENT_READY = 'ready';

const registrationName = 'DBUIWebComponentBase';

function defineCommonCSSVars(win) {
  const { document } = win;
  const commonStyle = document.createElement('style');
  commonStyle.setAttribute('dbui-common-css-vars', '');
  commonStyle.innerHTML = DBUICommonCssVars;
  document.querySelector('head').appendChild(commonStyle);
}

/*
Accessing parents and children:
If parent is accessed in connectedCallback it exists (if it should exist), however,
the parent might not be itself connected yet.
If children are accessed in connectedCallback they might not be complete yet at that time.
*/

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

      static get propertiesToUpgrade() {
        return [];
      }

      static get propertiesToDefine() {
        return { 'dbui-web-component': '' };
      }

      static get CONSTANTS() {
        return {
          PARENT_TARGET_TYPE,
          CHILDREN_TARGET_TYPE,
          SHADOW_DOM_TYPE,
          LIGHT_DOM_TYPE,
          CHANNEL_INTERNAL,
          MESSAGE_SHADOW_DOM_ANCESTORS_CHAIN_CONNECTED,
          EVENT_READY
        };
      }

      // web components standard API
      static get observedAttributes() {
        return [];
      }

      get shadowDomChildren() {
        // children in slots are NOT included here
        return [...this.shadowRoot.querySelectorAll('[dbui-web-component]')];
      }

      get shadowDomParent() {
        return this.getRootNode().host || null;
      }

      get lightDomParent() {
        // can return a parent which is in shadow DOM of the grand-parent
        let parent = this.parentElement;
        while (parent && !parent.hasAttribute('dbui-web-component')) {
          parent = parent.parentElement;
        }
        return parent || null;
      }

      get lightDomChildren() {
        // children in slots ARE included here
        return [...this.querySelectorAll('[dbui-web-component]')];
      }

      get closestDbuiParentLiveQuery() {
        let closestParent = this.parentElement;
        // might be null if disconnected from dom
        if (closestParent === null) {
          return null;
        }
        closestParent = closestParent.closest('[dbui-web-component]');
        return closestParent || this.shadowDomParent;
      }

      get closestDbuiParent() {
        // cached
        // Reason for cache is to allow a child to unregister from its parent when unmounted
        // because when browser calls disconnectedCallback the parent is not reachable anymore.
        // If parent could not be reachable it could not unregister its closest children
        // thus leading to memory leak.
        if (this._closestDbuiParent) {
          return this._closestDbuiParent;
        }
        this._closestDbuiParent = this.closestDbuiParentLiveQuery;
        return this._closestDbuiParent;
      }

      // might be useful in some scenarios
      get closestDbuiChildrenLiveQuery() {
        const dbuiChildren = [...this.lightDomChildren, ...this.shadowDomChildren];
        const closestDbuiChildren = dbuiChildren.filter((child) => child.closestDbuiParentLiveQuery === this);
        return closestDbuiChildren;
      }

      get closestDbuiChildren() {
        return this._closestDbuiChildren;
      }

      get isMounted() {
        return this._isMounted;
      }

      // TODO: do we really need this ?
      get isReady() {
        return this._isReady;
      }

      constructor(...args) {
        super();

        this.attachShadow({
          mode: 'open',
          // delegatesFocus: true
          // Not working on IPad so we do an workaround
          // by setting "focused" attribute when needed.
        });

        // this._publisher = new Publisher();
        this._providingContext = {};
        this._lastReceivedContext = {};
        this._closestDbuiParent = null;
        this._closestDbuiChildren = [];
        this._isMounted = false;
        this._isReady = false;
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        // TODO: _handleLocaleChange only if user sets locale-aware attribute
        this._handleLocaleChange = this._handleLocaleChange.bind(this);
        this.onLocaleChange = this.onLocaleChange.bind(this);
        this.unregisterLocaleChange = null;

        // provide support for traits if any as they can't override constructor
        this.init && this.init(...args);
      }

      static get contextProvide() {
        return [];
      }

      static get contextSubscribe() {
        return [];
      }

      _providesContextFor(key) {
        return this.constructor.contextProvide.some((_key) => _key === key);
      }

      _hasValueForContext(key) {
        return this._providingContext[key] !== undefined;
      }

      _subscribesForContext(key) {
        return this.constructor.contextSubscribe.some((_key) => _key === key);
      }

      setContext(contextObj) {
        const newKeys = Object.keys(contextObj).filter((key) => {
          return this._providesContextFor(key);
        });

        const anythingChanged = newKeys.some((key) => {
          return ![
            this._lastReceivedContext[key]
          ].includes(contextObj[key]);
        });

        const anythingShouldChange = this.constructor.contextProvide.some((key) => {
          return this._hasValueForContext(key) &&
            this._providingContext[key] !== this._lastReceivedContext[key];
        });

        if (!anythingChanged && !anythingShouldChange) return;

        const newProvidingContext = {
          ...this._providingContext,
          ...newKeys.reduce((acc, key) => {
            acc[key] = contextObj[key];
            return acc;
          }, {})
        };

        this._providingContext = newProvidingContext;

        this._onContextChanged(this._providingContext);
        this._propagateContextChanged(this._providingContext);
      }

      _propagateContextChanged(newContext) {
        const newContextKeys = Object.keys(newContext);

        // if context is received from ancestors
        if (newContext !== this._providingContext) {
          // makes self aware
          const keysSubscribedFor = newContextKeys.reduce((acc, key) => {
            this._subscribesForContext(key) && acc.push(key);
            return acc;
          }, []);

          if (keysSubscribedFor.length) {
            const contextSubscribedFor = keysSubscribedFor.reduce((acc, key) => {
              acc[key] = newContext[key];
              return acc;
            }, {});
            this._onContextChanged(contextSubscribedFor);
          }
        }

        // propagate with overrides
        const overriddenContext = this.constructor.contextProvide.reduce((acc, key) => {
          if (this._hasValueForContext(key)) {
            acc[key] = this._providingContext[key];
          }
          return acc;
        }, {});

        const contextToPropagate = {
          ...newContext,
          ...overriddenContext
        };

        this.closestDbuiChildren.forEach((child) => {
          child._propagateContextChanged(contextToPropagate);
        });
      }

      _getContext(keys) {
        const ownedKeys = [];
        const keysToAskFor = [];
        keys.forEach((key) => {
          if (this._hasValueForContext(key)) {
            ownedKeys.push(key);
          } else {
            keysToAskFor.push(key);
          }
        });
        const closestDbuiParent = this.closestDbuiParent;
        return {
          ...ownedKeys.reduce((acc, key) => {
            acc[key] = this._providingContext[key];
            return acc;
          }, {}),
          ...(closestDbuiParent ? closestDbuiParent._getContext(keysToAskFor) : {})
        };
        // TODO: we should propagate here to children ?
        // because when they registered to us we were not aware of context
      }

      _onContextChanged(newContext) {
        const lastReceivedContext = this._lastReceivedContext;
        const contextToSet = { ...lastReceivedContext, ...newContext };
        this._lastReceivedContext = contextToSet;

        this.onContextChanged(this._lastReceivedContext, lastReceivedContext);
      }

      // eslint-disable-next-line
      onContextChanged(newContext, prevContext) {
        // no op
      }

      _checkContext() {
        const newContext = this._getContext(
          this.constructor.contextSubscribe
        );
        this._onContextChanged(newContext);
      }

      _registerSelfToClosestDbuiParent() {
        const closestDbuiParent = this.closestDbuiParent;
        if (!closestDbuiParent) return;
        closestDbuiParent._registerChild(this);
      }

      _unregisterSelfFromClosestDbuiParent() {
        const closestDbuiParent = this.closestDbuiParent;
        if (!closestDbuiParent) return;
        closestDbuiParent._unregisterChild(this);
      }

      _registerChild(child) {
        this._closestDbuiChildren.push(child);
      }

      _unregisterChild(child) {
        this._closestDbuiChildren =
          this._closestDbuiChildren.filter((_child) => _child !== child);
      }

      // publish(channel, message) {
      //   this._publisher.publish(CHANNEL_INTERNAL, message);
      // }

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
        // don't override user defined value
        if (!this.hasAttribute(key)) {
          this.setAttribute(key, value);
        }
      }

      _insertTemplate() {
        const { template } = this.constructor;
        template &&
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }

      _handleLocaleChange(locale) {
        this.setAttribute('dir', locale.dir);
        this.setAttribute('lang', locale.lang);
        this.onLocaleChange(locale);
      }

      // web components standard API
      // eslint-disable-next-line
      adoptedCallback(oldDocument, newDocument) {
        // callbacks order:
        // disconnectedCallback => adoptedCallback => connectedCallback
      }

      // web components standard API
      /*
      * connectedCallback is fired from children to parent in shadow DOM
      * but the order is less predictable in light DOM.
      * Should not read light/shadowDomParent/Children here.
      * */
      connectedCallback() {
        this._isMounted = true;
        win.addEventListener('beforeunload', this.disconnectedCallback, false);
        this.unregisterLocaleChange =
          LocaleService.onLocaleChange(this._handleLocaleChange);
        const { propertiesToUpgrade, propertiesToDefine } = this.constructor;
        propertiesToUpgrade.forEach((property) => {
          this._upgradeProperty(property);
        });
        Object.keys(propertiesToDefine).forEach((property) => {
          this._defineProperty(property, propertiesToDefine[property]);
        });
        // We can safely register to closestDbuiParent because it exists at this time
        // but we must not assume it was connected.
        this._registerSelfToClosestDbuiParent();
        this._checkContext();

        // this.info('connectedCallback');
        setTimeout(this._readyCallback.bind(this), 0);
      }

      // web components standard API
      disconnectedCallback() {
        this._unregisterSelfFromClosestDbuiParent();
        this.unregisterLocaleChange();
        win.removeEventListener('beforeunload', this.disconnectedCallback, false);
        this._isMounted = false;
        this._isReady = false;
        this._closestDbuiParent = null;
      }

      cloneNodeDeep({ idPrefix = '', idSuffix = '' }) {
        const clone = super.cloneNode(true);
        if (!idPrefix && !idSuffix) return clone;
        if (clone.hasAttribute('id')) {
          clone.setAttribute('id', `${idPrefix}${clone.getAttribute('id')}${idSuffix}`);
        }
        clone.querySelectorAll('[dbui-web-component]').forEach((child) => {
          if (child.hasAttribute('id')) {
            child.setAttribute('id', `${idPrefix}${child.getAttribute('id')}${idSuffix}`);
          }
        });
        return clone;
      }

      // web components standard API
      // eslint-disable-next-line
      attributeChangedCallback(name, oldValue, newValue) {
        // no op
      }

      onLocaleChange() {
        // no op
      }

      info(step) {
        // if (this.id !== 'light-dummy-d-three-in-default-slot') return;
        const selfId = this.id || 'no id';
        // const isDefined = !!win.customElements.get(this.constructor.registrationName);
        // const hasAttr = this.hasAttribute('dbui-web-component');

        // const { contextColor } = this._getContext(['color']);
        const closestDbuiParent = this.closestDbuiParent;
        const closestDbuiChildren = this.closestDbuiChildren;
        const closestDbuiChildrenLiveQuery = this.closestDbuiChildrenLiveQuery;
        const closestDbuiParent2 = this.parentElement && this.parentElement.closest('[dbui-web-component]');
        const shadowDomParent = this.shadowDomParent;
        const shadowDomChildren = this.shadowDomChildren;
        const lightDomParent = this.lightDomParent;
        const lightDomChildren = this.lightDomChildren;
        // const lightParentHasAttr = lightDomParent && lightDomParent.hasAttribute('dbui-web-component');
        // const ownerDocument = this.ownerDocument;
        // const parentNode = this.parentNode;
        // const defaultView = ownerDocument.defaultView;

        console.log({
          step,
          selfId,
          // contextColor,
          // closestDbuiParent: (closestDbuiParent || {}).id || null,
          // closestDbuiParentIsMounted: closestDbuiParent && closestDbuiParent.isMounted,
          closestDbuiChildren: closestDbuiChildren.map((child) => child.id).join(', '),
          // closestDbuiChildrenLiveQuery: closestDbuiChildrenLiveQuery.map((child) => child.id).join(', '),
          // isDefined,
          // hasAttr,
          // ownerDocument,
          // parentNode,
          // defaultView,
          // lightParentHasAttr,
          // closestDbuiParent2: (closestDbuiParent2 || {}).id || null,
          // lightDomParent: (lightDomParent || {}).id || null,
          // lightDomChildren: lightDomChildren.map((child) => child.id).join(', '),
          // shadowDomParent: (shadowDomParent || {}).id || null,
          // shadowDomChildren: shadowDomChildren.map((child) => child.id).join(', ')
        });
      }

      _dispatchEventReady() {
        if (!this.isReady) return;
        // this.info('_dispatchEventReady');
        this.dispatchEvent(new Event(EVENT_READY, {
          bubbles: false,
          composed: false
        }));
      }

      // custom internal API
      // TODO: this should be removed
      _readyCallback() {
        // its possible the component was unmounted before having a chance to be ready
        // TODO: test what happens when component is appended and immediately removed from DOM
        // the ready event should not fire
        if (!this.isMounted) return;
        this._isReady = true;
        // this.info('_readyCallback');
        this._dispatchEventReady();
      }

      register(type, listener, ...rest) {
        if (type === EVENT_READY) {
          this.registerOnce(type, listener, ...rest);
        } else {
          super.addEventListener(type, listener, ...rest);
        }
      }

      registerOnce(type, listener, ...rest) {
        const internalListener = (evt, ...rest) => {
          listener(evt, ...rest);
          this.unregister(type, internalListener);
        };
        super.addEventListener(type, internalListener, { ...rest, once: true });
        if (type === EVENT_READY && this.isReady) {
          this._dispatchEventReady();
        }
      }

      unregister(type, listener, ...rest) {
        super.removeEventListener(type, listener, ...rest);
      }

      // get onReady() {
      //   return new Promise((resolve) => {
      //     this.registerOnce(EVENT_READY, (evt) => {
      //       return resolve(evt);
      //     });
      //   });
      // }

      // _propagateMessage(messageInst) {
      //   // Will be ignored if rememberNodesPath was false at message creation
      //   messageInst.appendVisitedNode(this);
      //   this.onMessageReceived(messageInst);
      //   // Inside onMessageReceived there is a chance that
      //   // message#stopPropagation has been called.
      //   if (messageInst.shouldPropagate) {
      //     this.sendMessage(messageInst);
      //   }
      // }

      // createMessage({
      //   channel, message, data, rememberNodesPath, targetType, domType, appendSelf = true
      // } = {}) {
      //   const messageInst = new DBUIWebComponentMessage({
      //     channel,
      //     message,
      //     data,
      //     source: this,
      //     rememberNodesPath,
      //     targetType,
      //     domType
      //   });
      //   // will be ignored if rememberNodesPath was false at message creation
      //   appendSelf && messageInst.appendVisitedNode(this);
      //   return messageInst;
      // }

      // sendMessage(messageInst) {
      //   const { targetType, domType } = messageInst;
      //   if (targetType === PARENT_TARGET_TYPE) {
      //     const parent =
      //       domType === SHADOW_DOM_TYPE ? this.shadowDomParent : this.lightDomParent;
      //     parent && parent._propagateMessage(messageInst.cloneOrInstance);
      //   } else if (targetType === CHILDREN_TARGET_TYPE) {
      //     const children =
      //       domType === SHADOW_DOM_TYPE ? this.shadowDomChildren : this.lightDomChildren;
      //     children.forEach((child) => {
      //       child._propagateMessage(messageInst.cloneOrInstance);
      //     });
      //   }
      // }

      // onMessageReceived(messageInst) {
      //   const { domType } = messageInst;
      //   this[`on${domType}Message`](messageInst);
      // }

      // [`on${SHADOW_DOM_TYPE}Message`](messageInst) {
      //   const { channel, domType } = messageInst;
      //   const listener = `on${domType}${channel}Message`;
      //   this[listener] && this[listener](messageInst);
      // }

      // [`on${LIGHT_DOM_TYPE}Message`](messageInst) {
      //   const { channel, domType } = messageInst;
      //   const listener = `on${domType}${channel}Message`;
      //   this[listener] && this[listener](messageInst);
      // }

      // shadowDomSendMessageToParent({ channel, message, data, rememberNodesPath }) {
      //   this.sendMessage(this.createMessage({
      //     channel,
      //     message,
      //     data,
      //     rememberNodesPath,
      //     targetType: PARENT_TARGET_TYPE,
      //     domType: SHADOW_DOM_TYPE
      //   }));
      // }

      // shadowDomSendMessageToChildren({ channel, message, data, rememberNodesPath }) {
      //   this.sendMessage(this.createMessage({
      //     channel,
      //     message,
      //     data,
      //     rememberNodesPath,
      //     targetType: CHILDREN_TARGET_TYPE,
      //     domType: SHADOW_DOM_TYPE
      //   }));
      // }

      // shadowDomSendMessageToParentAndSelf({ channel, message, data, rememberNodesPath }) {
      //   const messageInst = this.createMessage({
      //     channel,
      //     message,
      //     data,
      //     rememberNodesPath,
      //     targetType: PARENT_TARGET_TYPE,
      //     domType: SHADOW_DOM_TYPE,
      //     appendSelf: false
      //   });
      //   this._propagateMessage(messageInst);
      // }

      // shadowDomSendMessageToChildrenAndSelf({ channel, message, data, rememberNodesPath }) {
      //   const messageInst = this.createMessage({
      //     channel,
      //     message,
      //     data,
      //     rememberNodesPath,
      //     targetType: CHILDREN_TARGET_TYPE,
      //     domType: SHADOW_DOM_TYPE,
      //     appendSelf: false
      //   });
      //   this._propagateMessage(messageInst);
      // }

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
