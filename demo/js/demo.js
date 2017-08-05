(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultTheme = (0, _devBoxUi.getTheme)();

const customTheme = {
    primaryTextColor: 'brown',
    secondaryTextColor: 'green'
};

class App extends _react2.default.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            theme: defaultTheme
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                theme: this.state.theme === defaultTheme ? customTheme : defaultTheme
            });
        }, 1000);
    }

    render() {
        return _react2.default.createElement(
            _devBoxUi.ThemeProvider,
            { theme: this.state.theme },
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_devBoxUi.Hello, null),
                _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
                _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
            )
        );
    }
}

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app'));

},{"dev-box-ui":"dev-box-ui","react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxNQUFNLGVBQWUseUJBQXJCOztBQUVBLE1BQU0sY0FBYztBQUNoQixzQkFBa0IsT0FERjtBQUVoQix3QkFBb0I7QUFGSixDQUFwQjs7QUFLQSxNQUFNLEdBQU4sU0FBa0IsZ0JBQU0sU0FBeEIsQ0FBa0M7QUFDOUIsZ0JBQVksS0FBWixFQUFtQixPQUFuQixFQUE0QjtBQUN4QixjQUFNLEtBQU4sRUFBYSxPQUFiO0FBQ0EsYUFBSyxLQUFMLEdBQWE7QUFDVCxtQkFBTztBQURFLFNBQWI7QUFHSDs7QUFFRCx3QkFBb0I7QUFDaEIsb0JBQVksTUFBTTtBQUNkLGlCQUFLLFFBQUwsQ0FBYztBQUNWLHVCQUFPLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsWUFBckIsR0FDSCxXQURHLEdBRUg7QUFITSxhQUFkO0FBS0gsU0FORCxFQU1HLElBTkg7QUFPSDs7QUFFRCxhQUFTO0FBQ0wsZUFDSTtBQUFBO0FBQUEsY0FBZSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWpDO0FBQ0k7QUFBQTtBQUFBO0FBQ0ksb0VBREo7QUFFSSxnRUFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYixHQUZKO0FBR0ksZ0VBQU0sT0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWI7QUFISjtBQURKLFNBREo7QUFTSDtBQTVCNkI7O0FBK0JsQyxtQkFBUyxNQUFULENBQ0ksOEJBQUMsR0FBRCxPQURKLEVBRUcsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBRkgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHsgSGVsbG8sIExpc3QsIFRoZW1lUHJvdmlkZXIsIGdldFRoZW1lIH0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNvbnN0IGRlZmF1bHRUaGVtZSA9IGdldFRoZW1lKCk7XG5cbmNvbnN0IGN1c3RvbVRoZW1lID0ge1xuICAgIHByaW1hcnlUZXh0Q29sb3I6ICdicm93bicsXG4gICAgc2Vjb25kYXJ5VGV4dENvbG9yOiAnZ3JlZW4nXG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHRoZW1lOiBkZWZhdWx0VGhlbWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICB0aGVtZTogdGhpcy5zdGF0ZS50aGVtZSA9PT0gZGVmYXVsdFRoZW1lID9cbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tVGhlbWUgOlxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VGhlbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGlzLnN0YXRlLnRoZW1lfT5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8SGVsbG8gLz5cbiAgICAgICAgICAgICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfSAvPlxuICAgICAgICAgICAgICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5SZWFjdERPTS5yZW5kZXIoKFxuICAgIDxBcHAgLz5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XG4iXX0=
