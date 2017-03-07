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

var TextNode = function (_Node_1$Node) {
    (0, _inherits3.default)(TextNode, _Node_1$Node);

    function TextNode() {
        (0, _classCallCheck3.default)(this, TextNode);
        return (0, _possibleConstructorReturn3.default)(this, (TextNode.__proto__ || (0, _getPrototypeOf2.default)(TextNode)).apply(this, arguments));
    }

    (0, _createClass3.default)(TextNode, [{
        key: 'getContentLines',
        value: function getContentLines() {
            if (typeof this.content !== 'string' || this.content.length < 1) {
                return [];
            }
            return this.content.trim().split(/\r?\n/);
        }
        /**
         * Returns whether the text content contains line breaks.
         */

    }, {
        key: 'isContentMultiLine',
        value: function isContentMultiLine() {
            return (/\r?\n/.test(this.content.trim())
            );
        }
    }, {
        key: 'isContentIdenticalTo',
        value: function isContentIdenticalTo(otherNode) {
            return TextNode.makeContentStringComparable(this.content || '') === TextNode.makeContentStringComparable(otherNode.content || '');
        }
        /**
         * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
         */

    }, {
        key: 'isIdenticalTo',
        value: function isIdenticalTo(otherNode) {
            return (0, _get3.default)(TextNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextNode.prototype), 'isIdenticalTo', this).call(this, otherNode) && this.isContentIdenticalTo(otherNode);
        }
    }, {
        key: 'stringify',
        value: function stringify(params, nodeIndentDepth) {
            return this.stringifyContent(params, nodeIndentDepth);
        }
    }, {
        key: 'stringifyContent',
        value: function stringifyContent(params, nodeIndentDepth) {
            if (this.isContentMultiLine()) {
                return this.stringifyMultiLineContent(params, nodeIndentDepth);
            } else {
                return this.stringifySingleLineContent(params, nodeIndentDepth);
            }
        }
    }, {
        key: 'stringifyMultiLineContent',
        value: function stringifyMultiLineContent(params, nodeIndentDepth) {
            var stringifiedContent = '',
                newlineChar = params.newlineChar;
            if (!/\n/.test(params.newlineChar)) {
                newlineChar = ' ';
            }
            stringifiedContent += this.getContentLines().map(function (contentLine) {
                return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + contentLine.trim();
            }).join(newlineChar);
            if (/\n/.test(params.newlineChar)) {
                return stringifiedContent + params.newlineChar;
            }
            return stringifiedContent;
        }
    }, {
        key: 'stringifySingleLineContent',
        value: function stringifySingleLineContent(params, nodeIndentDepth) {
            var formattedContent = (this.content || '').trim().replace(/(\r?\n(\t*))+/g, ' ').trim();
            if (/\n/.test(params.newlineChar)) {
                return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + formattedContent + '\n';
            } else {
                return formattedContent;
            }
        }
    }], [{
        key: 'makeContentStringComparable',
        value: function makeContentStringComparable(contentString) {
            return contentString.trim().replace(/[\t\r\n ]+/g, '').replace(/ +/g, ' ');
        }
    }]);
    return TextNode;
}(Node_1.Node);

exports.TextNode = TextNode;