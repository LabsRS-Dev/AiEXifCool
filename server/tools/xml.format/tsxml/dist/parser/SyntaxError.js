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

var SyntaxErrorCode_1 = require('./SyntaxErrorCode');

var SyntaxError = function (_Error) {
    (0, _inherits3.default)(SyntaxError, _Error);

    function SyntaxError(errorCode, line, column, source, message) {
        (0, _classCallCheck3.default)(this, SyntaxError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (SyntaxError.__proto__ || (0, _getPrototypeOf2.default)(SyntaxError)).call(this, message));

        _this.errorCode = errorCode;
        _this.line = line;
        _this.column = column;
        _this.source = source;
        _this.source = _this.source || '';
        return _this;
    }

    (0, _createClass3.default)(SyntaxError, [{
        key: 'getMessage',
        value: function getMessage() {
            return this.message;
        }
    }, {
        key: 'getErrorCode',
        value: function getErrorCode() {
            return this.errorCode;
        }
    }, {
        key: 'getErrorName',
        value: function getErrorName() {
            return SyntaxError.getSyntaxErrorCodeName(this.getErrorCode());
        }
    }, {
        key: 'getLine',
        value: function getLine() {
            return this.line;
        }
    }, {
        key: 'getColumn',
        value: function getColumn() {
            return this.column;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'syntax error [' + this.getErrorCode() + ' ' + this.getErrorName() + '] at token \'' + this.getTokenAt(this.line, this.column) + '\' ' + this.getLine() + ', ' + this.getColumn() + ': ' + this.getMessage();
        }
    }, {
        key: 'getTokenAt',
        value: function getTokenAt(line, column) {
            var sourceLine = this.source.split(/\n/)[line - 1];
            if (typeof sourceLine !== 'string') {
                return '';
            }
            return sourceLine.split('')[column - 1];
        }
    }], [{
        key: 'getSyntaxErrorCodeName',
        value: function getSyntaxErrorCodeName(errorCode) {
            return SyntaxErrorCode_1.SyntaxErrorCode[errorCode];
        }
    }]);
    return SyntaxError;
}(Error);

exports.SyntaxError = SyntaxError;