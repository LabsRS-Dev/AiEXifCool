"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Node_1 = require('./Node');

var VoidNode = function (_Node_1$Node) {
    (0, _inherits3.default)(VoidNode, _Node_1$Node);

    function VoidNode() {
        (0, _classCallCheck3.default)(this, VoidNode);
        return (0, _possibleConstructorReturn3.default)(this, (VoidNode.__proto__ || (0, _getPrototypeOf2.default)(VoidNode)).apply(this, arguments));
    }

    (0, _createClass3.default)(VoidNode, [{
        key: "stringify",

        /**
         * @override
         */
        value: function stringify(params, nodeIndentDepth) {
            nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
            return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + "<" + this.tagName + this.stringifyAttributes(nodeIndentDepth) + ">" + params.newlineChar;
        }
    }]);
    return VoidNode;
}(Node_1.Node);

exports.VoidNode = VoidNode;