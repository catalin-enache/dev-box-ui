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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxNQUFNLGVBQWUseUJBQXJCOztBQUVBLE1BQU0sY0FBYztBQUNoQixzQkFBa0IsT0FERjtBQUVoQix3QkFBb0I7QUFGSixDQUFwQjs7QUFLQSxNQUFNLEdBQU4sU0FBa0IsZ0JBQU0sU0FBeEIsQ0FBa0M7QUFDOUIsZ0JBQVksS0FBWixFQUFtQixPQUFuQixFQUE0QjtBQUN4QixjQUFNLEtBQU4sRUFBYSxPQUFiO0FBQ0EsYUFBSyxLQUFMLEdBQWE7QUFDVCxtQkFBTztBQURFLFNBQWI7QUFHSDs7QUFFRCx3QkFBb0I7QUFDaEIsb0JBQVksTUFBTTtBQUNkLGlCQUFLLFFBQUwsQ0FBYztBQUNWLHVCQUFPLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsWUFBckIsR0FDSCxXQURHLEdBRUg7QUFITSxhQUFkO0FBS0gsU0FORCxFQU1HLElBTkg7QUFPSDs7QUFFRCxhQUFTO0FBQ0wsZUFDSTtBQUFBO0FBQUEsY0FBZSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWpDO0FBQ0k7QUFBQTtBQUFBO0FBQ0ksb0VBREo7QUFFSSxvRUFGSjtBQUdJLG9FQUhKO0FBSUksZ0VBQU0sT0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWIsR0FKSjtBQUtJLGdFQUFNLE9BQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFiO0FBTEo7QUFESixTQURKO0FBV0g7QUE5QjZCOztBQWlDbEMsbUJBQVMsTUFBVCxDQUNJLDhCQUFDLEdBQUQsT0FESixFQUVHLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUZIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IEhlbGxvLCBMaXN0LCBUaGVtZVByb3ZpZGVyLCBnZXRUaGVtZSB9IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jb25zdCBkZWZhdWx0VGhlbWUgPSBnZXRUaGVtZSgpO1xuXG5jb25zdCBjdXN0b21UaGVtZSA9IHtcbiAgICBwcmltYXJ5VGV4dENvbG9yOiAnYnJvd24nLFxuICAgIHNlY29uZGFyeVRleHRDb2xvcjogJ2dyZWVuJ1xufTtcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICB0aGVtZTogZGVmYXVsdFRoZW1lXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoaXMuc3RhdGUudGhlbWUgPT09IGRlZmF1bHRUaGVtZSA/XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbVRoZW1lIDpcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFRoZW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LCAxMDAwKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17dGhpcy5zdGF0ZS50aGVtZX0+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPEhlbGxvIC8+XG4gICAgICAgICAgICAgICAgICAgIDxIZWxsbyAvPlxuICAgICAgICAgICAgICAgICAgICA8SGVsbG8gLz5cbiAgICAgICAgICAgICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfSAvPlxuICAgICAgICAgICAgICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5SZWFjdERPTS5yZW5kZXIoKFxuICAgIDxBcHAgLz5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XG4iXX0=
