/*
examples:
1.
monkeyPatch(Klass).proto.set('someMethod', (getSuperDescriptor) => {
  return {
    writable: true,
    value(arg1, argN) {
      getSuperDescriptor().value.call(this, arg1, argN);
      // define here some new behavior
    }
  };
});

2.a
function setGetter(klass, prop, cb) {
  return monkeyPatch(klass).set(prop, (getSuperDescriptor) => {
    return {
      get() {
        const superDescriptor = getSuperDescriptor();
        return [
          ...(superDescriptor ? superDescriptor.get() : []),
          ...(cb(superDescriptor))
        ];
      }
    };
  });
}
2.b
setGetter(Base, 'staticMethod', () => {
  return ['color1', 'color2', 'color4', 'counter1', 'counter2'];
});
*/
// TODO: unit-test this
const monkeyPatch = (klass) => {
  const set = ({ proto } = {}) => (prop, callback) => {
    const selfDescriptor = Object.getOwnPropertyDescriptor(proto ? klass.prototype : klass, prop);

    const getSuperDescriptor = () => {
      let closestDescriptor = null;

      if (!selfDescriptor) {
        let superKlass = Object.getPrototypeOf(klass);
        closestDescriptor = superKlass && Object.getOwnPropertyDescriptor(proto ? superKlass.prototype : superKlass, prop);

        while (!closestDescriptor) {
          superKlass = Object.getPrototypeOf(superKlass);
          closestDescriptor = superKlass && Object.getOwnPropertyDescriptor(proto ? superKlass.prototype : superKlass, prop);
        }
      }

      return selfDescriptor || closestDescriptor;
    };

    Object.defineProperty(proto ? klass.prototype : klass, prop, {
      configurable: true,
      ...callback(getSuperDescriptor)
    });

    return () => {
      // reset
      if (!selfDescriptor) {
        if (proto) {
          delete klass.prototype[prop];
        } else {
          delete klass[prop];
        }
      } else {
        Object.defineProperty(proto ? klass.prototype : klass, prop, selfDescriptor);
      }
    };
  };

  return {
    set: set({ proto: false }),
    proto: {
      set: set({ proto: true })
    }
  };
};

export default monkeyPatch;
