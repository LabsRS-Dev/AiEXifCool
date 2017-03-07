
/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var YAML = require('yamljs');

module.exports = function(codecs){
    codecs['yml'] = {
        defaults: {
            enc:{
                indent: 4,
                inline: 8,
            }
        },
        encoder:function(data, options, done){
            try{
                var r = YAML.stringify(data, options.inline, options.indent);
            } catch (err) {
                return done(err);
            }
            done(null, r);
        },
        decoder:function(data, options, done){
            try{
                var r = YAML.parse(data.toString());
            } catch (err) {
                return done(err);
            }
            done(null, r);
        },
    };
};
