"use strict";
/**
 * Defines all possible permissions and restrictions for one or more tags.
 */

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TagSyntaxRule = function () {
  /**
   * Creates a new tag syntax rule object. **Use static method `createForTagName` instead.**
   */
  function TagSyntaxRule(tagNames) {
    (0, _classCallCheck3.default)(this, TagSyntaxRule);

    this.tagNames = tagNames;
  }
  /**
   * Creates a new syntax rule for a certain tag name.
   * @param tagName The tag name to create the syntax rule for.
   */


  (0, _createClass3.default)(TagSyntaxRule, [{
    key: "getTagNames",

    /**
     * Returns all tag names a rule applies to.
     */
    value: function getTagNames() {
      return [].concat(this.tagNames);
    }
    /**
     * Checks whether a rule applies to a certain tag name. This method is case sensitive.
     * @param tagName The tag name to check.
     */

  }, {
    key: "appliesToTagName",
    value: function appliesToTagName(tagName) {
      return this.tagNames.indexOf(tagName) !== -1;
    }
    /**
     * Returns a rule's current close mode or close modes.
     */

  }, {
    key: "getCloseMode",
    value: function getCloseMode() {
      return this.closeMode;
    }
    /**
     * Sets the rule's allowed tag close modes. This can be a single mode or a combination of modes.
     * @example
     *     rule.setCloseMode(TagCloseMode.SelfClose);
     *     rule.setCloseMode(TagCloseMode.SelfClose | TagCloseMode.Void);
     * @chainable
     * @param mode The close mode to set.
     */

  }, {
    key: "setCloseMode",
    value: function setCloseMode(mode) {
      this.closeMode = mode;
      return this;
    }
  }], [{
    key: "createForTagName",
    value: function createForTagName(tagName) {
      return new TagSyntaxRule([tagName]);
    }
    /**
     * Creates a new syntax rule for one or more tag names.
     * @param tagName The tag name to create the syntax rule for.
     */

  }, {
    key: "createForTagNames",
    value: function createForTagNames() {
      for (var _len = arguments.length, tagNames = Array(_len), _key = 0; _key < _len; _key++) {
        tagNames[_key] = arguments[_key];
      }

      return new TagSyntaxRule(
      // make sure there are no duplicate tag names
      /// TODO: Check whether this is fast enough on large tag name lists.
      tagNames.filter(function (tagName, index, array) {
        return array.indexOf(tagName) === index;
      }));
    }
  }]);
  return TagSyntaxRule;
}();

exports.TagSyntaxRule = TagSyntaxRule;