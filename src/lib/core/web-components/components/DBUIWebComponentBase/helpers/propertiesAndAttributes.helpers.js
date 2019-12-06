import { withLock } from '../../../../utils/lock';
import {
  arrayOrObject, undefinedOrNull, stringOrNumber, mapOrSet,
  booleanAttributeValue
} from '../constants';


export const attributeOrPropertyLock = 'attributeOrPropertyLock';

const invalidValueErrorMessage = (name, value, self) => {
  return `
  Invalid value ${value} for ${name} property.
  (${self.nodeName.toLowerCase()}${self.id ? `#${self.id}` : ''})
  `;
};

const defaultValueErrorMessage = (name) => {
  return `Default value for ${name} was not provided.`;
};

const getAttrName = (attribute, name) =>
  (attribute && typeof attribute === 'string' ? attribute : name);

export const getConverters = (type) => {
  switch (true) {
    case type.name === 'Boolean': {
      return {
        toProperty: (attr) => (attr === booleanAttributeValue ? true : attr === null ? false : attr)
        // toAttribute does not exist because attribute it is either booleanAttributeValue or removed
        // this is controlled in defineSettersAndGetters
      };
    }
    case arrayOrObject.has(type.name): {
      const init = type.name === 'Array' ? type.from : type;
      return {
        toProperty: (attr) => (attr === null ? null : init(JSON.parse(attr))),
        toAttribute: (prop) => (prop === null ? null : JSON.stringify(prop)),
      };
    }
    case mapOrSet.has(type.name): {
      return {
        /* eslint new-cap: 0 */
        toProperty: (attr) => (attr === null ? null : new type(JSON.parse(attr))),
        toAttribute: (prop) => (prop === null ? null : JSON.stringify(Array.from(prop))),
      };
    }
    case stringOrNumber.has(type.name): {
      return {
        toProperty: (attr) => {
          if (attr === null) { return null; }
          const newProp = type(attr);
          // eslint-disable-next-line
          if (newProp !== newProp) { // is NaN
            // So that we can show the user the error message for used value instead of NaN.
            return attr;
          }
          return newProp;
        },
        toAttribute: (prop) => (undefinedOrNull.has(prop) ? prop : prop.toString()),
      };
    }
    default: {
      return {
        // eslint-disable-next-line
        toProperty: (attr) => (attr === null ? null : new type(attr)),
        toAttribute: (prop) => (undefinedOrNull.has(prop) ? prop : prop.toString()),
      };
    }
  }
};

export function checkValueType(value, type) {
  switch (true) {
    case value === null: {
      return true;
    }
    case type.name === 'Boolean': {
      return typeof value === 'boolean';
    }
    case type.name === 'String': {
      return typeof value === 'string';
    }
    case type.name === 'Number': {
      // eslint-disable-next-line
      return typeof value === 'number' && value === value;
    }
    case type.name === 'Array': {
      return value instanceof type;
    }
    case type.name === 'Object': {
      return value.constructor.name === type.name;
    }
    default: {
      return value instanceof type;
    }
  }
}


/**
 *
 * @param self DBUIWebComponentBase class
 */
export function defineSettersAndGetters(klass) {
  const {
    properties
  } = klass;

  klass._attributesToPropertiesMapper = {};

  Object.entries(properties).forEach(([name, {
    type, noAccessor, attribute, allowedValues,
    toProperty: customToProperty, toAttribute: customToAttribute
  }]) => {
    if (noAccessor) return;

    const existingDescriptor = Object.getOwnPropertyDescriptor(klass.prototype, name);
    const { set: existingSetter, get: existingGetter } = existingDescriptor || {};
    const attrName = getAttrName(attribute, name);
    const { toProperty: _toProperty, toAttribute: _toAttribute } = getConverters(type);

    const toProperty = customToProperty || _toProperty;
    const toAttribute = customToAttribute || _toAttribute;

    klass._attributesToPropertiesMapper[attrName] = {
      name, type, toProperty, toAttribute
    };

    const descriptor = {
      get() {
        return this._internalProperties[name];
      },
      set(_value) {
        const value = _value === undefined ? (type.name === 'Boolean' ? false : null) : _value;
        if (!checkValueType(value, type) || (allowedValues && !allowedValues({ self: this, value }))) {
          this.throwError(invalidValueErrorMessage(name, value, this));
        }

        const oldValue = this._internalProperties[name];

        // Note:
        // When upgrading properties oldValue equals value.
        // Attributes are defined in this setter but at upgrade step.

        this._internalProperties[name] = value;

        // Checking this._componentHasBeenInitialized to not fire the event for default properties.
        // Checking this._componentIsConnected since attributes can be changed when component is detached
        // and we don't want to fire the event in this scenario.
        if (this._componentHasBeenInitialized && this._componentIsConnected) {
          this.onPropertyChangedCallback(name, oldValue, value);
        }

        withLock(this, attributeOrPropertyLock, () => {
          // Browser complains if attributes are set in constructor,
          // so, we return early.
          if (this._attributesCanBeDefined) {
            if (attribute) {
              if (value === null || value === false) {
                this.removeAttribute(attrName);
              } else if (type.name === 'Boolean') {
                this.setAttribute(attrName, booleanAttributeValue);
              } else {
                this.setAttribute(attrName, toAttribute(value));
              }
            }
          }
        });

      },
      enumerable: true,
      configurable: true
    };

    existingGetter && (delete descriptor.get);
    existingSetter && (delete descriptor.set);

    if (descriptor.get || descriptor.set) {
      Object.defineProperty(klass.prototype, name, descriptor);
    }
  });
}

export function setPropertyFromAttribute(self, name, newValue) {
  const mapper = self.constructor._attributesToPropertiesMapper;
  const { name: propertyName, type, toProperty, toAttribute } = mapper[name];
  const newPropertyValue = toProperty(newValue);

  withLock(self, attributeOrPropertyLock, () => {
    if (['String', 'Number', 'Boolean'].includes(type.name)) {
      self[propertyName] = newPropertyValue;
    } else if (toAttribute(newPropertyValue) !== toAttribute(self[propertyName])) {
      // Using toAttribute(newPropertyValue) instead of directly newValue to account for
      // JSON strings defined as attributes which might be different in spaces.
      self[propertyName] = newPropertyValue;
    }
  });
}

export function defineObservedAttributes(klass) {
  const attributesToObserve = [];
  for (const [name, { attribute, defaultValue }] of Object.entries(klass.properties)) {
    if (defaultValue === undefined) {
      klass.throwError(defaultValueErrorMessage(name));
    }
    if (attribute) {
      attributesToObserve.push(getAttrName(attribute, name));
    }
  }
  klass._observedAttributes = attributesToObserve;
}

/**
 *
 * @param self DBUIWebComponentBase instance
 * @param prop String
 * @private
 */
function upgradeProperty(self, prop) {
  // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
  // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox
  const value = self[prop];
  // get rid of the property that might shadow a setter/getter
  delete self[prop];
  // this time if a setter was defined it will be properly called
  self[prop] = value;
  // if a getter was defined, it will be called from now on
}

export function upgradeProperties(self) {
  Object.entries(self.constructor.properties).forEach(([name]) => {
    upgradeProperty(self, name);
  });
}

export function handlePropertiesAndAttributesDefinedBeforeFirstTimeConnected(self) {
  if (!self._componentFirstTimeConnected) {
    self._componentFirstTimeConnected = true;

    const mapper = self.constructor._attributesToPropertiesMapper;

    // This overrides default values set in constructor with attributes being set at tag definition time.
    Object.entries(self._attributesChangedBeforeFirstTimeConnected).forEach(([name, { oldValue, newValue }]) => {
      const { name: propertyName } = mapper[name];
      // Ignore initial attribute if property has been set.
      // Property takes precedence over attribute before component has been upgraded.
      if (self._consumerDefinedPropertiesBeforeUpgrade[propertyName] === undefined) {
        self._onAttributeChangedCallback(name, oldValue, newValue);
      }
    });
    self._attributesChangedBeforeFirstTimeConnected = null;

    if (self._invalidComponentState) return;

    // Apply consumer defined properties before upgrade (override default values).
    // This is mandatory to happen after applying attributes changed before first time connected
    // so that properties take precedence over attributes.
    Object.entries(self._consumerDefinedPropertiesBeforeUpgrade).forEach(([name, value]) => {
      self[name] = value;
    });
    self._consumerDefinedPropertiesBeforeUpgrade = null;

    // Hint for setters that from now on attributes can be defined.
    self._attributesCanBeDefined = true; // happens once
    upgradeProperties(self); // happens once, this will also reflect properties to attributes
    self._componentHasBeenInitialized = true; // happens once
  }
}

export function deferOwnProperties(self) {
  /* eslint no-prototype-builtins: 0 */
  // Defer consumer defined properties to apply first default properties.
  Object.keys(self.constructor.properties).forEach((name) => {
    if (self.hasOwnProperty(name)) {
      self._consumerDefinedPropertiesBeforeUpgrade[name] = self[name];
    }
  });
}

export function applyDefaultValues(self) {
  Object.entries(self.constructor.properties).forEach(([name, { defaultValue }]) => {
    self[name] = typeof defaultValue === 'function' ? defaultValue(self) : defaultValue;
  });
}

