"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Node_1 = require('./Node');

var SelfClosingNode = function (_Node_1$Node) {
  (0, _inherits3.default)(SelfClosingNode, _Node_1$Node);

  function SelfClosingNode() {
    (0, _classCallCheck3.default)(this, SelfClosingNode);
    return (0, _possibleConstructorReturn3.default)(this, (SelfClosingNode.__proto__ || (0, _getPrototypeOf2.default)(SelfClosingNode)).apply(this, arguments));
  }

  return SelfClosingNode;
}(Node_1.Node);

exports.SelfClosingNode = SelfClosingNode;