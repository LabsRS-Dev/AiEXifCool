/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var convertTool = require('./csv-json-ex/fnc_json2csv');

var utilRef = require('../rty-util');
var _gH = utilRef.debugHandler;



module.exports = function(codecs){
    codecs['csv'] = {
        defaults: {
            enc:{
                header: true
            },
            dec:{
                columns: true
            }
        },
        encoder:function(data, options, done){
            try{
                console.log("----------------- cal csv encoder");
                convertTool.toCSV(data, options, function(err){
                    done && done(err, true);
                });
            }catch(e){
                console.trace(e);
                done && done(e);
            }

        },
        decoder:function(data, options, done){
            console.log("----------------- cal csv decoder");
            convertTool.parseCSV(data, options, function(err, r){
                done && done(err, r);
            });
        },
    };
};
