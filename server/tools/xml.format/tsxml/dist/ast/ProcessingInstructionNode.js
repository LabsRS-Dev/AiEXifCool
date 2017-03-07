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

var ProcessingInstructionNode = function (_Node_1$Node) {
    (0, _inherits3.default)(ProcessingInstructionNode, _Node_1$Node);

    function ProcessingInstructionNode() {
        (0, _classCallCheck3.default)(this, ProcessingInstructionNode);
        return (0, _possibleConstructorReturn3.default)(this, (ProcessingInstructionNode.__proto__ || (0, _getPrototypeOf2.default)(ProcessingInstructionNode)).apply(this, arguments));
    }

    (0, _createClass3.default)(ProcessingInstructionNode, [{
        key: "stringify",

        /**
         * @override
         */
        value: function stringify(params, nodeIndentDepth) {
            nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
            return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + "<?" + this.tagName + this.stringifyAttributes(nodeIndentDepth) + "?>" + params.newlineChar;
        }
    }]);
    return ProcessingInstructionNode;
}(Node_1.Node);

exports.ProcessingInstructionNode = ProcessingInstructionNode;