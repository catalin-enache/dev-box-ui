import appendStyle from '../internals/appendStyle';

export default function dbuiWebComponentsSetUp(win) {
  return {
    appendStyle: appendStyle(win)
  };
}
