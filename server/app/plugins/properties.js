
/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var utilRef = require('../rty-util');
var _gH = utilRef.debugHandler;

var convertTool = require('properties');

module.exports = function(codecs){
    codecs['properties'] = {
        defaults: {
            enc:{
                comment : "#",
                separator : "="
            },
            dec:{
                sections: true,
                namespaces : true,
                variables: true,
                vars: true,
                include: true,

                comments: [";", "@"], //Some INI files also consider # as a comment, if so, add it, comments: [";", "#"]
                separators: ["-", ">"]
            }
        },
        encoder:function(data, options, done){
            try{
                console.log("----------------- cal properties encoder");
                options['path'] = options.distFile;
                convertTool.stringify(data, options, function(err, data){
                    console.log("----------------- cal properties encoder end");
                    done && done(err, true);
                });

            }catch(e){
                console.trace(e);
                done && done(e);
            }

        },
        decoder:function(data, options, done){
            console.log("----------------- cal properties decoder");

            convertTool.parse(data, options, function(err, r){
                console.log("----------------- cal properties decoder end");
                done && done(err, r);
            });
        },
    };
};
