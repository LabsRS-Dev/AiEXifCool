/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var plist = require('plist');

module.exports = function(codecs){
    codecs['plist'] = {
        defaults: {
            enc:{
                indent: 4,
                inline: 8,
            }
        },
        encoder:function(data, options, done){
            try{
                var r = plist.parse(data);
            } catch (err) {
                return done(err);
            }
            done(null, r);
        },
        decoder:function(data, options, done){
            try{
                var r = plist.build(data).toString();
            } catch (err) {
                return done(err);
            }
            done(null, r);
        },
    };
};
