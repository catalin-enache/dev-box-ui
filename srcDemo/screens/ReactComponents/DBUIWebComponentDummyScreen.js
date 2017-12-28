import React from 'react';

class DBUIWebComponentDummyScreen extends React.Component {
  render() {
    return (
      <div className="demo-screen">{ /* standard template requirement */ }

        <dbui-web-component-dummy
          style={{ color: 'blue' }}
        >
          <span>hello 1</span>
        </dbui-web-component-dummy>

        <dbui-web-component-dummy
          style={{ color: 'blue' }}
        >
          <span>hello 2</span>
        </dbui-web-component-dummy>
        <dbui-web-component-dummy-parent>hello 3</dbui-web-component-dummy-parent>

      </div>
    );
  }
}

export default DBUIWebComponentDummyScreen;
