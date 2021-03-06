'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// import onScreenConsole from '../utils/onScreenConsole';

const _cssDisableSelection = node => {
  node.style.cursor = 'default';
  node.style.MozUserSelect = 'none';
  node.style.WebkitUserSelect = 'none';
  node.style.MsUserSelect = 'none';
  node.style.userSelect = 'none';
};

const _cssEnableSelection = node => {
  node.style.cursor = 'auto';
  node.style.MozUserSelect = null;
  node.style.WebkitUserSelect = null;
  node.style.MsUserSelect = null;
  node.style.userSelect = null;
};

const _jsDisableSelection = node => {
  node.addEventListener('mousemove', _killSelection);
  node.addEventListener('touchmove', _killSelection);
  node.addEventListener('mouseup', _enableSelection);
  node.addEventListener('touchend', _enableSelection);
  node.addEventListener('touchcancel', _enableSelection);
};

const _jsEnableSelection = node => {
  node.removeEventListener('mousemove', _killSelection);
  node.removeEventListener('touchmove', _killSelection);
  node.removeEventListener('mouseup', _enableSelection);
  node.removeEventListener('touchend', _enableSelection);
  node.removeEventListener('touchcancel', _enableSelection);
};

const _killSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  const win = doc.defaultView;
  switch (e.type) {
    case 'mousemove':
    case 'touchmove':
      win.getSelection && win.getSelection().removeAllRanges();
      break;
    default:
    // pass
  }
};

const _disableSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  const win = doc.defaultView;
  // first clear any current selection
  win.getSelection && win.getSelection().removeAllRanges();
  // then disable further selection
  // 1. by style
  _cssDisableSelection(doc.body);
  // 2. by adding event listeners
  _jsDisableSelection(doc);
};

const _enableSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  // enable further selection
  // 1. by style
  _cssEnableSelection(doc.body);
  // 2. by removing event listeners
  _jsEnableSelection(doc);
};

const _handleTapStart = e => {
  // on tablet e.preventDefault() prevents
  // - selection,
  // - tap-highlight,
  // - triggering/doubling corresponding mouse events.
  e.preventDefault(); // css doubled: -webkit-tap-highlight-color:rgba(0,0,0,0);
  _disableSelection(e);
};

const disableSelection = node => {
  // onScreenConsole();
  _cssDisableSelection(node);
  node.addEventListener('touchstart', _handleTapStart);
  node.addEventListener('mousedown', _handleTapStart);
};

const enableSelection = node => {
  _cssEnableSelection(node);
  node.removeEventListener('touchstart', _handleTapStart);
  node.removeEventListener('mousedown', _handleTapStart);
};

exports.default = {
  disableSelection,
  enableSelection
};