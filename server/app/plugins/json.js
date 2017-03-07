/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var utilRef = require('../rty-util');
var _gH = utilRef.debugHandler;

module.exports = function(codecs){
    codecs['json'] = {
        defaults: {
            enc:{
                indent: 4
            }
        },
        encoder:function(data, options, done){
            console.log("----------------- cal json encoder");
            try{
                var r = JSON.stringify(data, null, options.indent);
            } catch (err) {
                console.trace(err);
                return done(err);
            }
            done(null, r);
        },
        decoder:function(data, options, done){
            console.log("----------------- cal json decoder");
            try{
                var r = JSON.parse(data);
            } catch (err) {
                console.trace(err);
                return done(err);
            }
            done(null, r);
        },
    };
};
