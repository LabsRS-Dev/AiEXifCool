"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var ast = require('../ast');
var Node_1 = require('../ast/Node');
var SelfClosingNode_1 = require('../ast/SelfClosingNode');
var DocumentNode_1 = require('../ast/DocumentNode');
var ContainerNode_1 = require('../ast/ContainerNode');
var VoidNode_1 = require('../ast/VoidNode');
var SyntaxErrorCode_1 = require('./SyntaxErrorCode');
var SyntaxError_1 = require('./SyntaxError');
var TagCloseMode_1 = require('./TagCloseMode');
var TagSyntaxRule_1 = require('./TagSyntaxRule');
var SyntaxRuleSet_1 = require('./SyntaxRuleSet');
var NodeFlags_1 = require('./NodeFlags');
/**
 * Parsers create a syntax tree from an XML string.
 * PARSER INTERNALS:
 * Parsers see every character in an XML string as a "token". This means that there is no tokenization stage, but rather
 * just a quick (and lazy) mapping of characters to their line and column number. Even without tokenization, XML is
 * fairly simple to parse due to its non-complex syntax. The absence of a tokenization stage means there are less
 * dependencies, less coupling is necessary, which leads to lower maintenance time. Also, we're saving a few CPU cycles
 * and some memory, although performance is not the primary factor for the decision against a dedicated tokenizer.
 * The public interface provided by the parser class encourages the use of static methods, such as
 * `parseStringToAst(...)`, instead of manually creating and handling parser objects (at least for now). Also, these
 * static methods enforce user code to await promises, even though parser code is not **yet** async, but it might become
 * async when (and if) incremental parsing and streams are implemented (incremental parsing might use generators and
 * allow async user code to interfere with the parser).
 * SYNTAX RULES:
 * Parsers can accept some syntax rules, however by default they expect XML (no void tags, unclosed tags are handled as
 * if they were). To override default parsing rules, use the `addTagSyntaxRule(...)` (and similar) methods.
 */

var Parser = function () {
    /**
     * Creates a new parser object. Use the static methods `create*()` or `parse*()` instead of instantiating manually.
     * @param stringToParse The XML string to be parsed.
     */
    function Parser(stringToParse) {
        (0, _classCallCheck3.default)(this, Parser);

        this.stringToParse = stringToParse;
        this.defaultTagSyntaxRule = Parser.createDefaultTagSyntaxRule();
        this.tagSyntaxRules = {};
        this.ast = new DocumentNode_1.DocumentNode();
        this.currentContainerNode = this.getAst();
        this.currentTokenIndex = 0;
    }
    /**
     * Creates a parser object, but does not begin parsing.
     * @param stringToParse The XML string to be parsed.
     */


    (0, _createClass3.default)(Parser, [{
        key: 'getDefaultTagSyntaxRule',

        ///
        /// CONFIGURATION METHODS:
        ///
        value: function getDefaultTagSyntaxRule() {
            return this.defaultTagSyntaxRule;
        }
        /**
         * @chainable
         */

    }, {
        key: 'setDefaultTagSyntaxRule',
        value: function setDefaultTagSyntaxRule(rule) {
            this.defaultTagSyntaxRule = rule;
        }
    }, {
        key: 'getTagSyntaxRuleForTagName',
        value: function getTagSyntaxRuleForTagName(tagName) {
            return this.tagSyntaxRules[tagName] || undefined;
        }
    }, {
        key: 'hasTagSyntaxRuleForTagName',
        value: function hasTagSyntaxRuleForTagName(tagName) {
            var rule = this.getTagSyntaxRuleForTagName(tagName);
            return (typeof rule === 'undefined' ? 'undefined' : (0, _typeof3.default)(rule)) === 'object' && rule !== null;
        }
        /**
         * @chainable
         */

    }, {
        key: 'addTagSyntaxRule',
        value: function addTagSyntaxRule(rule) {
            var _this = this;

            rule.getTagNames().forEach(function (tagName) {
                _this.tagSyntaxRules[tagName] = rule;
            });
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'addTagSyntaxRules',
        value: function addTagSyntaxRules() {
            var _this2 = this;

            for (var _len = arguments.length, rules = Array(_len), _key = 0; _key < _len; _key++) {
                rules[_key] = arguments[_key];
            }

            rules.forEach(function (rule) {
                return _this2.addTagSyntaxRule(rule);
            });
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'removeTagSyntaxRuleForTagName',
        value: function removeTagSyntaxRuleForTagName(tagName) {
            this.tagSyntaxRules[tagName] = undefined;
            return this;
        }
        /**
         * @chainable
         */

    }, {
        key: 'removeTagSyntaxRulesForTagNames',
        value: function removeTagSyntaxRulesForTagNames(tagNames) {
            var _this3 = this;

            tagNames.forEach(function (tagName) {
                return _this3.removeTagSyntaxRuleForTagName(tagName);
            });
            return this;
        }
        /**
         * Applies all rules defined by a syntax rule set to the parser.
         * @chainable
         * @param ruleSet The syntax rule set to apply.
         */

    }, {
        key: 'applySyntaxRuleSet',
        value: function applySyntaxRuleSet(ruleSet) {
            if (SyntaxRuleSet_1.SyntaxRuleSet.isSyntaxRuleSetClass(ruleSet)) {
                ruleSet = ruleSet.createInstance();
            }
            this.addTagSyntaxRules.apply(this, (0, _toConsumableArray3.default)(ruleSet.getAllTagSyntaxRules()));
            return this;
        }
        ///
        /// PUBLIC GETTERS & REQUESTS:
        ///
        /**
         * Returns the syntax tree object the parser creates.
         */

    }, {
        key: 'getAst',
        value: function getAst() {
            return this.ast;
        }
        /**
         * Parses the complete XML string passed to a parser instance.
         */

    }, {
        key: 'parseComplete',
        value: function parseComplete() {
            // don't do anything if the source string is empty
            if (this.stringToParse.length < 1) {
                return;
            }
            while (!this.isAtEndOfInput()) {
                this.parseFromCurrentToken();
            }
        }
        ///
        /// INTERNAL GETTERS & REQUESTS:
        ///
        /**
         * Returns the line the parser's cursor is currently on.
         */

    }, {
        key: 'getCurrentLine',
        value: function getCurrentLine() {
            var tokenMatrix = this.getTokenMatrix();
            if (tokenMatrix[this.getCurrentTokenIndex()]) {
                return tokenMatrix[this.getCurrentTokenIndex()].line;
            } else if (this.getCurrentTokenIndex() === 0) {
                return 1;
            } else {
                return undefined;
            }
        }
        /**
         * Returns the column the parser's cursor is currently at.
         */

    }, {
        key: 'getCurrentColumn',
        value: function getCurrentColumn() {
            var tokenMatrix = this.getTokenMatrix();
            if (tokenMatrix[this.getCurrentTokenIndex()]) {
                return tokenMatrix[this.getCurrentTokenIndex()].column;
            } else if (this.getCurrentTokenIndex() === 0) {
                return 1;
            } else {
                return undefined;
            }
        }
        /**
         * Returns the index of the current token in the XML source string.
         */

    }, {
        key: 'getCurrentTokenIndex',
        value: function getCurrentTokenIndex() {
            return this.currentTokenIndex;
        }
        /**
         * Returns whether the parser's cursor has reached the end of the XML source string.
         */

    }, {
        key: 'isAtEndOfInput',
        value: function isAtEndOfInput() {
            return this.getCurrentTokenIndex() >= this.stringToParse.length;
        }
        /**
         * Returns the token at a certain index in the XML source string.
         */

    }, {
        key: 'getTokenAtIndex',
        value: function getTokenAtIndex(index) {
            return this.stringToParse[index];
        }
        /**
         * Return the token at the current cursor index.
         */

    }, {
        key: 'getCurrentToken',
        value: function getCurrentToken() {
            return this.getTokenAtIndex(this.getCurrentTokenIndex());
        }
        /**
         * Returns a range of tokens from the source XML string.
         * @param startIndex The index of the first token in the requested range.
         * @param endIndex The index of the last token in the requested range (inclusive).
         */

    }, {
        key: 'getTokenRange',
        value: function getTokenRange(startIndex, endIndex) {
            /// TODO: Prevent this from returning ranges that go "beyond" the end of the source string.
            return this.stringToParse.slice(startIndex, endIndex);
        }
        /**
         * Returns a range of tokens from the source XML string.
         * @param startIndex The index of the first token in the requested range.
         * @param length The length of the range to be returned.
         */

    }, {
        key: 'getTokenRangeStartingAt',
        value: function getTokenRangeStartingAt(startIndex, length) {
            return this.stringToParse.slice(startIndex, startIndex + length);
        }
        /**
         * Returns the token that follows the token the cursor is currently at.
         */

    }, {
        key: 'getNextToken',
        value: function getNextToken() {
            return this.getTokenAtIndex(this.getCurrentTokenIndex() + 1);
        }
        /**
         * Returns the token that preceeds the token the cursor is currently at.
         */

    }, {
        key: 'getPreviousToken',
        value: function getPreviousToken() {
            return this.getTokenAtIndex(this.getCurrentTokenIndex() - 1);
        }
        /**
         * Finds the first occurence of a certain token after in the source XML string after a certain token index and
         * returns the index of the searched token.
         * @param token The token to find.
         * @param startIndex The index at which to start searching.
         */

    }, {
        key: 'findFirstOccurenceOfTokenAfterIndex',
        value: function findFirstOccurenceOfTokenAfterIndex(token, startIndex) {
            return this.stringToParse.indexOf(token[0], startIndex);
        }
        /**
         * Checks if a certain token occurs before the next occurence of another token.
         * @param token The token to check if it occurs before `otherToken`.
         * @param otherToken The token before which `token` must occur for this method to return `true`.
         * @param startIndex The index at which to start searching for `token` and `otherToken`.
         */

    }, {
        key: 'doesTokenOccurBeforeNextOccurenceOfOtherToken',
        value: function doesTokenOccurBeforeNextOccurenceOfOtherToken(token, otherToken, startIndex) {
            var tokenIndex = this.findFirstOccurenceOfTokenAfterIndex(token, startIndex),
                otherTokenIndex = this.findFirstOccurenceOfTokenAfterIndex(otherToken, startIndex);
            if (tokenIndex < 0 || otherTokenIndex < 0) {
                return false;
            }
            return tokenIndex < otherTokenIndex;
        }
        /**
         * Returns the container ast node the parser is currently parsing into, depending on the semantic context around the
         * cursor. At the start and end of each parsing run, this will return the outermost `DocumentNode` of the syntax tree.
         */

    }, {
        key: 'getCurrentContainerNode',
        value: function getCurrentContainerNode() {
            return this.currentContainerNode;
        }
    }, {
        key: 'descendInto',
        value: function descendInto(containerNode) {
            this.currentContainerNode = containerNode;
        }
    }, {
        key: 'ascend',
        value: function ascend() {
            if (!(this.currentContainerNode.parentNode instanceof ContainerNode_1.ContainerNode)) {
                this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.Unknown, 'can not ascend: current containing node has no parent node'));
            }
            this.currentContainerNode = this.currentContainerNode.parentNode;
        }
        ///
        /// SYNTAX ERROR HANDLING & FACTORY METHODS:
        /// The following methods help creating and raising syntax errors.
        ///

    }, {
        key: 'createSyntaxError',
        value: function createSyntaxError(errorCode, line, column, message) {
            return new SyntaxError_1.SyntaxError(errorCode, line, column, this.stringToParse, message);
        }
    }, {
        key: 'createSyntaxErrorAtCurrentToken',
        value: function createSyntaxErrorAtCurrentToken(errorCode, message) {
            return this.createSyntaxError(errorCode, this.getCurrentLine(), this.getCurrentColumn(), message);
        }
    }, {
        key: 'createUnexpectedTokenSyntaxErrorAtCurrentToken',
        value: function createUnexpectedTokenSyntaxErrorAtCurrentToken(message) {
            message = message || 'token can not be parsed';
            return this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.UnexpectedToken, message);
        }
        /**
         * Raises an error. Use this method instead of throwing manually so errors can be logged or modified by the parser
         * before it is thrown.
         * @throws
         * @param error The error to raise.
         */

    }, {
        key: 'raiseError',
        value: function raiseError(error) {
            throw error;
        }
        ///
        /// SYNTAX RULE LOOKUPS:
        ///

    }, {
        key: 'getOverrideOrDefaultTagSyntaxRuleForTagName',
        value: function getOverrideOrDefaultTagSyntaxRuleForTagName(tagName) {
            return this.getTagSyntaxRuleForTagName(tagName) || this.getDefaultTagSyntaxRule();
        }
        /**
         * Returns all tag close modes allowed for a certain tag name. The returned modes are either defined by tag syntax
         * rules or fall back to the default if no syntax rule for the given tag name exists.
         */

    }, {
        key: 'getAllowedTagCloseModesForTagName',
        value: function getAllowedTagCloseModesForTagName(tagName) {
            return this.getOverrideOrDefaultTagSyntaxRuleForTagName(tagName).getCloseMode();
        }
    }, {
        key: 'isCloseModeAllowedForTagName',
        value: function isCloseModeAllowedForTagName(tagName, closeMode) {
            if (!Parser.isSingularCloseMode(closeMode)) {
                throw new Error('Rule lookup failed: tag close mode must not be a combination of close modes.');
            }
            return (this.getAllowedTagCloseModesForTagName(tagName) & closeMode) === closeMode;
        }
        ///
        /// TOKEN IDENTIFICATION & CLASSIFICATION UTILITIES:
        /// Methods that help identifying certain tokens.
        ///

    }, {
        key: 'moveByNumberOfTokens',

        ///
        /// TOKEN ITERATION METHODS:
        /// These methods handle the iteration over the XML string that is being parsed. Only use
        /// the methods provided here to iterate over, move along, look at (back or ahead) the XML
        /// string, don't do this manually.
        ///
        value: function moveByNumberOfTokens(numberOfTokens) {
            this.currentTokenIndex += numberOfTokens;
        }
    }, {
        key: 'goBackByNumberOfTokens',
        value: function goBackByNumberOfTokens(numberOfTokens) {
            this.moveByNumberOfTokens(0 - Math.abs(numberOfTokens));
        }
    }, {
        key: 'goBackToPreviousToken',
        value: function goBackToPreviousToken() {
            this.goBackByNumberOfTokens(1);
        }
    }, {
        key: 'advanceByNumberOfTokens',
        value: function advanceByNumberOfTokens(numberOfTokens) {
            this.moveByNumberOfTokens(Math.abs(numberOfTokens));
        }
    }, {
        key: 'advanceToNextToken',
        value: function advanceToNextToken() {
            this.advanceByNumberOfTokens(1);
        }
        ///
        /// PARSING METHODS:
        /// All methods that actually parse XML into AST nodes. 
        ///

    }, {
        key: 'parseFromCurrentToken',
        value: function parseFromCurrentToken() {
            if (this.isAtEndOfInput()) {
                return;
            }
            switch (true) {
                default:
                    this.parseIntoNewTextNode();
                    break;
                case typeof this.getCurrentToken() !== 'string':
                case Parser.isWhitespaceToken(this.getCurrentToken()) || this.getCurrentToken() === '\r' || this.getCurrentToken() === '\n':
                    this.advanceToNextToken();
                    break;
                case this.getCurrentToken() === '<':
                    this.parseFromOpenAngleBracket();
                    break;
            }
        }
        /**
         * Called when the parser is at an open angle bracket (`<`) and needs to decide how to parse upcoming tokens.
         * This method looks ahead to decide whether the open angle bracket is the beginning of an XML tag, or if it's the
         * beginning of text node content, so either:
         *     <foo...
         *     ^       here
         * or:
         *     <foo><</foo>
         *          ^ here
         *
         * Keep in mind that this method must *only* be called in these two cases, all other possible occurences of open
         * angle brackets are handled in more specific methods (namely when parsing CDATA or comments), which are not
         * ambiguous (comments and CDATA nodes have delimiters that clearly indicate where their content begins and ends,
         * text nodes do not have this).
         * The same goes for attributes: An open angle bracket in a properly quoted attribute string is always going to be
         * parsed as an attribute value.
         * An open angle bracket in an attribute value *that is not enclosed by quotes* is always a syntax error:
         *     <foo bar="1<2" />
         *                ^       OK, but does not concern this method
         *     <foo bar=1<2 />
         *               ^        NOT OK, always a syntax error. Also doesn't concern this method.
         */

    }, {
        key: 'parseFromOpenAngleBracket',
        value: function parseFromOpenAngleBracket() {
            // If:
            //     the next token does not indicate a CDATA node, comment, PI or MDO
            //   and:
            //     there's another open angle bracket before the next occurence of a closing angle bracket
            // assume that the current open angle bracket is text node content. In all other cases, assume that the current
            // open angle bracket indicates
            // the bginning of a new tag.
            if (this.getNextToken() !== '!' && this.getNextToken() !== '?' && this.doesTokenOccurBeforeNextOccurenceOfOtherToken('<', '>', this.getCurrentTokenIndex() + 1) && !this.doesTokenOccurBeforeNextOccurenceOfOtherToken('"', '<', this.getCurrentTokenIndex() + 1) && !this.doesTokenOccurBeforeNextOccurenceOfOtherToken('\'', '<', this.getCurrentTokenIndex() + 1)) {
                this.parseIntoNewTextNode();
            } else {
                this.parseFromBeginningOfTag();
            }
        }
        /**
         * Creates a new text node, appends it to the ast and parses all upcoming text into it. Stops parsing at the first
         * character that can not be considered text anymore.
         */

    }, {
        key: 'parseIntoNewTextNode',
        value: function parseIntoNewTextNode() {
            var textNode = new ast.TextNode();
            textNode.content = '';
            this.getCurrentContainerNode().appendChild(textNode);
            // skip all whitespace
            while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                this.advanceToNextToken();
            }
            while (!this.isAtEndOfInput()) {
                // If the current token is an open angle bracket ('<'), we could have the following two situations:
                //     <a>123</a>
                //           ^
                // or:
                //     <a>123<456</a>
                //           ^
                // To distinguish between these situations, we have to check whether another open angle bracket appears
                // before the next closing bracket:
                //     <a>123</a>
                //           ^  |
                //              ^ — There's no other open angle bracket before the closing one, hence
                //                  the open angle bracket opens the closing tag.
                // or:
                //     <a>123<123</a>
                //           ^   |
                //               ^ — There is indeed another open angle bracket before the closing one,
                //                   hence the open angle bracket we're at right now does *not* open the
                //                   closing tag.
                if (this.getCurrentToken() === '<' && !this.doesTokenOccurBeforeNextOccurenceOfOtherToken('<', '>', this.getCurrentTokenIndex() + 1)) {
                    // we're at the start of the closing tag, so don't collect any further text content
                    break;
                }
                textNode.content += this.getCurrentToken();
                this.advanceToNextToken();
            }
        }
        /**
         * Parses from the beginning of any kind of tag. The cursor is expected to point at the open angle bracket of the tag,
         * such as:
         *     <xsl:stylesheet ...
         *     ^
         * Comments and CDATA sections are also supported by this method. Depending on the kind of tag (MDO, PI, normal, etc),
         * this method will delegate parsing the tag to other more specific methods.
         */

    }, {
        key: 'parseFromBeginningOfTag',
        value: function parseFromBeginningOfTag() {
            // Find out if we're dealing with a "normal" node here or with a MDO (markup declaration opener), PI (processing
            // instruction) or comment.
            // We will not know whether the node is self closing, or if it has child nodes or text content, but we know just
            // enough to delegate the node to a more dedicated parsing method.
            switch (true) {
                default:
                    this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected exclamation mark, question mark or alphabetic tag name'));
                    break;
                // The node is a normal tag if it starts with an alphabetic token, such as:
                //     <foo ...
                //      ^
                // or:
                //     <a alpha="1" />
                //      ^
                case Parser.isTokenLegalInTagNameOrTagNameNamespacePrefix(this.getNextToken()):
                    this.parseFromBeginningOfNormalNode();
                    break;
                // The node is a close tag if it starts with an open angle bracket followed by a slash, such as:
                //     </foo>
                //     ^^
                // or:
                //     </ foo>
                //     ^^
                case this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) === '</':
                    this.parseFromBeginningOfCloseTag();
                    break;
                // If the node's tag name starts with an exclamation mark, the node is either a, CDATA section, MDO or a comment:
                //     <![CDATA[ ...
                //      ^
                // or:
                //     <!DOCTYPE ...
                //      ^
                // or:
                //     <!-- ...
                //      ^
                case this.getNextToken() === '!':
                    // Look ahead at the next character(s) to decide whether the node is a CDATA section, MDO or a comment.
                    switch (true) {
                        default:
                            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected declaration opener or comment node'));
                            break;
                        // There's a CDATA opener coming up
                        //     <![CDATA[ ...
                        //       ^^^^^^^
                        case this.getTokenRangeStartingAt(this.getCurrentTokenIndex() + 2, 7) === '[CDATA[':
                            this.parseFromBeginningOfCDataSectionNode();
                            break;
                        // There's an alphabetic token following the exclamation mark, so it's an MDO node:
                        //     <!DOCTYPE ...
                        //       ^
                        case Parser.isAlphabeticToken(this.getTokenAtIndex(this.getCurrentTokenIndex() + 2)):
                            this.parseFromBeginningOfDeclarationOpenerNode();
                            break;
                        // If there's a double hyphen following the exclamation mark, it's always a comment:
                        //     <!-- ...
                        //       ^^
                        case this.getTokenRangeStartingAt(this.getCurrentTokenIndex() + 2, 2) === '--':
                            this.parseFromBeginningOfCommentNode();
                            break;
                    }
                    break;
                // If the node's tag name starts with a question mark, the node is a PI:
                //     <?svg ...
                //      ^
                case this.getNextToken() === '?':
                    this.parseFromBeginningOfProcessingInstructionNode();
                    break;
            }
        }
    }, {
        key: 'parseFromBeginningOfNormalNode',
        value: function parseFromBeginningOfNormalNode() {
            // Validate that we actually have a "normal" node:
            if (!Parser.isTokenLegalInTagNameOrTagNameNamespacePrefix(this.getNextToken())) {
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of tag name, got \'' + this.getNextToken() + '\''));
            }
            // we assume all "normal" nodes to be self closing until proven they're not:
            var node = new SelfClosingNode_1.SelfClosingNode();
            this.getCurrentContainerNode().appendChild(node);
            // Skip over the node opener:
            //     <alpha ...
            //     ^      we're here
            this.advanceToNextToken();
            // check for illegal characters at the beginning of the tag name
            if (this.getCurrentToken() === '.') {
                this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.InvalidTagName, 'expected beginning of tag name, got \'' + this.getCurrentToken() + '\''));
            }
            //     <alpha
            //      ^      we're here
            this.parseCompleteOpeningTagInto(node, true, false);
            return;
        }
    }, {
        key: 'findUnclosedNodeMatchingTagName',
        value: function findUnclosedNodeMatchingTagName(tagNameInfo) {
            var containerNode = this.getCurrentContainerNode();
            do {
                if (containerNode.parserFlags & NodeFlags_1.NodeFlags.Closed || containerNode.namespacePrefix !== tagNameInfo.namespacePrefix || containerNode.tagName !== tagNameInfo.tagName) {
                    continue;
                }
                return containerNode;
            } while ((containerNode = containerNode.parentNode) && containerNode.parentNode instanceof Node_1.Node);
        }
    }, {
        key: 'parseFromBeginningOfCloseTag',
        value: function parseFromBeginningOfCloseTag() {
            // Validate that we actually have a close tag:
            if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) !== '</') {
                var message = 'expected beginning of close tag (</...), got \'' + this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) + '\'';
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(message));
            }
            // Skip over the tag opener:
            //     </alpha ...
            //     ^      we're here
            this.advanceByNumberOfTokens(2);
            //     </alpha
            //       ^      we're here
            // we now parse the tag name and check if there are any unclosed container nodes with the exact same tag name
            var tagNameInfo = this.parseTagName(),
                closedNode = this.findUnclosedNodeMatchingTagName(tagNameInfo);
            if (!(closedNode instanceof ContainerNode_1.ContainerNode)) {
                this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.ExcessCloseTag, 'close tag \'' + tagNameInfo.tagName + '\' has no open tag'));
            }
            if (this.getCurrentToken() !== '>') {
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected end of close tag, got \'' + this.getCurrentToken() + '\''));
            }
            this.advanceToNextToken();
            this.ascend();
            return;
        }
    }, {
        key: 'parseFromBeginningOfDeclarationOpenerNode',
        value: function parseFromBeginningOfDeclarationOpenerNode() {
            // Validate that we actually have an MDO node:
            if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) !== '<!') {
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of declaration opener (<!)'));
            }
            // We know this is actually an MDO node, so create the tree member and append it
            var mdoNode = new ast.DeclarationOpenerNode();
            this.getCurrentContainerNode().appendChild(mdoNode);
            // Skip over the MDO opener:
            //     <!DOCTYPE ...
            //     ^      we're here
            this.advanceByNumberOfTokens(2);
            //     <!DOCTYPE
            //       ^      we're here
            this.parseCompleteOpeningTagInto(mdoNode, false, true);
            return;
        }
    }, {
        key: 'parseFromBeginningOfProcessingInstructionNode',
        value: function parseFromBeginningOfProcessingInstructionNode() {
            // Validate that we actually have a PI node:
            if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) !== '<?') {
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of processing instruction (<?)'));
            }
            // We know this is actually a PI node, so create the tree member and append it
            var piNode = new ast.ProcessingInstructionNode();
            this.getCurrentContainerNode().appendChild(piNode);
            // Skip over the PI opener:
            //     <?svg ...
            //     ^      we're here
            this.advanceByNumberOfTokens(2);
            //     <?svg
            //       ^      we're here
            this.parseCompleteOpeningTagInto(piNode, false, false);
            return;
        }
        /**
         * Parses a CDATA section.
         * @see https://www.w3.org/TR/xml/#sec-cdata-sect
         */

    }, {
        key: 'parseFromBeginningOfCDataSectionNode',
        value: function parseFromBeginningOfCDataSectionNode() {
            // Validate that we actually have a CDATA section node:
            if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 9) !== '<![CDATA[') {
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of CDATA section (<![CDATA[)'));
            }
            // We know this is actually a CDATA section node, so create the tree member and append to its content as long
            // as it isn't closed by ']]>'.
            var cdataNode = new ast.CDataSectionNode();
            this.getCurrentContainerNode().appendChild(cdataNode);
            // Skip over the CDATA opener:
            //     <![CDATA[
            //     ^      we're here
            this.advanceByNumberOfTokens(9);
            //     <![CDATA[
            //             ^      we're here
            // Start appending to the content:
            cdataNode.content = '';
            while (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 3) !== ']]>') {
                cdataNode.content += this.getCurrentToken();
                this.advanceToNextToken();
            }
            // Skip to after the end of the comment node:
            //     <![CDATA[...]]>
            //                ^      we're here
            this.advanceByNumberOfTokens(3);
            //     <![CDATA[...]]>
            //                    ^      we're now here
            return;
        }
    }, {
        key: 'parseFromBeginningOfCommentNode',
        value: function parseFromBeginningOfCommentNode() {
            // Validate that we actually have a comment node:
            if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 4) !== '<!--') {
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of comment (<!--)'));
            }
            // We know this is actually a comment node, so create the tree member and append to its content as long as the
            // comment node is not closed by `-->`.
            var commentNode = new ast.CommentNode();
            this.getCurrentContainerNode().appendChild(commentNode);
            // Skip over the comment opener:
            //     <!--
            //     ^      we're here
            this.advanceByNumberOfTokens(4);
            //     <!--
            //         ^      we're here
            // Start appending to the comment's content:
            commentNode.content = '';
            while (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 3) !== '-->') {
                commentNode.content += this.getCurrentToken();
                this.advanceToNextToken();
            }
            // Skip to after the end of the comment node:
            //     <!-- some comment text, maybe with line breaks -->
            //                                                   ^      we're here
            this.advanceByNumberOfTokens(3);
            //     <!-- some comment text, maybe with line breaks -->
            //                                                       ^      we're now here
            return;
        }
    }, {
        key: 'parseCompleteOpeningTagInto',

        /**
         * Parses a complete opening tag with namespace prefix, tag name and attributes into a given node. This method will
         * decide whether the node it is parsing is a container node or a void node and upgrade the node passed into it in
         * param `node` to the respective ast node type.
         * The cursor is expected to be pointing at the first token after the tag opener:
         * for "normal" nodes:
         *     <alpha ...
         *      ^
         * for MDOs:
         *     <!DOCTYPE ...
         *       ^
         * for CDATA sections:
         *     <![CDATA[ ...
         *       ^
         * for PIs:
         *     <?svg ...
         *       ^
         * @param node The node to parse namespace prefix, tag name and attributes into.
         * @param allowDescendingIntoNewContainerNode Whether the parser should be allowed to descend if this method
         * discovers that the node it is parsing is a container node.
         * @param allowSystemLiterals Whether system literals should be allowed in the parsed tag.
         */
        value: function parseCompleteOpeningTagInto(node, allowDescendingIntoNewContainerNode, allowSystemLiterals) {
            // we could now be in any of the following constructs:
            //     <alpha ...
            //      ^
            // or:
            //     <!DOCTYPE ...
            //       ^
            // or:
            //     <![CDATA[ ...
            //       ^
            // or:
            //     <?svg ...
            //       ^
            this.parseTagNameInto(node);
            if (this.getCurrentToken() !== '?' && this.getCurrentToken() !== '>') {
                this.parseAttributeListInto(node, allowSystemLiterals);
            }
            // skip all whitespace
            while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                this.advanceToNextToken();
            }
            switch (true) {
                default:
                    this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected end of opening tag'));
                    break;
                // self closing node
                case this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) === '/>':
                    // raise an error if the current node is not allowed to self close
                    if (!this.isCloseModeAllowedForTagName(node.tagName, TagCloseMode_1.TagCloseMode.SelfClose)) {
                        this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.IllegalSelfClose, 'tag \'' + node.tagName + '\' must not self-close'));
                    }
                    node.parserFlags |= NodeFlags_1.NodeFlags.SelfClosing;
                    this.advanceByNumberOfTokens(2);
                    return;
                // processing instruction
                case this.getCurrentToken() === '?':
                    this.advanceToNextToken();
                // ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓   FALL THROUGH   ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
                // container node
                case this.getCurrentToken() === '>':
                    this.parseEndOfNonSelfClosingOpeningTag(node, allowDescendingIntoNewContainerNode);
                    this.advanceToNextToken();
                    break;
            }
        }
        /**
         * Parses the end of opening tags that are not self closing. This method will decide whether the node it is parsing
         * is a container node or a void node and upgrade the node passed into it in param `node` to the respective ast node
         * type.
         * @param node The node to parse namespace prefix, tag name and attributes into.
         * @param allowDescendingIntoNewContainerNode Whether the parser should be allowed to descend if this method discovers
         *                                            that the node it is parsing is a container node.
         */

    }, {
        key: 'parseEndOfNonSelfClosingOpeningTag',
        value: function parseEndOfNonSelfClosingOpeningTag(node, allowDescendingIntoNewContainerNode) {
            if (!(node instanceof SelfClosingNode_1.SelfClosingNode)) {
                return;
            }
            if (this.isCloseModeAllowedForTagName(node.tagName, TagCloseMode_1.TagCloseMode.Void)) {
                var voidNode = Parser.createVoidNodeFromOtherNode(node);
                node.parentNode.replaceChild(node, voidNode);
                node = voidNode;
                node.parserFlags |= NodeFlags_1.NodeFlags.Void;
            } else {
                var containerNode = Parser.createContainerNodeFromOtherNode(node);
                node.parentNode.replaceChild(node, containerNode);
                node.parserFlags |= NodeFlags_1.NodeFlags.Opened;
                if (allowDescendingIntoNewContainerNode) {
                    this.descendInto(containerNode);
                }
            }
        }
    }, {
        key: 'parseTagName',
        value: function parseTagName() {
            // this will be set to `true` as soon as the first colon was seen
            var colonSeen = false,
                nameStash = '',
                tagNameInfo = {
                namespacePrefix: undefined,
                tagName: undefined
            };
            // we could now be in any of the following constructs:
            //     <alpha ...
            //      ^
            //     <alpha:beta ...
            //      ^
            // or:
            //     <!DOCTYPE ...
            //       ^
            // or:
            //     <?svg ...
            //       ^
            while (Parser.isTokenLegalInTagNameOrTagNameNamespacePrefix(this.getCurrentToken()) || this.getCurrentToken() === ':') {
                if (this.getCurrentToken() === ':') {
                    if (colonSeen) {
                        this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.IllegalNamespacePrefix, 'illegal multiple namespace prefix (multiple colons in tag name)'));
                    }
                    colonSeen = true;
                    tagNameInfo.namespacePrefix = nameStash;
                    nameStash = '';
                    this.advanceToNextToken();
                    if (!Parser.isAlphabeticToken(this.getCurrentToken())) {
                        this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.MissingTagNameAfterNamespacePrefix, 'namespace prefix must be followed by a tag name'));
                        return;
                    }
                }
                nameStash += this.getCurrentToken();
                this.advanceToNextToken();
            }
            tagNameInfo.tagName = nameStash;
            return tagNameInfo;
        }
        /**
         * Parses a tag name into an AST node. Supports namespace prefixes.
         * @param node The AST node to parse the tag name into.
         */

    }, {
        key: 'parseTagNameInto',
        value: function parseTagNameInto(node) {
            var tagNameInfo = this.parseTagName();
            node.namespacePrefix = tagNameInfo.namespacePrefix;
            node.tagName = tagNameInfo.tagName;
        }
        /**
         * Parses a complete attribute list into a node.
         * @param node The node to parse the attribute list into.
         * @param allowLiterals Whether literals are allowed or not. When this is `false`, the method will raise a syntax
         *                      error if a literal is encountered.
         */

    }, {
        key: 'parseAttributeListInto',
        value: function parseAttributeListInto(node, allowLiterals) {
            // We are now at the first token after the opening tag name, which could be either whitespace, the end of the
            // opening tag or the start of a system literal:
            //     <alpha fibo="nacci"...
            //           ^
            // or:
            //     <alpha>
            //           ^
            // or:
            //     <alpha />
            //           ^
            // or:
            //     <alpha/>
            //           ^
            // or:
            //     <alpha"FOO"/>
            //           ^
            if (!Parser.isWhitespaceToken(this.getCurrentToken()) && this.getCurrentToken() !== '/' && this.getCurrentToken() !== '>') {
                if (!allowLiterals && this.getCurrentToken() === '"') {
                    this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected whitespace or end of opening tag'));
                }
            }
            // skip all whitespace
            while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                this.advanceToNextToken();
            }
            // if there's no alphabetic token here, there are no attributes to be parsed
            if (!Parser.isAlphabeticToken(this.getCurrentToken()) && !allowLiterals && this.getCurrentToken() !== '"') {
                return;
            }
            // advance until there are no attributes and literals to be parsed
            while (this.getCurrentToken() !== '>' && this.getCurrentToken() !== '/' && this.getCurrentToken() !== '?') {
                if (this.getCurrentToken() === '"') {
                    if (!allowLiterals) {
                        this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('system literal not allowed on this node'));
                    }
                    node.appendToSystemLiteralList(this.parseLiteral());
                } else {
                    var attrInfo = this.parseAttribute();
                    /// TODO:
                    /// Empty attribute names should never happen (see issue #7). Find out why this happens, fix it, then
                    /// remove the `continue` workaround below.
                    if (attrInfo.name === '') {
                        continue;
                    }
                    node.setAttribute(attrInfo.name, attrInfo.value);
                    // skip all whitespace
                    while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                        this.advanceToNextToken();
                    }
                }
            }
        }
    }, {
        key: 'parseLiteral',
        value: function parseLiteral() {
            var value = '';
            // skip all whitespace
            while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                this.advanceToNextToken();
            }
            var valueQuoteCharacter = this.getCurrentToken();
            while (!this.isAtEndOfInput()) {
                this.advanceToNextToken();
                if (this.getCurrentToken() === valueQuoteCharacter) {
                    break;
                }
                value += this.getCurrentToken();
            }
            this.advanceToNextToken();
            return value;
        }
    }, {
        key: 'parseAttribute',
        value: function parseAttribute() {
            var name = '',
                value,
                valueQuoteCharacter,
                colonSeen = false,
                getAttrInfo = function getAttrInfo() {
                return { name: name, value: value };
            };
            // skip all whitespace
            while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                this.advanceToNextToken();
            }
            // advance as long as we're in the attribute's name
            while (Parser.isTokenLegalInAttributeNameOrAttributeNameNameNamespacePrefix(this.getCurrentToken()) || this.getCurrentToken() === ':') {
                if (this.getCurrentToken() === ':') {
                    if (colonSeen) {
                        this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.IllegalNamespacePrefix, 'illegal multiple namespace prefix (multiple colons in tag name)'));
                    }
                    colonSeen = true;
                    if (!Parser.isAlphabeticToken(this.getNextToken())) {
                        this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.MissingTagNameAfterNamespacePrefix, 'namespace prefix must be followed by a tag name'));
                        return;
                    }
                }
                name += this.getCurrentToken();
                this.advanceToNextToken();
            }
            // skip all whitespace after the attribute name
            while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                this.advanceToNextToken();
            }
            // if there's no equal sign here, the attribute is empty:
            if (this.getCurrentToken() !== '=') {
                return getAttrInfo();
            }
            this.advanceToNextToken();
            if (Parser.isWhitespaceToken(this.getCurrentToken()) || this.getCurrentToken() === '"' || this.getCurrentToken() === '\'') {
                // skip all whitespace after the equal sign
                while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                    this.advanceToNextToken();
                }
                if (this.getCurrentToken() === '"' || this.getCurrentToken() === '\'') {
                    valueQuoteCharacter = this.getCurrentToken();
                } else {
                    return getAttrInfo();
                }
            }
            value = '';
            while (!this.isAtEndOfInput()) {
                this.advanceToNextToken();
                if (this.getCurrentToken() === valueQuoteCharacter) {
                    this.advanceToNextToken();
                    break;
                }
                value += this.getCurrentToken();
            }
            return getAttrInfo();
        }
        ///
        /// MISC METHODS & PROPERTIES:
        ///

    }, {
        key: 'getTokenMatrix',
        value: function getTokenMatrix() {
            if ((0, _typeof3.default)(this.tokenMatrix) !== 'object' || this.tokenMatrix === null) {
                this.createTokenMatrix();
            }
            return this.tokenMatrix;
        }
    }, {
        key: 'createTokenMatrix',
        value: function createTokenMatrix() {
            var line = 1,
                column = 0;
            this.tokenMatrix = new Array(this.stringToParse.length);
            for (var i = 0; i < this.stringToParse.length; i++) {
                column += 1;
                var currentToken = this.stringToParse[i];
                this.tokenMatrix[i] = { line: line, column: column };
                if (currentToken === '\n') {
                    line += 1;
                    column = 0;
                }
            }
        }
    }], [{
        key: 'createForXmlString',
        value: function createForXmlString(stringToParse) {
            return new Parser(stringToParse);
        }
        /**
         * Parses an XML string and returns the parser object that parsed the string.
         * @see Parser.parseStringToAst(...)
         * @param stringToParse The XML string to be parsed.
         * @param ruleSet The sytnax rule set to apply to the parser. Optional. The parser falls back to default XML parsing
         *                rules when no other rules are provided.
         */

    }, {
        key: 'parseString',
        value: function parseString(stringToParse, ruleSet) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee() {
                var parser;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                parser = Parser.createForXmlString(stringToParse);

                                if (ruleSet instanceof SyntaxRuleSet_1.SyntaxRuleSet || SyntaxRuleSet_1.SyntaxRuleSet.isSyntaxRuleSetClass(ruleSet)) {
                                    parser.applySyntaxRuleSet(ruleSet);
                                }
                                parser.parseComplete();
                                return _context.abrupt('return', parser);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
        /**
         * Parses an XML string and returns a syntax tree.
         * @see Parser.parseString(...)
         * @param stringToParse The XML string to be parsed.
         * @param ruleSet The sytnax rule set to apply to the parser. Optional. The parser falls back to default XML parsing
         *                rules when no other rules are provided.
         */

    }, {
        key: 'parseStringToAst',
        value: function parseStringToAst(stringToParse, ruleSet) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return Parser.parseString(stringToParse, ruleSet);

                            case 2:
                                return _context2.abrupt('return', _context2.sent.getAst());

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: 'isSingularCloseMode',
        value: function isSingularCloseMode(closeMode) {
            return closeMode in TagCloseMode_1.TagCloseMode;
        }
    }, {
        key: 'createDefaultTagSyntaxRule',
        value: function createDefaultTagSyntaxRule() {
            var rule = TagSyntaxRule_1.TagSyntaxRule.createForTagName(undefined);
            rule.setCloseMode(TagCloseMode_1.TagCloseMode.Tag | TagCloseMode_1.TagCloseMode.SelfClose);
            return rule;
        }
    }, {
        key: 'isAlphabeticToken',
        value: function isAlphabeticToken(token) {
            return (/[a-z]/i.test(token[0])
            );
        }
    }, {
        key: 'isNumericToken',
        value: function isNumericToken(token) {
            return (/[0-9]/i.test(token[0])
            );
        }
    }, {
        key: 'isWhitespaceToken',
        value: function isWhitespaceToken(token) {
            token = token[0];
            return token === ' ' || token === '\t' || token === '\r' || token === '\n';
        }
    }, {
        key: 'isTokenLegalInTagNameOrTagNameNamespacePrefix',
        value: function isTokenLegalInTagNameOrTagNameNamespacePrefix(token) {
            return Parser.isAlphabeticToken(token) || Parser.isNumericToken(token) || token[0] === '-' || token[0] === '_' || token[0] === '.';
        }
    }, {
        key: 'isTokenLegalInAttributeNameOrAttributeNameNameNamespacePrefix',
        value: function isTokenLegalInAttributeNameOrAttributeNameNameNamespacePrefix(token) {
            return Parser.isAlphabeticToken(token) || Parser.isNumericToken(token) || token[0] === '-' || token[0] === '_';
        }
    }, {
        key: 'createContainerNodeFromOtherNode',
        value: function createContainerNodeFromOtherNode(node) {
            var containerNode = new ContainerNode_1.ContainerNode();
            containerNode.namespacePrefix = node.namespacePrefix;
            containerNode.tagName = node.tagName;
            node.getAllAttributeNames().forEach(function (attrName) {
                return containerNode.setAttribute(attrName, node.getAttribute(attrName));
            });
            return containerNode;
        }
    }, {
        key: 'createVoidNodeFromOtherNode',
        value: function createVoidNodeFromOtherNode(node) {
            var voidNode = new VoidNode_1.VoidNode();
            voidNode.namespacePrefix = node.namespacePrefix;
            voidNode.tagName = node.tagName;
            node.getAllAttributeNames().forEach(function (attrName) {
                return voidNode.setAttribute(attrName, node.getAttribute(attrName));
            });
            return voidNode;
        }
    }]);
    return Parser;
}();

exports.Parser = Parser;