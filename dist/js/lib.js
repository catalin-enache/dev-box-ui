require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lib = require('lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Hello extends _react2.default.Component {
    render() {
        return _react2.default.createElement(
            'div',
            null,
            'Hello ',
            this.props.name,
            _react2.default.createElement(_lib.List, { items: ['one', 'two'] })
        );
    }
}

exports.default = Hello;
Hello.propTypes = {
    name: _propTypes2.default.string.isRequired
};

},{"lib":"lib","prop-types":"prop-types","react":"react"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class List extends _react2.default.Component {
    render() {
        return _react2.default.createElement(
            'ul',
            null,
            this.props.items.map(item => _react2.default.createElement(
                'li',
                { key: item },
                item
            ))
        );
    }
}

exports.default = List;
List.defaultProps = {
    items: []
};

List.propTypes = {
    items: _propTypes2.default.array
};

},{"prop-types":"prop-types","react":"react"}],"lib":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.List = exports.Hello = undefined;

var _Hello = require('lib/components/Hello/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

var _List = require('lib/components/List/List');

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Hello = _Hello2.default;
exports.List = _List2.default;

},{"lib/components/Hello/Hello":1,"lib/components/List/List":2}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL2NvbXBvbmVudHMvSGVsbG8vSGVsbG8uanMiLCJzcmMvbGliL2NvbXBvbmVudHMvTGlzdC9MaXN0LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFZSxNQUFNLEtBQU4sU0FBb0IsZ0JBQU0sU0FBMUIsQ0FBb0M7QUFDL0MsYUFBUztBQUNMLGVBQ0k7QUFBQTtBQUFBO0FBQUE7QUFDVyxpQkFBSyxLQUFMLENBQVcsSUFEdEI7QUFFSSx1REFBTSxPQUFPLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBYjtBQUZKLFNBREo7QUFNSDtBQVI4Qzs7a0JBQTlCLEs7QUFXckIsTUFBTSxTQUFOLEdBQWtCO0FBQ2hCLFVBQU0sb0JBQVUsTUFBVixDQUFpQjtBQURQLENBQWxCOzs7Ozs7Ozs7QUNmQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNLElBQU4sU0FBbUIsZ0JBQU0sU0FBekIsQ0FBbUM7QUFDOUMsYUFBUztBQUNMLGVBQ0k7QUFBQTtBQUFBO0FBQ0ssaUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsR0FBakIsQ0FBc0IsSUFBRCxJQUFVO0FBQUE7QUFBQSxrQkFBSSxLQUFLLElBQVQ7QUFBaUI7QUFBakIsYUFBL0I7QUFETCxTQURKO0FBS0g7QUFQNkM7O2tCQUE3QixJO0FBVXJCLEtBQUssWUFBTCxHQUFvQjtBQUNsQixXQUFPO0FBRFcsQ0FBcEI7O0FBSUEsS0FBSyxTQUFMLEdBQWlCO0FBQ2YsV0FBTyxvQkFBVTtBQURGLENBQWpCOzs7Ozs7Ozs7O0FDbEJBOzs7O0FBQ0E7Ozs7OztRQUdJLEs7UUFDQSxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBMaXN0IH0gZnJvbSAnbGliJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVsbG8gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgSGVsbG8ge3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgICAgICA8TGlzdCBpdGVtcz17WydvbmUnLCAndHdvJ119Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuSGVsbG8ucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbn07IiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLml0ZW1zLm1hcCgoaXRlbSkgPT4gPGxpIGtleT17aXRlbX0+eyBpdGVtIH08L2xpPil9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuTGlzdC5kZWZhdWx0UHJvcHMgPSB7XG4gIGl0ZW1zOiBbXVxufTtcblxuTGlzdC5wcm9wVHlwZXMgPSB7XG4gIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlcbn07IiwiaW1wb3J0IEhlbGxvIGZyb20gJ2xpYi9jb21wb25lbnRzL0hlbGxvL0hlbGxvJztcbmltcG9ydCBMaXN0IGZyb20gJ2xpYi9jb21wb25lbnRzL0xpc3QvTGlzdCc7XG5cbmV4cG9ydCB7XG4gICAgSGVsbG8sXG4gICAgTGlzdFxufSJdfQ==
