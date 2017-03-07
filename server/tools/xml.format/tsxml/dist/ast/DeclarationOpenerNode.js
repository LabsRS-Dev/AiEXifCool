"use strict";

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Node_1 = require('./Node');

var DeclarationOpenerNode = function (_Node_1$Node) {
    (0, _inherits3.default)(DeclarationOpenerNode, _Node_1$Node);

    function DeclarationOpenerNode() {
        var _ref;

        (0, _classCallCheck3.default)(this, DeclarationOpenerNode);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = DeclarationOpenerNode.__proto__ || (0, _getPrototypeOf2.default)(DeclarationOpenerNode)).call.apply(_ref, [this].concat(args)));

        _this.systemLiterals = [];
        _this.literalAndAttrOrder = [];
        return _this;
    }

    (0, _createClass3.default)(DeclarationOpenerNode, [{
        key: 'getNumberOfSystemLiterals',
        value: function getNumberOfSystemLiterals() {
            return this.systemLiterals.length;
        }
    }, {
        key: 'getIndexOfSystemLiteral',
        value: function getIndexOfSystemLiteral(literal) {
            return this.systemLiterals.indexOf(literal);
        }
    }, {
        key: 'getSystemLiteralAtIndex',
        value: function getSystemLiteralAtIndex(literalIndex) {
            return this.systemLiterals[literalIndex];
        }
    }, {
        key: 'getAllSystemLiterals',
        value: function getAllSystemLiterals() {
            return [].concat(this.systemLiterals);
        }
    }, {
        key: 'hasSystemLiteral',
        value: function hasSystemLiteral(literal) {
            return this.getIndexOfSystemLiteral(literal) !== -1;
        }
        /**
         * @chainable
         */

    }, {
        key: 'insertIntoSystemLiteralList',
        value: function insertIntoSystemLiteralList(literal, index) {
            this.appendSystemLiteralIndexToOrderList(index);
            this.systemLiterals.splice(index, 0, literal);
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'prependToSystemLiteralList',
        value: function prependToSystemLiteralList(literal) {
            this.insertIntoSystemLiteralList(literal, 0);
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'appendToSystemLiteralList',
        value: function appendToSystemLiteralList(literal) {
            this.insertIntoSystemLiteralList(literal, this.getNumberOfSystemLiterals());
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'removeSystemLiteralAtIndex',
        value: function removeSystemLiteralAtIndex(index) {
            this.removeSystemLiteralIndexFromOrderList(index);
            this.systemLiterals.splice(index, 1);
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'removeSystemLiteral',
        value: function removeSystemLiteral(literal) {
            var index = this.getIndexOfSystemLiteral(literal);
            while (index !== -1) {
                this.systemLiterals.splice(index, 1);
                index = this.getIndexOfSystemLiteral(literal);
            }
            return this;
        }
        /**
         * @chainable
         * @override
         */

    }, {
        key: 'setAttribute',
        value: function setAttribute(attrName, value, namespaceName) {
            this.appendAttributeToOrderList(Node_1.Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName));
            (0, _get3.default)(DeclarationOpenerNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(DeclarationOpenerNode.prototype), 'setAttribute', this).call(this, attrName, value, namespaceName);
            return this;
        }
        /**
         * @chainable
         * @override
         */

    }, {
        key: 'removeAttribute',
        value: function removeAttribute(attrName, namespaceName) {
            this.removeAttributeFromOrderList(Node_1.Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName));
            (0, _get3.default)(DeclarationOpenerNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(DeclarationOpenerNode.prototype), 'removeAttribute', this).call(this, attrName, namespaceName);
            return this;
        }
    }, {
        key: 'isSystemLiteralListIdenticalTo',
        value: function isSystemLiteralListIdenticalTo(otherNode) {
            if (this.systemLiterals.length !== otherNode.systemLiterals.length) {
                return false;
            }
            for (var i = 0; i < this.systemLiterals.length; i++) {
                if (this.systemLiterals[i] !== otherNode.systemLiterals[i]) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
         * @override
         */

    }, {
        key: 'isIdenticalTo',
        value: function isIdenticalTo(otherNode) {
            return (0, _get3.default)(DeclarationOpenerNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(DeclarationOpenerNode.prototype), 'isIdenticalTo', this).call(this, otherNode) && this.isSystemLiteralListIdenticalTo(otherNode);
        }
        /**
         * @override
         */

    }, {
        key: 'stringify',
        value: function stringify(params, nodeIndentDepth) {
            nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
            return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + '<!' + this.tagName + this.stringifyAttributesAndSystemLiterals(params, nodeIndentDepth) + '>' + params.newlineChar;
        }
    }, {
        key: 'stringifyAttributesAndSystemLiterals',
        value: function stringifyAttributesAndSystemLiterals(params, nodeIndentDepth) {
            var _this2 = this;

            return this.literalAndAttrOrder.map(function (attrNameOrLiteralIndex) {
                if (typeof attrNameOrLiteralIndex === 'string') {
                    return _this2.stringifyAttribute(attrNameOrLiteralIndex, _this2.getAttribute(attrNameOrLiteralIndex));
                } else {
                    return ' "' + _this2.getSystemLiteralAtIndex(attrNameOrLiteralIndex) + '"';
                }
            }).join('');
        }
    }, {
        key: 'appendSystemLiteralIndexToOrderList',
        value: function appendSystemLiteralIndexToOrderList(literalIndex) {
            this.removeSystemLiteralIndexFromOrderList(literalIndex);
            this.literalAndAttrOrder.push(literalIndex);
        }
    }, {
        key: 'removeSystemLiteralIndexFromOrderList',
        value: function removeSystemLiteralIndexFromOrderList(literalIndex) {
            var index = this.literalAndAttrOrder.indexOf(literalIndex);
            if (index !== -1) {
                this.literalAndAttrOrder.splice(index, 1);
            }
        }
    }, {
        key: 'appendAttributeToOrderList',
        value: function appendAttributeToOrderList(attrNameWithNamespace) {
            this.removeAttributeFromOrderList(attrNameWithNamespace);
            this.literalAndAttrOrder.push(attrNameWithNamespace);
        }
    }, {
        key: 'removeAttributeFromOrderList',
        value: function removeAttributeFromOrderList(attrNameWithNamespace) {
            var index = this.literalAndAttrOrder.indexOf(attrNameWithNamespace);
            if (index !== -1) {
                this.literalAndAttrOrder.splice(index, 1);
            }
        }
    }]);
    return DeclarationOpenerNode;
}(Node_1.Node);

exports.DeclarationOpenerNode = DeclarationOpenerNode;