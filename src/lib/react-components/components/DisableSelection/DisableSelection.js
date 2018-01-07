import React from 'react';
import PropTypes from 'prop-types';

function clearCurrentSelection() {
  window.getSelection && window.getSelection().removeAllRanges();
}

export default class DisableSelection extends React.PureComponent {

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
    return (
      <div
        onMouseDown={this.disableSelection}
        onTouchStart={this.disableSelection}
      >{this.props.children}</div>
    );
  }

}

DisableSelection.propTypes = {
  children: PropTypes.element
};

