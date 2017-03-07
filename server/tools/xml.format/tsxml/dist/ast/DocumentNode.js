"use strict";

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContainerNode_1 = require('./ContainerNode');

var DocumentNode = function (_ContainerNode_1$Cont) {
    (0, _inherits3.default)(DocumentNode, _ContainerNode_1$Cont);

    function DocumentNode() {
        (0, _classCallCheck3.default)(this, DocumentNode);
        return (0, _possibleConstructorReturn3.default)(this, (DocumentNode.__proto__ || (0, _getPrototypeOf2.default)(DocumentNode)).apply(this, arguments));
    }

    (0, _createClass3.default)(DocumentNode, [{
        key: 'stringify',

        /**
         * @override
         */
        value: function stringify(params, nodeIndentDepth) {
            nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
            return this.stringifyAllChildNodes(params, nodeIndentDepth);
        }
    }, {
        key: 'stringifyAllChildNodes',
        value: function stringifyAllChildNodes(params, nodeIndentDepth) {
            var _this2 = this;

            var xml = '';
            this.forEachChildNode(function (childNode) {
                xml += _this2.stringifyChildNode(childNode, params, nodeIndentDepth);
            });
            return xml;
        }
    }]);
    return DocumentNode;
}(ContainerNode_1.ContainerNode);

exports.DocumentNode = DocumentNode;