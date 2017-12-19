import React from 'react';
import {
  Draggable, DisableSelection
} from 'dev-box-ui';
import PropertiesTable from '../internals/components/PropertiesTable';

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
    this._mounted = true;
    setTimeout(() => {
      if (!this._mounted) return;
      this.counter = this.counter + 1;
      this.setState({
        draggableContent: this.draggableContent
      });
    }, 3000);
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return (
      <div className="demo-screen"> { /* standard template requirement */ }

        <h2 className="title">Draggable React {this.counter}</h2>

        <h3 className="section">Stuff One</h3>

        <p>before tabs</p>

        <div className="tabs">
          <section x-name="RESULT" x-checked="1">
            <Draggable style={{ border: '1px solid blue', width: 200, height: 200, overflowX: 'scroll', overflowY: 'scroll' }}>
              {this.state.draggableContent}
            </Draggable>
            <DisableSelection>
              <p>disabled selection</p>
            </DisableSelection>
            {Array.from({ length: 10 }).map((el, i) => <p key={i}>{i} ---------------------------------</p>)}
          </section>
          <section x-name="HTML" x-highlight="html">{`
<p>draggable</p>
<span>react</span>
          `}
          </section>
          <section x-name="CSS" x-highlight="css">{`
body {
  color: red;
}
          `}
          </section>
          <section x-name="JS" x-highlight="javascript">{`
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
          `}
          </section>
        </div>

        <p>between tabs</p>

        <div className="tabs">
          <section x-name="CSS" x-highlight="css">{`
body {
  color: red;
}
          `}
          </section>
          <section x-name="JS" x-highlight="javascript" x-checked="1">{`
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
          `}
          </section>
        </div>

        <PropertiesTable properties={{
          propertyOne: {
      type: 'string',
      default: 'value 1',
      description: 'description one'
    },
    propertyTwo: {
      type: 'number',
      default: '5',
      description: 'description two'
    }
        }} />
      </div>
    );
  }
}

export default DraggableScreen;
