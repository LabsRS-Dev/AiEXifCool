"use strict";

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NodeFlags_1 = require('../parser/NodeFlags');
/**
 * Base class for all nodes.
 */

var Node = function () {
    function Node() {
        (0, _classCallCheck3.default)(this, Node);

        this.parserFlags = NodeFlags_1.NodeFlags.None;
        this.attrList = {};
        this.applyAttributePropertyBindings();
    }
    /**
     * The default formatting options for stringification.
     */


    (0, _createClass3.default)(Node, [{
        key: 'getAllAttributeNames',
        value: function getAllAttributeNames() {
            return (0, _keys2.default)(this.attrList);
        }
    }, {
        key: 'getNumberOfAttributes',
        value: function getNumberOfAttributes() {
            return this.getAllAttributeNames().length;
        }
    }, {
        key: 'hasAttribute',
        value: function hasAttribute(attrName) {
            return this.getAllAttributeNames().indexOf(attrName) !== -1;
        }
    }, {
        key: 'getAttribute',
        value: function getAttribute(attrName, namespaceName) {
            if ((0, _typeof3.default)(this.attrList) !== 'object' || this.attrList === null) {
                return undefined;
            }
            attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
            return this.attrList[attrName];
        }
        /**
         * @chainable
         */

    }, {
        key: 'setAttribute',
        value: function setAttribute(attrName, value, namespaceName) {
            attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
            this.attrList = this.attrList || {};
            this.attrList[attrName] = value;
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'removeAttribute',
        value: function removeAttribute(attrName, namespaceName) {
            attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
            delete this.attrList[attrName];
            return this;
        }
    }, {
        key: 'toFormattedString',
        value: function toFormattedString(stringificationParams) {
            if ((typeof stringificationParams === 'undefined' ? 'undefined' : (0, _typeof3.default)(stringificationParams)) === 'object' && stringificationParams !== null) {
                stringificationParams = Node.mergeObjects(Node.defaultStringificationParams, stringificationParams);
            } else {
                stringificationParams = Node.defaultStringificationParams;
            }
            return this.stringify(stringificationParams);
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.stringify({
                indentChar: '',
                newlineChar: '',
                attrParen: '"'
            });
        }
    }, {
        key: 'isTagNameAndNamespaceIdenticalTo',
        value: function isTagNameAndNamespaceIdenticalTo(otherNode) {
            return this.namespacePrefix === otherNode.namespacePrefix && this.tagName === otherNode.tagName;
        }
    }, {
        key: 'isAttributeListIdenticalTo',
        value: function isAttributeListIdenticalTo(otherNode) {
            var _this = this;

            if (this.getNumberOfAttributes() !== otherNode.getNumberOfAttributes()) {
                return false;
            }
            var indexOfFirstNonIdenticalAttributeName = this.getAllAttributeNames().findIndex(function (attrName) {
                return _this.getAttribute(attrName) !== otherNode.getAttribute(attrName);
            });
            return indexOfFirstNonIdenticalAttributeName === -1;
        }
        /**
         * Checks whether a node is identical to another node by comparing tag names, attribute names and values.
         */

    }, {
        key: 'isIdenticalTo',
        value: function isIdenticalTo(otherNode) {
            return this.constructor === otherNode.constructor && this.isTagNameAndNamespaceIdenticalTo(otherNode) && this.isAttributeListIdenticalTo(otherNode);
        }
        /**
         * Decorator.
         */

    }, {
        key: 'getBoundAttributeNameForProperty',
        value: function getBoundAttributeNameForProperty(propertyName) {
            if ((0, _typeof3.default)(this.attrPropertyBindings) !== 'object' || this.attrPropertyBindings === null) {
                return undefined;
            }
            return this.attrPropertyBindings[propertyName];
        }
    }, {
        key: 'getBoundPropertyNamesForAttribute',
        value: function getBoundPropertyNamesForAttribute(attributeName) {
            var propertyNames = [];
            if ((0, _typeof3.default)(this.attrPropertyBindings) !== 'object' || this.attrPropertyBindings === null) {
                return propertyNames;
            }
            for (var propertyName in this.attrPropertyBindings) {
                if (this.attrPropertyBindings[propertyName] === attributeName) {
                    propertyNames.push(propertyName);
                }
            }
            return propertyNames;
        }
    }, {
        key: 'stringify',
        value: function stringify(params, nodeIndentDepth) {
            nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
            return Node.generateIndentString(params.indentChar, nodeIndentDepth) + '<' + this.tagName + this.stringifyAttributes(nodeIndentDepth) + ' />' + params.newlineChar;
        }
    }, {
        key: 'stringifyAttributes',
        value: function stringifyAttributes(nodeIndentDepth) {
            var attrString = '';
            for (var attrName in this.attrList) {
                attrString += this.stringifyAttribute(attrName, this.attrList[attrName]);
            }
            return attrString;
        }
    }, {
        key: 'stringifyAttribute',
        value: function stringifyAttribute(attrName, attrValue) {
            if (typeof attrValue !== 'undefined') {
                return ' ' + attrName + '="' + attrValue + '"';
            } else {
                return ' ' + attrName;
            }
        }
    }, {
        key: 'addAttributeProxyProperty',
        value: function addAttributeProxyProperty(propertyName, attrName) {
            this.attrPropertyBindings = this.attrPropertyBindings || {};
            this.attrPropertyBindings[propertyName] = attrName;
        }
    }, {
        key: 'applyAttributePropertyBindings',
        value: function applyAttributePropertyBindings() {
            if ((0, _typeof3.default)(this.attrPropertyBindings) !== 'object' || this.attrPropertyBindings === null) {
                return;
            }
            for (var propertyName in this.attrPropertyBindings) {
                this.applyAttributePropertyBinding(propertyName, this.attrPropertyBindings[propertyName]);
            }
        }
    }, {
        key: 'applyAttributePropertyBinding',
        value: function applyAttributePropertyBinding(propertyName, attributeName) {
            var _this2 = this;

            var value = this[propertyName];
            (0, _defineProperty2.default)(this, propertyName, {
                get: function get() {
                    return _this2.getAttribute(attributeName);
                },
                set: function set(newValue) {
                    return _this2.setAttribute(attributeName, newValue);
                }
            });
            this.setAttribute(attributeName, value);
        }
    }, {
        key: 'parentNode',
        get: function get() {
            return this._parentNode;
        }
    }], [{
        key: 'attributePropertyBinding',
        value: function attributePropertyBinding(attributeName) {
            return function (target, propertyName) {
                target.addAttributeProxyProperty(propertyName, attributeName);
            };
        }
    }, {
        key: 'joinAttributeNameWithNamespacePrefix',
        value: function joinAttributeNameWithNamespacePrefix(attrName, namespaceName) {
            if (typeof namespaceName !== 'undefined') {
                attrName = namespaceName + ':' + attrName;
            }
            return attrName;
        }
    }, {
        key: 'changeParentNode',
        value: function changeParentNode(childNode, newParentNode) {
            childNode._parentNode = newParentNode;
        }
    }, {
        key: 'removeParentNode',
        value: function removeParentNode(childNode) {
            childNode._parentNode = undefined;
        }
    }, {
        key: 'generateIndentString',
        value: function generateIndentString(indentChar, indentDepth) {
            indentDepth = Math.max(indentDepth || 0, 0);
            if (indentDepth === 0) {
                return '';
            }
            var indentString = '';
            while (indentDepth-- > 0) {
                indentString += indentChar;
            }
            return indentString;
        }
    }, {
        key: 'mergeObjects',
        value: function mergeObjects(baseObject, overlayObject) {
            for (var key in overlayObject) {
                baseObject[key] = overlayObject[key];
            }
            return baseObject;
        }
    }, {
        key: 'defaultStringificationParams',
        get: function get() {
            return {
                attrParen: '"',
                indentChar: '\t',
                newlineChar: '\n'
            };
        }
    }]);
    return Node;
}();

exports.Node = Node;