/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var dist = {};

var pslice = Array.prototype.slice
  , toString = Object.prototype.toString
  , isArray = Array.isArray || isType("Array")
  , isFunction = isType("Function")
;

function noop() {}

function isType(type) {
    return function(t) {
        return toString.call(t) === "[object " + type + "]";
    };
}

function isObject(val) {
    return val !== null && typeof val === 'object';
}

function isUndefined( val ) {
    return typeof val === 'undefined' ;
}

splitEach("Boolean Number String Function RegExp Date File Blod", function(_, t){
    dist["is"+t] = isType(t);
});

function isPlainObject( obj ) {
    return obj && obj.constructor === Object.prototype.constructor;
}

function slice(args, startIndex) {
    return pslice.call(args, startIndex || 0);
}

function inArray(arr, it) {
    return arr && arr.indexOf(it) >=0;
}

function each(obj, iterator, context, _key, _length) {
    if (obj !== null) {
        _length = obj.length;
        if (_length === +_length ) {// array like
            for (_key = 0 ; _key < _length; _key++) {
                if (false === iterator.call(context, _key, obj[_key])) {
                    return obj;
                }
            }
        } else { //object
            for (_key in obj) {
                if (obj.hasOwnProperty(_key)) {
                    if (false ===iterator.call(context, _key, obj[_key])) {
                        return obj;
                    }
                }
            }
        }
    }
    return obj;
}

function extend() { // form jQuery & remove this
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (dist.isBoolean(target)) {
        deep = target;
        target = arguments[ i ] || {};
        i++;
    }
    if ( !isObject(target) && !isFunction(target) ) {
        target = {};
    }
    for ( ; i < length; i++ ) {
        if ( (options = arguments[ i ]) != null ) {
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];
                if ( target !== copy ) {
                    if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[ name ] = extend( deep, clone, copy );
                    } else {
                        target[ name ] = copy;
                    }
                }
            }
        }
    }
    return target;
}

function splitEach(arr, callback, chr, context) {
    return each(arr.split(chr || " "), callback , context);
}

function queue(_done){
    var _next = [];

    function callback(err){
        if (!err){
            var next = _next.shift();
            if (next) {
                var args = arguments;
                args.length ? (args[0] = callback) : (args = [callback]);
                return next.apply(null, args);
            }
        }
        return _done.apply(null, arguments);
    }

    var r = {
        next:function(func){
            _next.push(func);
            return r;
        },
        done:function(func){
            _done = func;
            r.start();
        },
        start:function(){
            callback(null, callback);
        }
    };
    return r;
}

function boolval(str) {
    return str !== '0' && str !== 'false' && str !== '';
}

extend(dist, {
    "isArray" : isArray
  , "noop"    : noop
  , "inArray" : inArray
  , "isUndefined" : isUndefined
  , "isObject" : isObject
  , "isPlainObject":isPlainObject
  , "slice" : slice
  , "each" : each
  , "extend" : extend
  , "splitEach" : splitEach
  , "queue": queue
  , "boolval" : boolval
});

module.exports = dist;
