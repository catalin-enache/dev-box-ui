import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import DisableSelection from '../../components/DisableSelection/DisableSelection';

function getMeasurements(node, evt) {
  const nodeComputedStyle = getComputedStyle(node, null);
  const { clientX: startX, clientY: startY } = evt;
  const matrix = nodeComputedStyle.transform.match(/-?\d*\.?\d+/g).map(Number);
  const [transformX, transformY] = [matrix[4], matrix[5]];
  const ret = {
    startX, startY, transformX, transformY
  };
  return ret;
}

class Draggable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.node = null;
    this.measurements = null;
    this.transformX = 0;
    this.transformY = 0;

    this.captureNode = this.captureNode.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.doMove = this.doMove.bind(this);

    this.events = {
      mouse: {
        mousemove: this.handleMouseMove,
        mouseup: this.handleMouseUp
      },
      touch: {
        touchmove: this.handleTouchMove,
        touchend: this.handleTouchEnd,
        touchcancel: this.handleTouchEnd
      }
    };
  }

  captureNode(node) {
    this.node = node;
  }

  registerEvents(type) {
    Object.keys(this.events[type]).forEach((event) => {
      document.addEventListener(event, this.events[type][event], true);
    });
  }

  unregisterEvents(type) {
    Object.keys(this.events[type]).forEach((event) => {
      document.removeEventListener(event, this.events[type][event], true);
    });
  }

  handleMouseDown(evt) {
    this.measurements = getMeasurements(this.node, evt);
    this.registerEvents('mouse');
  }

  handleTouchStart(evt) {
    this.measurements = getMeasurements(this.node, evt.touches[0]);
    this.registerEvents('touch');
  }

  handleMouseUp() {
    this.unregisterEvents('mouse');
  }

  handleTouchEnd() {
    this.unregisterEvents('touch');
  }

  handleMouseMove(evt) {
    evt.preventDefault(); // prevent selection and scrolling inside node
    this.doMove(evt);
  }

  handleTouchMove(evt) {
    evt.preventDefault(); // prevent page scroll
    this.doMove(evt.touches[0]);
  }

  doMove(evt) {
    if (this._dragRunning) { return; }
    this._dragRunning = true;
    requestAnimationFrame(() => {
      if (!this.node) { // might be unmounted meanwhile
        this._dragRunning = false;
        return;
      }

      const {
        startX, startY, transformX, transformY
      } = this.measurements;
      const [distanceX, distanceY] = [evt.clientX - startX, evt.clientY - startY];

      const nextTransformX = transformX + distanceX;
      const nextTransformY = transformY + distanceY;

      this.transformX = nextTransformX;
      this.transformY = nextTransformY;
      this.forceUpdate();
      this._dragRunning = false;
    });
  }

  componentWillUnmount() {
    this.unregisterEvents('mouse');
    this.unregisterEvents('touch');
  }

  render() {
    const { style } = this.props;
    const draggableClassNames = cn({
      'dbu-draggable': true
    });

    return (
      <div
        ref={this.captureNode}
        data-component-id="Draggable"
        className={draggableClassNames}
        onMouseDownCapture={this.handleMouseDown}
        onTouchStartCapture={this.handleTouchStart}
        style={{
          cursor: 'pointer',
          touchAction: 'none',
          transform: `translate(${this.transformX}px,${this.transformY}px)`,
          ...style,
        }}
      ><DisableSelection>{this.props.children}</DisableSelection></div>
    );
  }
}

Draggable.defaultProps = {
};

Draggable.propTypes = {
  children: PropTypes.element,
  style: PropTypes.object
};

export default Draggable;

