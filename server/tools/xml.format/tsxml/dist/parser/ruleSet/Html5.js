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

var TagCloseMode_1 = require('../TagCloseMode');
var TagSyntaxRule_1 = require('../TagSyntaxRule');
var SyntaxRuleSet_1 = require('../SyntaxRuleSet');

var Html5 = function (_SyntaxRuleSet_1$Synt) {
    (0, _inherits3.default)(Html5, _SyntaxRuleSet_1$Synt);

    function Html5(allowVoidElementsToSelfClose) {
        (0, _classCallCheck3.default)(this, Html5);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Html5.__proto__ || (0, _getPrototypeOf2.default)(Html5)).call(this));

        if (typeof allowVoidElementsToSelfClose === 'undefined') {
            allowVoidElementsToSelfClose = true;
        }
        // see https://www.w3.org/TR/html-markup/syntax.html#syntax-elements
        var voidTagSyntaxRule = TagSyntaxRule_1.TagSyntaxRule.createForTagNames('area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr');
        if (allowVoidElementsToSelfClose) {
            voidTagSyntaxRule.setCloseMode(TagCloseMode_1.TagCloseMode.Void | TagCloseMode_1.TagCloseMode.SelfClose);
        } else {
            voidTagSyntaxRule.setCloseMode(TagCloseMode_1.TagCloseMode.Void);
        }
        _this.addTagSyntaxRule(voidTagSyntaxRule);
        return _this;
    }

    (0, _createClass3.default)(Html5, null, [{
        key: 'Loose',
        get: function get() {
            return function (_Html) {
                (0, _inherits3.default)(Html5Loose, _Html);

                function Html5Loose() {
                    (0, _classCallCheck3.default)(this, Html5Loose);
                    return (0, _possibleConstructorReturn3.default)(this, (Html5Loose.__proto__ || (0, _getPrototypeOf2.default)(Html5Loose)).call(this, true));
                }

                return Html5Loose;
            }(Html5);
        }
    }, {
        key: 'Strict',
        get: function get() {
            return function (_Html2) {
                (0, _inherits3.default)(Html5Strict, _Html2);

                function Html5Strict() {
                    (0, _classCallCheck3.default)(this, Html5Strict);
                    return (0, _possibleConstructorReturn3.default)(this, (Html5Strict.__proto__ || (0, _getPrototypeOf2.default)(Html5Strict)).call(this, false));
                }

                return Html5Strict;
            }(Html5);
        }
    }]);
    return Html5;
}(SyntaxRuleSet_1.SyntaxRuleSet);

exports.Html5 = Html5;