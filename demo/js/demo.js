(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { ThemeProvider } = _devBoxUi.theming;

const customTheme = {
  primaryTextColor: 'brown',
  secondaryTextColor: 'green',
  animations: _devBoxUi.defaultTheme.animations
};

class App extends _react2.default.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      theme: _devBoxUi.defaultTheme
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        theme: this.state.theme === _devBoxUi.defaultTheme ? customTheme : _devBoxUi.defaultTheme
      });
    }, 1000);
  }

  render() {
    return _react2.default.createElement(
      ThemeProvider,
      { theme: this.state.theme },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_devBoxUi.Hello, null),
        _react2.default.createElement(_devBoxUi.Hello, null),
        _react2.default.createElement(_devBoxUi.Hello, null),
        _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
        _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
      )
    );
  }
}

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app'));

},{"dev-box-ui":"dev-box-ui","react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxNQUFNLEVBQUUsYUFBRixzQkFBTjs7QUFFQSxNQUFNLGNBQWM7QUFDbEIsb0JBQWtCLE9BREE7QUFFbEIsc0JBQW9CLE9BRkY7QUFHbEIsY0FBWSx1QkFBYTtBQUhQLENBQXBCOztBQU1BLE1BQU0sR0FBTixTQUFrQixnQkFBTSxTQUF4QixDQUFrQztBQUNoQyxjQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFDMUIsVUFBTSxLQUFOLEVBQWEsT0FBYjtBQUNBLFNBQUssS0FBTCxHQUFhO0FBQ1g7QUFEVyxLQUFiO0FBR0Q7O0FBRUQsc0JBQW9CO0FBQ2xCLGdCQUFZLE1BQU07QUFDaEIsV0FBSyxRQUFMLENBQWM7QUFDWixlQUFPLEtBQUssS0FBTCxDQUFXLEtBQVgsOEJBQ0wsV0FESztBQURLLE9BQWQ7QUFLRCxLQU5ELEVBTUcsSUFOSDtBQU9EOztBQUVELFdBQVM7QUFDUCxXQUNFO0FBQUMsbUJBQUQ7QUFBQSxRQUFlLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBakM7QUFDRTtBQUFBO0FBQUE7QUFDRSw0REFERjtBQUVFLDREQUZGO0FBR0UsNERBSEY7QUFJRSx3REFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYixHQUpGO0FBS0Usd0RBQU0sT0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWI7QUFMRjtBQURGLEtBREY7QUFXRDtBQTlCK0I7O0FBaUNsQyxtQkFBUyxNQUFULENBQ0UsOEJBQUMsR0FBRCxPQURGLEVBRUcsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBRkgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHsgSGVsbG8sIExpc3QsIHRoZW1pbmcsIGRlZmF1bHRUaGVtZSB9IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jb25zdCB7IFRoZW1lUHJvdmlkZXIgfSA9IHRoZW1pbmc7XG5cbmNvbnN0IGN1c3RvbVRoZW1lID0ge1xuICBwcmltYXJ5VGV4dENvbG9yOiAnYnJvd24nLFxuICBzZWNvbmRhcnlUZXh0Q29sb3I6ICdncmVlbicsXG4gIGFuaW1hdGlvbnM6IGRlZmF1bHRUaGVtZS5hbmltYXRpb25zXG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdGhlbWU6IGRlZmF1bHRUaGVtZVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdGhlbWU6IHRoaXMuc3RhdGUudGhlbWUgPT09IGRlZmF1bHRUaGVtZSA/XG4gICAgICAgICAgY3VzdG9tVGhlbWUgOlxuICAgICAgICAgIGRlZmF1bHRUaGVtZVxuICAgICAgfSk7XG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGlzLnN0YXRlLnRoZW1lfT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8SGVsbG8vPlxuICAgICAgICAgIDxIZWxsby8+XG4gICAgICAgICAgPEhlbGxvLz5cbiAgICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG5SZWFjdERPTS5yZW5kZXIoKFxuICA8QXBwLz5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XG4iXX0=
