'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _grid = require('./grid/grid');

var _grid2 = _interopRequireDefault(_grid);

var _form = require('./form/form');

var _form2 = _interopRequireDefault(_form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commonClasses = commonVars => {
  return Object.assign({}, (0, _grid2.default)(commonVars), (0, _form2.default)(commonVars));
};

exports.default = commonClasses;