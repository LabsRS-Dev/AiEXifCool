/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var utilRef = require('./rty-util');
var _gH = utilRef.debugHandler;


var _ = require('../lib/utils');
var ConvertError = require('../lib/exception').Factory('ConvertError', function(msg){
    this.message = msg;
});


var Convert = function(options, done){
    console.log('call Convert function');

    var decoderCodec, encoderCodec, target={}, configInfostr={};

    try{
        _.queue()
            // check codec
            .next(function(next){// check parameters
                try{
                    if (options && (options.decoder && options.encoder)){
                        if (!((decoderCodec = codecs[options.decoder]) && (decoderCodec.decoder))) {
                            return next(new ConvertError('unknown_input_format'));
                        }
                        if (!((encoderCodec = codecs[options.encoder]) && (encoderCodec.encoder))) {
                            return next(new ConvertError('unknown_output_format'));
                        }

                        configInfostr = options.config;
                        return next();
                    }
                    return next(new ConvertError('invalid_parameters'));
                }catch(e){
                    console.trace(e);
                }
            })
            // check src
            .next(function(next){
                try{
                    _gH.sysFS.stat(options.srcFile, function(err, stat){
                        if (!err) {
                            target.srcSize = stat.size;
                            if (!(target.srcSize || stat.isFile())){
                                err = true;
                            }
                        }
                        next(err && new ConvertError('invalid_input_file'));
                    });
                }catch(e){
                    console.trace(e);
                }
            })
            // check distDir
            .next(function(next){
                try{
                    var dir = options.distDir;
                    if (!dir) {
                        dir = _gH.sysPath.dirname(options.srcFile);
                    }
                    target.distDir = _gH.sysPath.resolve(dir);
                    options.srcFile = _gH.sysPath.resolve(options.srcFile);
                    _gH.sysFS.stat(target.distDir, function(err, stat){
                        if (!err) {
                            if (!stat.isDirectory()){
                                err = true;
                            }
                        }
                        next(err && new ConvertError('invalid_output_dir'));
                    });
                }catch(e){
                    console.trace(e);
                }

            })
            // check distFile
            .next(function(next){
                try {
                    var distExt = options.distExt || encoderCodec.defaults.extension || options.encoder;
                    distExt = distExt ? '.'+ distExt : '';
                    var suffix = distExt;
                    var filename = _gH.sysPath.basename(options.srcFile);
                        filename = filename.substr(0, filename.length - _gH.sysPath.extname(filename).length);
                    if (!_.boolval(options.override)) { // auto name
                        getFileNameRe(target.distDir, filename, suffix, 0, function(newFile, newName){
                            target.distFile = newFile;
                            target.distName = newName;
                            next();
                        });
                    } else {
                        target.distName = filename + suffix;
                        target.distFile =  target.distDir + '/' + target.distName;
                        next();
                    }
                } catch (e) {
                    console.trace(e);
                }

            })

            // read
            .next(function(next){
                _gH.sysFS.readFile(options.srcFile, function(err, data){
                    next(err && new ConvertError('read_input_file_fail') , data);
                });
            })
            // decode
            .next(function(next, data){
                decoderCodec.decoder(data,
                    _.extend(true, {}, decoderCodec.defaults.dec, options.decoderOptions),
                    function(err, recv){
                        next(err && new ConvertError('decode_fail') , recv);
                    });
            })
            // encode
            .next(function(next, data){
                encoderCodec.encoder(data,
                    _.extend(true, {
                        srcFile:options.srcFile,
                        distFile:target.distFile,
                        config:configInfostr
                    }, encoderCodec.defaults.enc, options.encoderOptions),
                    function(err, recv){
                        next((err || !recv) && new ConvertError(err) , recv);
                    });
            })
            // write
            .next(function(next, data){
                if(!_gH.sysUtil.isBoolean(data)){ // 兼容文件通过流直接输出的方式
                    _gH.sysFS.writeFile(target.distFile, data, function(err, data){
                        next(err && new ConvertError('write_output_file_fail') , data);
                    });
                }else{
                    next(false, data);
                }
            })
            // done
            .done(function(err){
                done(err, target);
            });
    }catch(e){
        console.trace(e);
    }
};

function getFileNameRe(dir, filename, suffix, n, cb){
    var name = filename + (n ? '_' + n : '') + suffix;
    var file = dir + '/' + name;
    _gH.sysFS.exists(file, function(exists){
        if (exists) {
            getFileNameRe(dir, filename, suffix, n+1, cb);
        } else {
            cb(file, name);
        }
    });
}

Convert.register = function(callback){
    callback(codecs, Convert);
};

Convert.Error = ConvertError;

var codecs = {};

[
    'json',
    'xml',
    'csv',
    'yml',
    'plist',
    'properties',
    'ini'
].forEach(function(it){
    Convert.register(require('./plugins/'+it));
});

module.exports = Convert;
