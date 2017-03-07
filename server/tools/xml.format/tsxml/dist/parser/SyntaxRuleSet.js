"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SyntaxRuleSet = function () {
    function SyntaxRuleSet() {
        (0, _classCallCheck3.default)(this, SyntaxRuleSet);

        this.tagSyntaxRules = [];
    }
    /**
     * Creates an instance of the syntax rule set class this static method is called on.
     */


    (0, _createClass3.default)(SyntaxRuleSet, [{
        key: "hasTagSyntaxRule",
        value: function hasTagSyntaxRule(rule) {
            return this.tagSyntaxRules.indexOf(rule) !== -1;
        }
    }, {
        key: "getAllTagSyntaxRules",
        value: function getAllTagSyntaxRules() {
            return [].concat(this.tagSyntaxRules);
        }
        /**
         * @chainable
         */

    }, {
        key: "addTagSyntaxRule",
        value: function addTagSyntaxRule(rule) {
            if (!this.hasTagSyntaxRule(rule)) {
                this.tagSyntaxRules.push(rule);
            }
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: "addTagSyntaxRules",
        value: function addTagSyntaxRules() {
            var _this = this;

            for (var _len = arguments.length, rules = Array(_len), _key = 0; _key < _len; _key++) {
                rules[_key] = arguments[_key];
            }

            rules.forEach(function (rule) {
                return _this.addTagSyntaxRule(rule);
            });
            return this;
        }
    }], [{
        key: "createInstance",
        value: function createInstance() {
            return new this();
        }
    }, {
        key: "isSyntaxRuleSetClass",
        value: function isSyntaxRuleSetClass(candidate) {
            return typeof candidate === 'function' && candidate._syntaxRuleSetBrand_ === SyntaxRuleSet._syntaxRuleSetBrand_;
        }
    }]);
    return SyntaxRuleSet;
}();

SyntaxRuleSet._syntaxRuleSetBrand_ = Math.random();
exports.SyntaxRuleSet = SyntaxRuleSet;