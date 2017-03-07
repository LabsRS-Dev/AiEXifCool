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
/**
 * Base class for all nodes that may contain child elements.
 */

var ContainerNode = function (_Node_1$Node) {
    (0, _inherits3.default)(ContainerNode, _Node_1$Node);

    function ContainerNode() {
        var _ref;

        (0, _classCallCheck3.default)(this, ContainerNode);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = ContainerNode.__proto__ || (0, _getPrototypeOf2.default)(ContainerNode)).call.apply(_ref, [this].concat(args)));

        _this.childNodes = [];
        return _this;
    }

    (0, _createClass3.default)(ContainerNode, [{
        key: 'getNumberOfChildren',
        value: function getNumberOfChildren() {
            return this.childNodes.length;
        }
    }, {
        key: 'getChildAtIndex',
        value: function getChildAtIndex(index) {
            return this.childNodes[index];
        }
    }, {
        key: 'getIndexOfChild',
        value: function getIndexOfChild(child) {
            return this.childNodes.indexOf(child);
        }
    }, {
        key: 'hasChild',
        value: function hasChild(child) {
            return this.getIndexOfChild(child) !== -1;
        }
        /**
         * @chainable
         */

    }, {
        key: 'insertChildAt',
        value: function insertChildAt(child, index) {
            Node_1.Node.changeParentNode(child, this);
            this.childNodes.splice(index, 0, child);
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'removeChildAt',
        value: function removeChildAt(index) {
            var removedNode = this.childNodes.splice(index, 1)[0];
            Node_1.Node.removeParentNode(removedNode);
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'insertChildBefore',
        value: function insertChildBefore(child, referenceChild) {
            if (!this.hasChild(referenceChild)) {
                throw new Error('Can not insert child: reference child not found.');
            }
            this.insertChildAt(child, this.getIndexOfChild(referenceChild));
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'insertChildAfter',
        value: function insertChildAfter(child, referenceChild) {
            if (!this.hasChild(referenceChild)) {
                throw new Error('Can not insert child: reference child not found.');
            }
            this.insertChildAt(child, this.getIndexOfChild(referenceChild) + 1);
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'prependChild',
        value: function prependChild(child) {
            this.insertChildAt(child, 0);
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'appendChild',
        value: function appendChild(child) {
            this.insertChildAt(child, this.getNumberOfChildren());
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'replaceChild',
        value: function replaceChild(oldChild, newChild) {
            var index = this.getIndexOfChild(oldChild);
            this.removeChildAt(index);
            this.insertChildAt(newChild, index);
            return this;
        }
    }, {
        key: 'forEachChildNode',
        value: function forEachChildNode(fn) {
            this.childNodes.forEach(function (childNode, index) {
                return fn(childNode, index);
            });
        }
    }, {
        key: 'isSubtreeIdenticalTo',
        value: function isSubtreeIdenticalTo(otherNode) {
            if (this.getNumberOfChildren() !== otherNode.getNumberOfChildren()) {
                return false;
            }
            for (var i = 0; i < this.getNumberOfChildren(); i++) {
                if (!this.getChildAtIndex(i).isIdenticalTo(otherNode.getChildAtIndex(i))) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Checks whether a node is identical to another node by comparing tag names, attribute names and values and subtree.
         */

    }, {
        key: 'isIdenticalTo',
        value: function isIdenticalTo(otherNode) {
            return (0, _get3.default)(ContainerNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(ContainerNode.prototype), 'isIdenticalTo', this).call(this, otherNode) && this.isSubtreeIdenticalTo(otherNode);
        }
        /**
         * @override
         */

    }, {
        key: 'stringify',
        value: function stringify(params, nodeIndentDepth) {
            nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
            return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + '<' + this.tagName + this.stringifyAttributes(nodeIndentDepth) + '>' + this.stringifyAllChildNodes(params, nodeIndentDepth) + Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + '</' + this.tagName + '>' + params.newlineChar;
        }
    }, {
        key: 'stringifyAllChildNodes',
        value: function stringifyAllChildNodes(params, nodeIndentDepth) {
            var _this2 = this;

            var xml = params.newlineChar;
            this.forEachChildNode(function (childNode) {
                xml += _this2.stringifyChildNode(childNode, params, nodeIndentDepth + 1);
            });
            return xml;
        }
    }, {
        key: 'stringifyChildNode',
        value: function stringifyChildNode(childNode, params, nodeIndentDepth) {
            return childNode.stringify(params, nodeIndentDepth);
        }
    }]);
    return ContainerNode;
}(Node_1.Node);

exports.ContainerNode = ContainerNode;