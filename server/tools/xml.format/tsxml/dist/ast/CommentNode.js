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

var TextNode_1 = require('./TextNode');

var CommentNode = function (_TextNode_1$TextNode) {
    (0, _inherits3.default)(CommentNode, _TextNode_1$TextNode);

    function CommentNode() {
        (0, _classCallCheck3.default)(this, CommentNode);
        return (0, _possibleConstructorReturn3.default)(this, (CommentNode.__proto__ || (0, _getPrototypeOf2.default)(CommentNode)).apply(this, arguments));
    }

    (0, _createClass3.default)(CommentNode, [{
        key: 'stringify',

        /**
         * @override
         */
        value: function stringify(params, nodeIndentDepth) {
            return CommentNode.generateIndentString(params.indentChar, nodeIndentDepth) + '<!--' + this.stringifyContent(params, nodeIndentDepth) + '-->' + params.newlineChar;
        }
        /**
         * @override
         */

    }, {
        key: 'stringifyMultiLineContent',
        value: function stringifyMultiLineContent(params, nodeIndentDepth) {
            if (/\n/.test(params.newlineChar)) {
                return '\n' + (0, _get3.default)(CommentNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(CommentNode.prototype), 'stringifyMultiLineContent', this).call(this, params, nodeIndentDepth) + CommentNode.generateIndentString(params.indentChar, nodeIndentDepth);
            } else {
                return ' ' + (0, _get3.default)(CommentNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(CommentNode.prototype), 'stringifyMultiLineContent', this).call(this, params, nodeIndentDepth) + ' ';
            }
        }
        /**
         * @override
         */

    }, {
        key: 'stringifySingleLineContent',
        value: function stringifySingleLineContent(params, nodeIndentDepth) {
            return ' ' + (this.content || '').trim().replace(/(\r?\n(\t*))+/g, ' ').trim() + ' ';
        }
    }]);
    return CommentNode;
}(TextNode_1.TextNode);

exports.CommentNode = CommentNode;