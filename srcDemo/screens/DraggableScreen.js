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
      <div className="demo-screen"> { /* standard template requirement */ }

        <h2 className="title">Draggable React</h2>

        <h3 className="section">Stuff One</h3>

        <p>before tabs</p>

        <div className="tabs">

          <input id="tab-1" type="radio" name="group-1" defaultChecked />
          <label htmlFor="tab-1">RESULT</label>

          <input id="tab-2" type="radio" name="group-1" />
          <label htmlFor="tab-2">HTML</label>

          <input id="tab-3" type="radio" name="group-1" />
          <label htmlFor="tab-3">CSS</label>

          <input id="tab-4" type="radio" name="group-1" />
          <label htmlFor="tab-4">JS</label>

          <section id="content-1">
            <Draggable style={{ border: '1px solid blue', width: 200, height: 200, overflowX: 'scroll', overflowY: 'scroll' }}>
              {this.state.draggableContent}
            </Draggable>
            <DisableSelection>
              <p>disabled selection</p>
            </DisableSelection>
            {Array.from({ length: 10 }).map((el, i) => <p key={i}>{i} ---------------------------------</p>)}
          </section>

          <section id="content-2">
            <pre><code className="html">{`
<p>draggable</p>
<span>react</span>
            `}</code></pre>
          </section>

          <section id="content-3">
            <pre><code className="css">{`
body {
  color: red;
}
            `}</code></pre>
          </section>

          <section id="content-4">
            <pre><code className="javascript">{`
class Car extends SuperClass {
  constructor() {
    super();
  }

  onInit() {
    this.do(() => {
      console.log(print);
    });
  }
}
            `}</code></pre>
          </section>
        </div>
      </div>
    );
  }
}

export default DraggableScreen;
