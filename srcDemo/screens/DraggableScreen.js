import React from 'react';
import {
  Draggable, DisableSelection
} from 'dev-box-ui';

class ToRender extends React.Component {
  render() {
    // console.log('ToRender#render');
    return (
      <div
        style={{ width: 300, height: 300 }}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onClick={this.props.onClick}
        onTouchStart={this.props.onTouchStart}
        onTouchEnd={this.props.onTouchEnd}
      >
        <p>draggable p {this.props.counter} <a href="http://google.com" target="_blank">link</a></p>
      </div>
    );
  }
}

class DraggableScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.counter = 1;
    this.state = {
      draggableContent: this.draggableContent
    };
  }

  get draggableContent() {
    return (
      <ToRender
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onClick={this.handleClick}
        counter={this.counter}
      />
    );
  }

  handleMouseDown(evt) {
    console.log('DraggableScreen#handleMouseDown');
  }
  handleMouseUp(evt) {
    console.log('DraggableScreen#handleMouseUp');
  }
  handleTouchStart(evt) {
    console.log('DraggableScreen#handleTouchStart');
  }
  handleTouchEnd(evt) {
    console.log('DraggableScreen#handleTouchEnd');
  }
  handleClick(evt) {
    console.log('DraggableScreen#handleClick');
    // this.counter = this.counter + 1;
    // this.setState({
    //   draggableContent: this.draggableContent
    // });
  }

  componentDidMount() {
    setTimeout(() => {
      this.counter = this.counter + 1;
      this.setState({
        draggableContent: this.draggableContent
      });
    }, 3000);
  }

  render() {
    return (
      <div>
        <Draggable style={{ border: '1px solid blue', width: 200, height: 200, overflowX: 'scroll', overflowY: 'scroll' }}>
          {this.state.draggableContent}
        </Draggable>
        <DisableSelection>
          <p>disabled selection</p>
        </DisableSelection>
        {Array.from({ length: 10 }).map((el, i) => <p key={i}>{i} ---------------------------------</p>)}
      </div>
    );
  }
}

export default DraggableScreen;
