import { expect } from 'chai';
import { withLock } from './lock';

describe('withLock', () => {
  it('locks on flag', () => {
    let callbackCalls = 0;
    const target = {};
    const callback1 = () => {
      callbackCalls += 1;
      withLock(target, 'flag', callback1);
    };
    withLock(target, 'flag', callback1);
    expect(callbackCalls).to.equal(1);

    callbackCalls = 0;

    const callback2 = () => {
      callbackCalls += 1;
      withLock(target, 'flag3', callback2);
    };
    withLock(target, 'flag2', callback2);
    expect(callbackCalls).to.equal(2);

    callbackCalls = 0;

    class A {
      a() {
        callbackCalls += 1;
        withLock(this, 'flag', () => {
          this.b();
          this.c();
        });
      }
      b() {
        callbackCalls += 1;
        withLock(this, 'flag', () => {
          this.a();
          this.c();
        });
      }
      c() {
        callbackCalls += 1;
        withLock(this, 'flag', () => {
          this.a();
          this.b();
        });
      }
    }

    const a = new A();
    a.a();

    expect(callbackCalls).to.equal(3);

  });
});
