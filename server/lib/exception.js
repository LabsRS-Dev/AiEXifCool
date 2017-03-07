//from https://github.com/techjacker/custom-errors
var AbstractError = function (constr) {
	// If defined, pass the constr property to V8's
	// captureStackTrace to clean up the output
	Error.captureStackTrace && Error.captureStackTrace(this, constr || this);
};

// Extend our AbstractError from Error
// util.inherits(AbstractError, Error);
AbstractError.prototype = new Error;
AbstractError.super_ = Error;
AbstractError.prototype.constructor = AbstractError;

var ErrorFactory = function (name, proc) {
	var CustomError = function () {
		CustomError.super_.call(this, this.constructor);
        proc.apply(this, arguments);
	};
	CustomError.prototype = new AbstractError;
	CustomError.super_ = AbstractError;
	CustomError.prototype.constructor = CustomError;
	CustomError.prototype.name = name;
    return CustomError;
}

var Exception = ErrorFactory('Exception', function(message){
    this.message = message;
});

Exception.Factory = ErrorFactory;
Exception.Error = AbstractError;

module.exports = Exception;
