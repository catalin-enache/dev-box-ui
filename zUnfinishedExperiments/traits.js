
// http://raganwald.com/2015/12/31/this-is-not-an-essay-about-traits-in-javascript.html

/*

class A {
  constructor(...args) {
    this.init(...args);
  }
}

class B extends A {
  init(x) {
    this._x = x;
  }
  getX() {
    return this._x;
  }
  setX(value) {
    this._x = value;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
}

function withDoubleX(klass) {
  return OverrideOrDefine({

    // overrides
    init(originalInit, x, y) {
      originalInit(x);
      this._y = y;
    },
    getX(originalGetX) {
      return originalGetX() * 2;
    },
    setX(originalSetX, value) {
      // this._x = value * 2;
      originalSetX(value * 2);
    },
    get x() {
      return this._x * 2;
    },
    set x(value) {
      this._x = value * 2;
    },

    // new definitions
    set y(value) {
      this._y = value * 2;
    },
    get y() {
      return this._y * 2;
    },
    hello() {
      return `hello ${this._x} and ${this.y}`;
    }
  })(klass);
}

B = withDoubleX(B);

const b = new B(2, 5);
console.log(b.x); // 4
console.log(b.getX()); // 4

b.setX(3);
// b.x = 3;
console.log(b.x); // 12
console.log(b.getX()); // 12

// new
console.log(b.y); // 10
b.y = 9;
console.log(b.hello()); // hello 6 and 36

*/
function OverrideOrDefine(behaviour) {
  return function define(klass) {
    Object.keys(behaviour).forEach((type) => {
      const keys = Reflect.ownKeys(behaviour[type]);

      keys.forEach((property) => {
        const newPropertyDescriptor =
          Object.getOwnPropertyDescriptor(behaviour[type], property);
        const originalPropertyDescriptor =
          Object.getOwnPropertyDescriptor(type === 'static' ? klass : klass.prototype, property);

        const {
          value: newValue,
          get: newGetter,
          set: newSetter
        } = newPropertyDescriptor;

        if (!originalPropertyDescriptor) {
          if (newValue) {
            Object.defineProperty(type === 'static' ? klass : klass.prototype, property, {
              value: newValue,
              writable: true,
              enumerable: false,
              configurable: true,
            });
          } else {
            Object.defineProperty(type === 'static' ? klass : klass.prototype, property, {
              get: newGetter,
              set: newSetter,
              enumerable: false,
              configurable: true,
            });
          }
        } else {
          const {
            value: originalValue,
            writable: originalWritable,
            get: originalGetter,
            set: originalSetter,
            enumerable: originalEnumerable,
            configurable: originalConfigurable
          } = originalPropertyDescriptor;

          if (newValue) {
            Object.defineProperty(type === 'static' ? klass : klass.prototype, property, {
              value(...args) {
                const boundedValue = originalValue.bind(type === 'static' ? klass : this);
                return newValue.call(this, boundedValue, ...args);
              },
              writable: originalWritable,
              enumerable: originalEnumerable,
              configurable: originalConfigurable,
            });
          } else {
            Object.defineProperty(type === 'static' ? klass : klass.prototype, property, {
              get: newGetter || originalGetter,
              set: newSetter || originalSetter,
              enumerable: originalEnumerable,
              configurable: originalConfigurable,
            });
          }
        }
      });
    });

    return klass;
  };
}

export default OverrideOrDefine;
