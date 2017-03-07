
/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var utilRef = require('../rty-util');
var _gH = utilRef.debugHandler;

var convertTool = require('ini');

module.exports = function(codecs){
    codecs['ini'] = {
        defaults: {
            enc:{

            },
            dec:{

            }
        },
        encoder:function(data, options, done){
            var r = null;
            try{
                console.log("----------------- cal ini encoder");
                r = convertTool.stringify(data, options);
                console.log("----------------- cal ini encoder end");
                done && done(null, r);
            }catch(err){
                console.trace(err);
                done && done(err);
            }

        },
        decoder:function(data, options, done){
            console.log("----------------- cal ini decoder");
            var r = null;
            try{
                r = convertTool.parse(data);
                console.log("----------------- cal ini decoder end");
                done && done(null, r);
            }catch(err){
                console.trace(err);
                done && done(err);
            }
        },
    };
};
