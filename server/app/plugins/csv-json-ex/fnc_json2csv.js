/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

require('epipebomb')();

var json2csv = require('./index');
var debug = require('debug')('json2csv');
var json = require('JSONStream');
var join = require('join-stream');


var csv = require('csv');
var fs = require('fs');
var os = require('os');


// 项目内部
var prj_keys = json2csv.fields;

var utilRef = require('../../rty-util');
var _gH = utilRef.debugHandler;

var singleton = function singleton() {
    var t$ = this;

    // 使用文件方式处理
    t$.tryJSON2CSV = function(in_srcFilePath, in_destFilePath, in_options, callback){
        var lenses = {};
        var first = true;
        var firstObj = true;
        var argfields = in_options.f || in_options.fields;
        var fields = argfields;
        if (fields) fields = fields.split(',');
        var delim = in_options.d || in_options.delim || ",";

        var source = in_srcFilePath? fs.createReadStream(in_srcFilePath) : process.stdin;
        var dist = fs.createWriteStream(in_destFilePath);
        dist.on('error', function(err){
            callback && callback(err);
        });
        dist.on('finish', function(){
            callback && callback();
        });

        var s = source
        .pipe(json.parse())
        .pipe(json2csv(fields))
        .pipe(csv.stringify({ delimiter: delim }))
        .on('error', function(err){
            callback && callback(err);
        })
        .pipe(dist);
    };

    t$.tryJSON2CSVWithData = function(jsonData, destFile, options, callback){
        var t$ = this;
        try{
            var json_string = JSON.stringify(jsonData);
            var tmpJSONFile = os.tmpdir() + "/" + Date.now() + "_datastorm.json";
            fs.writeFile(tmpJSONFile, json_string, function(err){
                if(!err){
                    t$.tryJSON2CSV(tmpJSONFile, destFile, options, function(err){
                        callback && callback(err);
                        utilRef.deleteFileOrDirWithPath(tmpJSONFile, function(){});
                    });
                }else{
                    callback && callback(err);
                    utilRef.deleteFileOrDirWithPath(tmpJSONFile, function(){});
                }

            });
        }catch(err){
            callback && callback(err);
        }
    };

    t$.tryComplexJSON2CSVWithData = function(jsonData, distFile, options, callback){
        var t$ = this;

        // 参见：https://www.npmjs.com/package/tabular-json. 内部已经实现变种
        //var tabular = require('tabular-json');
        var tabular = require('../tabular-json-ex/tabular.js');


        var configOpt = t$.getConvertOptConfig(options);
        var sortField = typeof configOpt.it2csv_sortFields !== 'undefined' ? configOpt.it2csv_sortFields : "";

        try{
            var formatSortFieldList = JSON.parse(sortField);
            sortField = formatSortFieldList;
        }catch(e){
            sortField = sortField;
        }

        var separator = typeof configOpt.it2csv_separator !== 'undefined' ? configOpt.it2csv_separator : ",";
        separator = separator === "" ? "," : separator;

        console.log(_gH.sysUtil.inspect(configOpt, { showHidden: true, depth: null }));


        var opt = {
            //header: [],
            "dot": ".",        // The string that sub-objects in header strings. Defaults to '.'.
            "sort": sortField, // Prefix a string with minus '-' to sort in descending order.
            "separator": separator
        };

        console.log(_gH.sysUtil.inspect(opt, { showHidden: true, depth: null }));

        var csvData = tabular.delimit(jsonData, opt);

        fs.writeFile(distFile, csvData, function(err){
            callback && callback(err);
        });
    };

    t$.getConvertOptConfig = function(options){
        var options = typeof options !== 'undefined' ? options : {};
        var configOpt = typeof options.config !== 'undefined' ? JSON.parse(options.config) : {};
        return configOpt;
    };


    t$.toCSV = function(data, options, cb){
        var t$ = this;
        var srcFile = options.srcFile,
            distFile = options.distFile;

        var configOpt = t$.getConvertOptConfig(options);
        var useComplexJSONEngine = typeof configOpt.it2csv_useComplexJSONEngine !== 'undefined' ? configOpt.it2csv_useComplexJSONEngine : true;

        //检测是否为ComplexJSON
        ((false !== json2csv.isComplexJSONData(data)) || (false !== useComplexJSONEngine)) ?
        t$.tryComplexJSON2CSVWithData(data, distFile, options, function(err){
            cb && cb(err);
        })
        :
        t$.tryJSON2CSVWithData(data, distFile, options, function(err){
            cb && cb(err);
        });
    };

    t$.parseCSV = function(data, options, cb){
        csv.parse(data, options, function(err, r) {
            cb(err, r);
        });
    };

    //// {}
    if (singleton.caller !== singleton.getInstance) {
        throw new Error("This object cannot be instanciated");
    }
};

/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
singleton.instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
singleton.getInstance = function () {
    var t$ = this;
    if (t$.instance === null) {
        t$.instance = new singleton();
    }
    return this.instance;
};



exports = module.exports = singleton.getInstance();
