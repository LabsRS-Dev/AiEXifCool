var _ = require('./utils');

function ajaxSend(res, error, data, msg, format, callback){
    var r = {
        error:error,
        data:data || {},
        msg:msg || ''
    };
    if (callback) {// jsonp
        res.setHeader('Content-Type', 'application/javascript;charset=utf-8');
        res.send(callback+'('+JSON.stringify(r)+')');
    } else {// json |?
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(r);
    }
}

module.exports = function(opts){
    opts || (opts = {});
    var defaultFormat = opts.defaultFormat || 'json';
    var callback = opts.callback || '_callback';
    var format = opts.format || '_format';
    return function(req, res, next){
        var cb = req.query[callback] || req.headers[format];
        var format   = req.query[format] || req.headers[format] || defaultFormat;
        res.ajaxSuccess = function(data, msg){
            return ajaxSend(res, 0, data, msg, format, cb);
        };
        res.ajaxError = function(msg, error){
            return ajaxSend(res, error || 1, null, msg, format, cb);
        };
        res.ajaxSend = function(error, data, msg){
            return ajaxSend(res, error, data, msg, format, cb);
        };
        next();
    }
}

