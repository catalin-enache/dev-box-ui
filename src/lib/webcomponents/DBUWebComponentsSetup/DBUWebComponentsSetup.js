import appendStyle from '../internals/appendStyle';

export default function dbuWebComponentsSetUp(win) {
  return {
    appendStyle: appendStyle(win)
  };
}
