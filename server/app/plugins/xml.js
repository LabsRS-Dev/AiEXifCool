var xml2js = require('xml2js');

module.exports = function(codecs){
    codecs['xml'] = {
        defaults: {
            enc:{
                renderOpts: {
                    pretty: true
                },
                xmldec: {
                    'version': '1.0',
                    'encoding': 'UTF-8',
                    'standalone': true
                }
            },
            dec:{

            }
        },
        encoder:function(data, options, done){
            var r = null;
            try{
                var builder = new xml2js.Builder(options);
                r = builder.buildObject(data);
            } catch (err) {
                return done(err);
            }
            done(null, r);
        },
        decoder:function(data, options, done){
            console.log(data);
            var parser = new xml2js.Parser(options);
            parser.parseString(data, done);
        },
    };
};
