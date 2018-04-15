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
