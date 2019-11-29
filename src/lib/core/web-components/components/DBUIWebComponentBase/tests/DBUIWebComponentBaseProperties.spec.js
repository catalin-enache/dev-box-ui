import { expect } from 'chai';
import getDBUIWebComponentBase from '../DBUIWebComponentBase';
import {
  checkValueType, getConverters
} from '../helpers/propertiesAndAttributes.helpers';
import ensureSingleRegistration from '../../../../internals/ensureSingleRegistration';
import inIframe from '../../../../../../../testUtils/inIframe';
import monkeyPatch from '../../../../../../../testUtils/monkeyPatch';

function getDummyX(
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

const baseObservedAttributes = ['dbui-web-component', 'dir', 'dbui-dir', 'lang', 'dbui-lang', 'unselectable'];

describe.only('DBUIWebComponentBase properties and attributes', () => {
  describe('getConverters', () => {
    it('returns an object with toProperty and toAttribute properties', () => {
      class A {
        constructor(arg) {
          this._arg = arg.split(' ').map(Number);
        }
        toString() {
          return this._arg.join(' ');
        }
      }

      const booleanConverter = getConverters(Boolean);
      const classConverter = getConverters(A);
      const stringConverter = getConverters(String);

      const numberConverter = getConverters(Number);
      const arrayConverter = getConverters(Array);
      const objectConverter = getConverters(Object);

      const mapConverter = getConverters(Map);
      const setConverter = getConverters(Set);

      expect(booleanConverter.toProperty(null)).to.equal(false);
      expect(booleanConverter.toProperty('x')).to.equal('x');
      expect(booleanConverter.toProperty('')).to.equal(true);

      expect(classConverter.toProperty(null)).to.equal(null);
      expect(classConverter.toAttribute(null)).to.equal(null);
      expect(classConverter.toProperty('1 2')._arg).to.deep.equal([1, 2]);
      expect(classConverter.toProperty('1 2') instanceof A).to.equal(true);
      expect(classConverter.toAttribute(new A('1 2'))).to.equal('1 2');

      expect(stringConverter.toProperty(null)).to.equal(null);
      expect(stringConverter.toAttribute(null)).to.equal(null);
      expect(stringConverter.toAttribute(5)).to.equal('5');
      expect(stringConverter.toAttribute([])).to.equal('');
      expect(stringConverter.toProperty('5')).to.equal('5');

      expect(numberConverter.toAttribute(null)).to.equal(null);
      expect(numberConverter.toProperty(null)).to.equal(null);
      expect(numberConverter.toProperty('0')).to.equal(0);
      expect(numberConverter.toProperty('x')).to.equal('x');
      expect(Number.isNaN(numberConverter.toProperty(NaN))).to.equal(true);
      expect(numberConverter.toAttribute(0)).to.equal('0');

      expect(arrayConverter.toProperty(null)).to.equal(null);
      expect(arrayConverter.toAttribute(null)).to.equal(null);
      expect(arrayConverter.toProperty('[1,2]')).to.deep.equal([1, 2]);
      expect(arrayConverter.toAttribute([1, 2])).to.equal('[1,2]');

      expect(objectConverter.toProperty(null)).to.equal(null);
      expect(objectConverter.toAttribute(null)).to.equal(null);
      expect(objectConverter.toProperty('{"a": 1}')).to.deep.equal({ a: 1 });
      expect(objectConverter.toAttribute({ a: 1 })).to.equal('{"a":1}');

      expect(mapConverter.toProperty(null)).to.equal(null);
      expect(mapConverter.toAttribute(null)).to.equal(null);
      expect(mapConverter.toProperty('[["a",1]]').get('a')).to.equal(1);
      expect(mapConverter.toAttribute(new Map([['a', 1]]))).to.equal('[["a",1]]');

      expect(setConverter.toProperty(null)).to.equal(null);
      expect(setConverter.toAttribute(null)).to.equal(null);
      expect(setConverter.toProperty('[2]').has(2)).to.equal(true);
      expect(setConverter.toAttribute(new Set([2]))).to.equal('[2]');
    });
  });

  describe('checkValueType', () => {
    it('returns true when value matches type else false', () => {
      class A {}
      class B extends A {}
      class C extends Array {}
      expect(checkValueType(null, Number)).to.equal(true);
      expect(checkValueType(false, Boolean)).to.equal(true);
      expect(checkValueType(0, Boolean)).to.equal(false);
      expect(checkValueType('', Boolean)).to.equal(false);
      expect(checkValueType(0, Number)).to.equal(true);
      expect(checkValueType('0', Number)).to.equal(false);
      expect(checkValueType('0', String)).to.equal(true);
      expect(checkValueType([], String)).to.equal(false);
      expect(checkValueType([], Array)).to.equal(true);
      expect(checkValueType(new C(), Array)).to.equal(true);
      expect(checkValueType({}, Array)).to.equal(false);
      expect(checkValueType({}, Object)).to.equal(true);
      expect(checkValueType([], Object)).to.equal(false);
      expect(checkValueType(new B(), A)).to.equal(true);
      expect(checkValueType(new A(), B)).to.equal(false);
      expect(checkValueType(new Map(), Map)).to.equal(true);
      expect(checkValueType(new Map(), Set)).to.equal(false);
    });
  });

  describe('properties and attributes are type checked', () => {
    it('are type checked when set as default properties', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          class PropClass {}
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: '0' },
              str: { type: String, attribute: true, defaultValue: 0 },
              bool: { type: Boolean, attribute: true, defaultValue: 'none' },
              obj: { type: Object, attribute: true, defaultValue: [] },
              arr: { type: Array, attribute: true, defaultValue: {} },
              propClass: { type: PropClass, attribute: true, defaultValue: false }
            }
          })(contentWindow);

          const thrownErrors = [];

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {});

          DBUIDummy.throwError = (msg) => thrownErrors.push(msg);
          DBUIDummy.registerSelf();

          expect(thrownErrors).to.deep.equal([
            'Invalid value 0 for num property.',
            'Invalid value 0 for str property.',
            'Invalid value none for bool property.',
            'Invalid value  for obj property.',
            'Invalid value [object Object] for arr property.',
            'Invalid value false for propClass property.'
          ]);

          iframe.remove();
          done();
        }
      });
    });

    it('are type checked when set as attributes at definition time before upgrade', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy num="x"></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const thrownExceptions = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 }
            }
          })(contentWindow);

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {});

          DBUIDummy.throwError = (msg) => { thrownExceptions.push(msg); };
          DBUIDummy.registerSelf();

          expect(thrownExceptions).to.deep.equal([
            'Invalid value x for num property.'
          ]);

          iframe.remove();
          done();
        }
      });
    });

    it('are type checked when set as attributes at runtime before upgrade', (done) => {
      inIframe({
        bodyHTML: `
        <div id="container"></div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const thrownExceptions = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 }
            }
          })(contentWindow);

          const container = contentWindow.document.querySelector('#container');

          DBUIDummy.throwError = (msg) => { thrownExceptions.push(msg); };
          container.innerHTML = '<dbui-dummy></dbui-dummy>';
          const dummy = container.querySelector('dbui-dummy');
          dummy.setAttribute('num', 'x');

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {});

          DBUIDummy.registerSelf();

          expect(thrownExceptions).to.deep.equal([
            'Invalid value x for num property.'
          ]);
          iframe.remove();
          done();
        }
      });
    });

    it('are type checked when set as attributes at definition time after upgrade', (done) => {
      inIframe({
        bodyHTML: `
        <div id="container"></div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const thrownExceptions = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 }
            }
          })(contentWindow);


          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
            const container = contentWindow.document.querySelector('#container');

            DBUIDummy.throwError = (msg) => { thrownExceptions.push(msg); };
            container.innerHTML = '<dbui-dummy num="x"></dbui-dummy>';

            expect(thrownExceptions).to.deep.equal([
              'Invalid value x for num property.'
            ]);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummy.registerSelf();
        }
      });
    });

    it('are type checked when set as attributes at runtime after upgrade', (done) => {
      inIframe({
        bodyHTML: `
        <div id="container"></div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const thrownExceptions = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 }
            }
          })(contentWindow);


          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
            const container = contentWindow.document.querySelector('#container');

            DBUIDummy.throwError = (msg) => { thrownExceptions.push(msg); };
            container.innerHTML = '<dbui-dummy></dbui-dummy>';
            const dummy = container.querySelector('dbui-dummy');
            dummy.setAttribute('num', 'x');

            expect(thrownExceptions).to.deep.equal([
              'Invalid value x for num property.'
            ]);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummy.registerSelf();
        }
      });
    });

    it('are type checked when set as property at runtime before upgrade', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const thrownExceptions = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 }
            }
          })(contentWindow);
          DBUIDummy.throwError = (msg) => { thrownExceptions.push(msg); };

          const dummy = contentWindow.document.querySelector('dbui-dummy');
          dummy.num = 'y';

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {});

          DBUIDummy.registerSelf();

          expect(thrownExceptions).to.deep.equal([
            'Invalid value y for num property.'
          ]);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        }
      });
    });

    it('are type checked when set as property at runtime after upgrade', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const thrownExceptions = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 }
            }
          })(contentWindow);
          DBUIDummy.throwError = (msg) => { thrownExceptions.push(msg); };

          const dummy = contentWindow.document.querySelector('dbui-dummy');

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {

            dummy.num = 'y';
            expect(thrownExceptions).to.deep.equal([
              'Invalid value y for num property.'
            ]);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummy.registerSelf();
        }
      });
    });

  }); // END describe('properties and attributes are type checked')

  describe('properties and attributes are checked against allowedValues', () => {
    it('default values for properties are checked against allowedValues', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const thrownExceptions = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: {
                type: Number, defaultValue: -1,
                allowedValues({ value }) { return value > 0; }
              },
              bool: {
                type: Boolean, defaultValue: false,
                allowedValues({ value }) { return value === true; }
              }
            }
          })(contentWindow);
          DBUIDummy.throwError = (msg) => { thrownExceptions.push(msg); };

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {});

          DBUIDummy.registerSelf();

          expect(thrownExceptions).to.deep.equal([
            'Invalid value -1 for num property.',
            'Invalid value false for bool property.'
          ]);

          iframe.remove();
          done();
        }
      });
    });

    it('non default values for properties and attributes are checked against allowedValues', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy-1></dbui-dummy-1>
        <dbui-dummy-2></dbui-dummy-2>
        <dbui-dummy-3></dbui-dummy-3>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const thrownExceptions = [];
          const DBUIDummyOne = getDummyX('dbui-dummy-1', 'DBUIDummyOne', {
            properties: {
              num: {
                type: Number, defaultValue: 1, attribute: true,
                allowedValues({ value }) { return value > 0; }
              }
            }
          })(contentWindow);
          const DBUIDummyTwo = getDummyX('dbui-dummy-2', 'DBUIDummyTwo', {
            properties: {
              obj: {
                type: Object, defaultValue: { a: 1 }, attribute: true,
                allowedValues({ value }) { return value.a !== undefined; }
              }
            }
          })(contentWindow);
          const DBUIDummyThree = getDummyX('dbui-dummy-3', 'DBUIDummyThree', {
            properties: {
              bool: {
                type: Boolean, defaultValue: true, attribute: true,
                allowedValues({ value }) { return value === true; } // makes it un-removable
              }
            }
          })(contentWindow);
          DBUIDummyOne.throwError = (msg) => { thrownExceptions.push(msg); };
          DBUIDummyTwo.throwError = (msg) => { thrownExceptions.push(msg); };
          DBUIDummyThree.throwError = (msg) => { thrownExceptions.push(msg); };

          const dummyOne = contentWindow.document.querySelector('dbui-dummy-1');
          const dummyTwo = contentWindow.document.querySelector('dbui-dummy-2');
          const dummyThree = contentWindow.document.querySelector('dbui-dummy-3');

          contentWindow.customElements.whenDefined(DBUIDummyThree.registrationName).then(() => {
            dummyThree.removeAttribute('bool');
            dummyOne.num = -1;
            dummyTwo.setAttribute('obj', '{"b":2}');
            expect(thrownExceptions).to.deep.equal([
              'Invalid value false for bool property.',
              'Invalid value -1 for num property.',
              'Invalid value [object Object] for obj property.'
            ]);
            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummyOne.registerSelf();
          DBUIDummyTwo.registerSelf();
          DBUIDummyThree.registerSelf();
        }
      });
    });

  }); // END describe('attributes and properties are checked against allowedValues')

  it('default values are enforced at registration time', (done) => {
    inIframe({
      bodyHTML: `
      <dbui-dummy></dbui-dummy>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
          properties: {
            bool: { type: Boolean, attribute: true },
          }
        })(contentWindow);
        const thrownErrors = [];

        try {
          DBUIDummy.registerSelf();
        } catch (err) {
          thrownErrors.push(err.message);
        }

        expect(thrownErrors).to.deep.equal(['Default value for bool was not provided.']);

        iframe.remove();
        done();
      }
    });
  });

  it('property is added to observedAttributes when attribute is true or specified', (done) => {
    inIframe({
      bodyHTML: `
      <dbui-dummy></dbui-dummy>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        class PropClass {}
        const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
          properties: {
            num: { type: Number, attribute: 'num-ber', defaultValue: 0 },
            str: { type: String, attribute: true, defaultValue: '' },
            bool: { type: Boolean, attribute: true, defaultValue: true },
            obj: { type: Object, attribute: true, defaultValue: {} },
            arr: { type: Array, attribute: true, defaultValue: [] },
            propClass: { type: PropClass, attribute: true, defaultValue: new PropClass() }
          }
        })(contentWindow);

        contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DBUIDummy.registerSelf();
        expect(DBUIDummy.observedAttributes).to.deep.equal([
          ...baseObservedAttributes,
          'num-ber', 'str', 'bool', 'obj', 'arr', 'propClass'
        ]);
      }
    });
  });

  it(`
  properties can be set/unset directly or via attributes when attribute is truthy in properties
  `, (done) => {
    inIframe({
      bodyHTML: `
      <dbui-dummy></dbui-dummy>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        class PropClass { constructor(p) { this._p = +p; } toString() { return this._p.toString(); } }
        const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
          properties: {
            num: { type: Number, attribute: 'num-ber', defaultValue: null },
            str: { type: String, attribute: true, defaultValue: null },
            bool: { type: Boolean, attribute: true, defaultValue: null },
            obj: { type: Object, attribute: true, defaultValue: null },
            arr: { type: Array, attribute: true, defaultValue: null },
            propClass: { type: PropClass, attribute: 'prop-class', defaultValue: null },
            map: { type: Map, attribute: true, defaultValue: new Map([['a', 1]]) },
            set: { type: Set, attribute: true, defaultValue: new Set([1]) }
          }
        })(contentWindow);

        contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
          const dummy = contentWindow.document.querySelector('dbui-dummy');

          // Testing Number
          dummy.num = 1;
          expect(dummy.num).to.equal(1);
          expect(dummy.getAttribute('num-ber')).to.equal('1');
          dummy.setAttribute('num-ber', '2');
          expect(dummy.num).to.equal(2);
          expect(dummy.getAttribute('num-ber')).to.equal('2');
          dummy.num = undefined;
          expect(dummy.num).to.equal(null);
          expect(dummy.hasAttribute('num-ber')).to.equal(false);
          dummy.num = 1;
          expect(dummy.num).to.equal(1);
          expect(dummy.getAttribute('num-ber')).to.equal('1');
          dummy.removeAttribute('num-ber');
          expect(dummy.num).to.equal(null);
          expect(dummy.hasAttribute('num-ber')).to.equal(false);

          // Testing String
          dummy.str = 'x';
          expect(dummy.str).to.equal('x');
          expect(dummy.getAttribute('str')).to.equal('x');
          dummy.setAttribute('str', 'y');
          expect(dummy.str).to.equal('y');
          expect(dummy.getAttribute('str')).to.equal('y');
          dummy.str = undefined;
          expect(dummy.str).to.equal(null);
          expect(dummy.hasAttribute('str')).to.equal(false);
          dummy.str = 'z';
          expect(dummy.str).to.equal('z');
          expect(dummy.getAttribute('str')).to.equal('z');
          dummy.removeAttribute('str');
          expect(dummy.str).to.equal(null);
          expect(dummy.hasAttribute('str')).to.equal(false);

          // Testing Boolean
          dummy.bool = false;
          expect(dummy.bool).to.equal(false);
          expect(dummy.hasAttribute('bool')).to.equal(false);
          dummy.setAttribute('bool', '');
          expect(dummy.bool).to.equal(true);
          expect(dummy.getAttribute('bool')).to.equal('');
          dummy.bool = undefined;
          expect(dummy.bool).to.equal(false);
          expect(dummy.hasAttribute('bool')).to.equal(false);
          dummy.bool = true;
          expect(dummy.bool).to.equal(true);
          expect(dummy.getAttribute('bool')).to.equal('');
          dummy.removeAttribute('bool');
          expect(dummy.bool).to.equal(false);
          expect(dummy.hasAttribute('str')).to.equal(false);

          // Testing Object
          const obj1 = { a: 1 };
          dummy.obj = obj1;
          expect(dummy.obj).to.equal(obj1);
          expect(dummy.getAttribute('obj')).to.equal('{"a":1}');
          dummy.setAttribute('obj', '{"b":2}');
          expect(dummy.obj).to.deep.equal({ b: 2 });
          expect(dummy.getAttribute('obj')).to.equal('{"b":2}');
          dummy.obj = undefined;
          expect(dummy.obj).to.equal(null);
          expect(dummy.hasAttribute('obj')).to.equal(false);
          dummy.obj = obj1;
          expect(dummy.obj).to.equal(obj1);
          expect(dummy.getAttribute('obj')).to.equal('{"a":1}');
          dummy.removeAttribute('obj');
          expect(dummy.obj).to.equal(null);
          expect(dummy.hasAttribute('obj')).to.equal(false);

          // Testing Array
          const arr1 = [{ a: 1 }];
          dummy.arr = arr1;
          expect(dummy.arr).to.equal(arr1);
          expect(dummy.getAttribute('arr')).to.equal('[{"a":1}]');
          dummy.setAttribute('arr', '[1]');
          expect(dummy.arr).to.deep.equal([1]);
          expect(dummy.getAttribute('arr')).to.equal('[1]');
          dummy.arr = undefined;
          expect(dummy.arr).to.equal(null);
          expect(dummy.hasAttribute('arr')).to.equal(false);
          dummy.arr = arr1;
          expect(dummy.arr).to.equal(arr1);
          expect(dummy.getAttribute('arr')).to.equal('[{"a":1}]');
          dummy.removeAttribute('arr');
          expect(dummy.arr).to.equal(null);
          expect(dummy.hasAttribute('arr')).to.equal(false);

          // Testing custom class
          const inst = new PropClass(1);
          dummy.propClass = inst;
          expect(dummy.propClass).to.equal(inst);
          expect(dummy.getAttribute('prop-class')).to.equal('1');
          dummy.setAttribute('prop-class', '2');
          expect(dummy.propClass._p).to.equal(2);
          expect(dummy.getAttribute('prop-class')).to.equal('2');
          dummy.propClass = undefined;
          expect(dummy.propClass).to.equal(null);
          expect(dummy.hasAttribute('prop-class')).to.equal(false);
          dummy.propClass = inst;
          expect(dummy.propClass).to.equal(inst);
          expect(dummy.getAttribute('prop-class')).to.equal('1');
          dummy.removeAttribute('prop-class');
          expect(dummy.propClass).to.equal(null);
          expect(dummy.hasAttribute('prop-class')).to.equal(false);

          // Testing Map
          expect(dummy.getAttribute('map')).to.equal('[["a",1]]');
          const map = new Map([['b', 2]]);
          dummy.map = map;
          expect(dummy.map).to.equal(map);
          expect(dummy.getAttribute('map')).to.equal('[["b",2]]');
          dummy.setAttribute('map', '[["c",3]]');
          expect(dummy.map.get('c')).to.equal(3);
          expect(dummy.getAttribute('map')).to.equal('[["c",3]]');
          dummy.map = undefined;
          expect(dummy.map).to.equal(null);
          expect(dummy.hasAttribute('map')).to.equal(false);
          dummy.map = map;
          expect(dummy.map).to.equal(map);
          expect(dummy.getAttribute('map')).to.equal('[["b",2]]');
          dummy.removeAttribute('map');
          expect(dummy.map).to.equal(null);
          expect(dummy.hasAttribute('map')).to.equal(false);

          // Testing Set
          expect(dummy.getAttribute('set')).to.equal('[1]');
          const set = new Set([2]);
          dummy.set = set;
          expect(dummy.set).to.equal(set);
          expect(dummy.getAttribute('set')).to.equal('[2]');
          dummy.setAttribute('set', '[3]');
          expect(dummy.set.has(3)).to.equal(true);
          expect(dummy.getAttribute('set')).to.equal('[3]');
          dummy.set = undefined;
          expect(dummy.set).to.equal(null);
          expect(dummy.hasAttribute('set')).to.equal(false);
          dummy.set = set;
          expect(dummy.set).to.equal(set);
          expect(dummy.getAttribute('set')).to.equal('[2]');
          dummy.removeAttribute('set');
          expect(dummy.set).to.equal(null);
          expect(dummy.hasAttribute('set')).to.equal(false);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DBUIDummy.registerSelf();
      }
    });
  });

  it(`
  Attribute set at definition time before upgrade overrides default value. And
  Property defined before upgrade override default value AND attribute set at definition time.
  `, (done) => {
    inIframe({
      bodyHTML: `
      <dbui-dummy id="one" num1="1" num2="1"></dbui-dummy>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        let onConnectedCallbackCalled = false;
        let onPropertyChangedCallbackCalled = false;
        const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
          properties: {
            num1: { type: Number, attribute: true, defaultValue: 0 },
            num2: { type: Number, attribute: true, defaultValue: 0 },
            num3: { type: Number, attribute: true, defaultValue: 0 },
            num4: { type: Number, attribute: true, defaultValue: 0 }
          },
          callbacks: {
            onConnectedCallback: () => {
              onConnectedCallbackCalled = true;
            },
            onPropertyChangedCallback: () => {
              onPropertyChangedCallbackCalled = true;
            }
          }
        })(contentWindow);
        const one = contentWindow.document.querySelector('#one');
        one.num2 = 2;
        one.num3 = 2;

        contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
          expect(one.getAttribute('num1')).to.equal('1'); // from attribute
          expect(one.getAttribute('num2')).to.equal('2'); // from property
          expect(one.getAttribute('num3')).to.equal('2'); // from property
          expect(one.getAttribute('num4')).to.equal('0'); // from default
          expect(one.num1).to.equal(1);
          expect(one.num2).to.equal(2);
          expect(one.num3).to.equal(2);
          expect(one.num4).to.equal(0);

          expect(onConnectedCallbackCalled).to.equal(true);
          expect(onPropertyChangedCallbackCalled).to.equal(false);
          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DBUIDummy.registerSelf();
      }
    });

  });

  describe('onPropertyChangedCallback', () => {

    it('is NOT fired for default properties (even if they were overridden before upgrade)', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy id="one" num="1"></dbui-dummy>
        <dbui-dummy id="two" num="1"></dbui-dummy>
        <dbui-dummy id="three"></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const onConnectedCallbackCalled = [];
          let onPropertyChangedCallbackCalled = false;
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 },
              str: { type: String, attribute: true, defaultValue: 'x' },
            },
            callbacks: {
              onConnectedCallback: () => {
                onConnectedCallbackCalled.push(true);
              },
              onPropertyChangedCallback: () => {
                onPropertyChangedCallbackCalled = true;
              }
            }
          })(contentWindow);
          const one = contentWindow.document.querySelector('#one');
          const two = contentWindow.document.querySelector('#two');
          const three = contentWindow.document.querySelector('#three');
          two.num = 2;

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
            expect(one.getAttribute('num')).to.equal('1'); // from attribute
            expect(one.getAttribute('str')).to.equal('x');
            expect(one.num).to.equal(1);
            expect(one.str).to.equal('x');
            expect(two.getAttribute('num')).to.equal('2'); // from property
            expect(two.getAttribute('str')).to.equal('x');
            expect(two.num).to.equal(2);
            expect(two.str).to.equal('x');
            expect(three.getAttribute('num')).to.equal('0'); // default
            expect(three.getAttribute('str')).to.equal('x');
            expect(three.num).to.equal(0);
            expect(three.str).to.equal('x');
            expect(onConnectedCallbackCalled.length).to.equal(3);
            expect(onPropertyChangedCallbackCalled).to.equal(false);
            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummy.registerSelf();
        }
      });

    });

    it(`
    is fired for attributes or properties changes at runtime ONLY when component is mounted.
    Attributes or properties changed while detached will be visible onConnectedCallback.
    `, (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          let onConnectedCallbackCalled = null;
          const onPropertyChangedCallback = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 },
              str: { type: String, attribute: true, defaultValue: 'x' },
            },
            callbacks: {
              onConnectedCallback: (self) => {
                onConnectedCallbackCalled = { num: self.num, str: self.str };
              },
              onPropertyChangedCallback: (self, name, oldValue, newValue) => {
                onPropertyChangedCallback.push({ name, oldValue, newValue });
              }
            }
          })(contentWindow);
          const dummy = contentWindow.document.querySelector('dbui-dummy');
          dummy.num = 1;

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
            expect(dummy.getAttribute('num')).to.equal('1');
            expect(dummy.getAttribute('str')).to.equal('x');
            expect(onConnectedCallbackCalled).to.deep.equal({ num: 1, str: 'x' });
            expect(onPropertyChangedCallback.length).to.equal(0);

            dummy.num = 2;
            expect(onPropertyChangedCallback.length).to.equal(1);
            expect(onPropertyChangedCallback[0]).to.deep.equal({ name: 'num', oldValue: 1, newValue: 2 });

            const dummyParent = dummy.parentElement;
            dummy.remove();
            dummy.str = 'w';
            expect(dummy.str).to.equal('w');
            expect(dummy.getAttribute('str')).to.equal('w');

            dummy.setAttribute('str', 'y');
            expect(dummy.str).to.equal('y');
            expect(dummy.getAttribute('str')).to.equal('y');

            // no attribute change event
            expect(onPropertyChangedCallback.length).to.equal(1);

            dummyParent.appendChild(dummy);

            // still no attribute change event
            expect(onPropertyChangedCallback.length).to.equal(1);
            // changes are reflected at connection time
            expect(onConnectedCallbackCalled).to.deep.equal({ num: 2, str: 'y' });
            dummy.str = 'z';
            expect(onPropertyChangedCallback.length).to.equal(2);
            expect(onPropertyChangedCallback[1]).to.deep.equal({ name: 'str', oldValue: 'y', newValue: 'z' });

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummy.registerSelf();
        }
      });
    });

    it('allows client to change other properties', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const onPropertyChangedCallbacks = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 },
              str: { type: String, attribute: true, defaultValue: 'x' },
            },
            callbacks: {
              onPropertyChangedCallback: (self, name, oldValue, newValue) => {
                onPropertyChangedCallbacks.push({ name, oldValue, newValue });
                if (name === 'num') {
                  self.str = newValue.toString();
                }
              }
            }
          })(contentWindow);

          const dummy = contentWindow.document.querySelector('dbui-dummy');

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
            dummy.num = 1;
            expect(onPropertyChangedCallbacks).to.deep.equal([
              { name: 'num', oldValue: 0, newValue: 1 },
              { name: 'str', oldValue: 'x', newValue: '1' },
            ]);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummy.registerSelf();
        }
      });
    });

  });

  describe('onConnectedCallback', () => {

    it('ensures that all properties and attributes defined before upgrade ARE available', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          let onConnectedCallbackCalled = null;
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 },
              str: { type: String, attribute: true, defaultValue: 'x' },
            },
            callbacks: {
              onConnectedCallback: (self) => {
                onConnectedCallbackCalled = { num: self.num, str: self.str };
              }
            }
          })(contentWindow);
          const dummy = contentWindow.document.querySelector('dbui-dummy');
          dummy.num = 1;

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
            expect(dummy.getAttribute('num')).to.equal('1');
            expect(dummy.getAttribute('str')).to.equal('x');
            expect(onConnectedCallbackCalled).to.deep.equal({ num: 1, str: 'x' });
            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummy.registerSelf();
        }
      });
    });

  });

  describe('custom converters', () => {
    it('toProperty & toAttribute if defined take precedence over default ones', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const onPropertyChangedCallbackCalls = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 1,
                toProperty: (attr) => {
                  return +attr * 2;
                },
                toAttribute: (prop) => {
                  return (prop * 2).toString();
                }
              },
            },
            callbacks: {
              onPropertyChangedCallback: (self, name, oldValue, newValue) => {
                onPropertyChangedCallbackCalls.push({ name, oldValue, newValue });
              }
            }
          })(contentWindow);
          const dummy = contentWindow.document.querySelector('dbui-dummy');

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {

            expect(dummy.num).to.equal(1);
            expect(dummy.getAttribute('num')).to.equal('2');

            dummy.num = 2;

            expect(dummy.num).to.equal(2);
            expect(dummy.getAttribute('num')).to.equal('4');
            expect(onPropertyChangedCallbackCalls[0].newValue).to.equal(2);

            dummy.setAttribute('num', '3');

            expect(dummy.getAttribute('num')).to.equal('3');
            expect(dummy.num).to.equal(6);
            expect(onPropertyChangedCallbackCalls[1].newValue).to.equal(6);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIDummy.registerSelf();
        }
      });
    });
  });

  describe('_propertyOrAttributeChangeLock', () => {
    it('setter is not triggered again (by attribute change) when property was updated', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const onPropertyChangedCallbackCalls = [];
          const setterCalls = [];
          const attributeCalls = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 },
            },
            callbacks: {
              onPropertyChangedCallback: (self, name, oldValue, newValue) => {
                onPropertyChangedCallbackCalls.push({ name, oldValue, newValue });
              }
            }
          })(contentWindow);

          const dummy = contentWindow.document.querySelector('dbui-dummy');

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
            dummy.num = 1;
            expect(onPropertyChangedCallbackCalls.length).to.equal(1);
            expect(setterCalls.length).to.equal(1);
            expect(attributeCalls.length).to.equal(1);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);

          });

          DBUIDummy.registerSelf();

          monkeyPatch(DBUIDummy).proto.set('_onAttributeChangedCallback', (getSuperDescriptor) => {
            return {
              writable: true,
              value(...args) {
                attributeCalls.push(args);
                getSuperDescriptor().value.apply(this, args);
              },
              enumerable: true,
              configurable: true
            };
          });

          monkeyPatch(DBUIDummy).proto.set('num', (getSuperDescriptor) => {
            return {
              get() {
                const superDescriptor = getSuperDescriptor();
                return superDescriptor.get.call(this);
              },
              set(value) {
                setterCalls.push(value);
                const superDescriptor = getSuperDescriptor();
                return superDescriptor.set.call(this, value);
              },
              enumerable: true,
              configurable: true
            };
          });
        }
      });
    });

    it('attributeChangedCallback is not triggered again (by setter change) when attribute was updated', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const onPropertyChangedCallbackCalls = [];
          const setterCalls = [];
          const attributeCalls = [];
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 },
            },
            callbacks: {
              onPropertyChangedCallback: (self, name, oldValue, newValue) => {
                onPropertyChangedCallbackCalls.push({ name, oldValue, newValue });
              }
            }
          })(contentWindow);

          const dummy = contentWindow.document.querySelector('dbui-dummy');

          contentWindow.customElements.whenDefined(DBUIDummy.registrationName).then(() => {
            dummy.setAttribute('num', '1');
            expect(onPropertyChangedCallbackCalls.length).to.equal(1);
            expect(setterCalls.length).to.equal(1);
            expect(attributeCalls.length).to.equal(1);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);

          });

          DBUIDummy.registerSelf();

          monkeyPatch(DBUIDummy).proto.set('_onAttributeChangedCallback', (getSuperDescriptor) => {
            return {
              writable: true,
              value(...args) {
                attributeCalls.push(args);
                getSuperDescriptor().value.apply(this, args);
              },
              enumerable: true,
              configurable: true
            };
          });

          monkeyPatch(DBUIDummy).proto.set('num', (getSuperDescriptor) => {
            return {
              get() {
                const superDescriptor = getSuperDescriptor();
                return superDescriptor.get.call(this);
              },
              set(value) {
                setterCalls.push(value);
                const superDescriptor = getSuperDescriptor();
                return superDescriptor.set.call(this, value);
              },
              enumerable: true,
              configurable: true
            };
          });
        }
      });
    });

  });

  describe('noAccessor', () => {
    it('does not set accessors when set to true', (done) => {
      inIframe({
        bodyHTML: `
        <dbui-dummy></dbui-dummy>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          let numGetCalls = 0;
          let numSetCalls = 0;
          const DBUIDummy = getDummyX('dbui-dummy', 'DBUIDummy', {
            properties: {
              num: { type: Number, attribute: true, defaultValue: 0 },
            },
            callbacks: {}
          })(contentWindow);
          class DerivedDummy extends DBUIDummy {
            // eslint-disable-next-line
            set num(_) {
              numGetCalls += 1;
            }
            get num() {
              numSetCalls += 1;
              return 100;
            }
          }
          class DerivedDummy2 extends DerivedDummy {
            static get properties() {
              return {
                ...super.properties,
                num: { ...super.properties.num, noAccessor: true }
              };
            }
          }

          const dummy = contentWindow.document.querySelector('dbui-dummy');

          contentWindow.customElements.whenDefined(DerivedDummy2.registrationName).then(() => {
            expect(dummy.num).to.equal(100);
            expect(dummy.constructor.name).to.equal('DerivedDummy2');
            expect(numGetCalls > 0).to.equal(true);
            expect(numSetCalls > 0).to.equal(true);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DerivedDummy2.registerSelf();
        }
      });
    });
  });

});
