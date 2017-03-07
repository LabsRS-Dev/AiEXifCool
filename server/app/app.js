/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var utilRef = require('./rty-util');
var _gH = utilRef.debugHandler;

module.exports = function(app){
    var Convert = require('./convert');
    app.post('/convert', function(req, res){
        console.log(_gH.sysUtil.inspect(req.body, { showHidden: true, depth: null }));

        Convert(req.body, function(err, output){
            if (err) {
                console.log(err);
                var errMsg;
                if (err instanceof Convert.Error) {
                    errMsg = res.tr('app', err.message);
                } else {
                    errMsg = res.tr('app.error');
                }
                return res.ajaxError(errMsg);
            }
            return res.ajaxSuccess(output);
        });
    });
};
