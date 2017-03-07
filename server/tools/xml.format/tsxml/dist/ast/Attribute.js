"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Attribute = function () {
    function Attribute() {
        (0, _classCallCheck3.default)(this, Attribute);
    }

    (0, _createClass3.default)(Attribute, [{
        key: "valueOf",
        value: function valueOf() {
            return this.value;
        }
    }, {
        key: "toString",
        value: function toString() {
            return this.value + '';
        }
    }], [{
        key: "create",
        value: function create(value) {
            return new (function (_Attribute) {
                (0, _inherits3.default)(_class, _Attribute);

                function _class() {
                    var _ref;

                    (0, _classCallCheck3.default)(this, _class);

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = _class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call.apply(_ref, [this].concat(args)));

                    _this.value = value;
                    return _this;
                }

                return _class;
            }(Attribute))();
        }
    }]);
    return Attribute;
}();

exports.Attribute = Attribute;