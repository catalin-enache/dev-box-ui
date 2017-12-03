'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clearCurrentSelection() {
  window.getSelection && window.getSelection().removeAllRanges();
}

class DisableSelection extends _react2.default.PureComponent {

  constructor(props) {
    super(props);

    this.disableSelection = this.disableSelection.bind(this);
    this.killSelection = this.killSelection.bind(this);
    this.enableSelection = this.enableSelection.bind(this);
  }

  get selectionEvent() {
    // selectstart || mousemove
    return document.onselectstart !== undefined ? 'selectstart' : 'mousemove';
  }

  killSelection(e) {
    switch (e.type) {
      case 'selectstart':
        e.preventDefault();
        break;
      case 'mousemove':
        clearCurrentSelection();
        break;
      default:
      // pass
    }
  }

  disableSelection() {
    // first clear any current selection
    clearCurrentSelection();

    // then disable further selection

    // 1. by style
    document.body.style.MozUserSelect = 'none';
    document.body.style.WebkitUserSelect = 'none';
    document.body.style.userSelect = 'none';

    // 2. by adding event listeners
    const evt = this.selectionEvent;
    document.addEventListener(evt, this.killSelection, false);
    document.addEventListener('mouseup', this.enableSelection, false);
    document.addEventListener('touchend', this.enableSelection, false);
  }

  enableSelection() {
    // 1. by style
    document.body.style.MozUserSelect = null;
    document.body.style.WebkitUserSelect = null;
    document.body.style.userSelect = null;

    // 2. by removing event listeners
    const evt = this.selectionEvent;
    document.removeEventListener(evt, this.killSelection, false);
    document.removeEventListener('mouseup', this.enableSelection, false);
    document.removeEventListener('touchend', this.enableSelection, false);
  }

  render() {
    return _react2.default.createElement(
      'div',
      {
        onMouseDown: this.disableSelection,
        onTouchStart: this.disableSelection
      },
      this.props.children
    );
  }

}

exports.default = DisableSelection;
DisableSelection.propTypes = {
  children: _propTypes2.default.element
};