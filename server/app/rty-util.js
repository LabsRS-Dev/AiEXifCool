/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

/// 来源于NodejS系统内置的
var sysUtil = require('util'),
    sysURL = require('url'),
    sysFS = require('fs'),
    sysOS = require('os'),
    sysCluster = require('cluster'),
    sysChildProcess = require('child_process'),
    sysNet = require('net'),
    sysHTTP = require('http'),
    sysHTTPS = require('https'),
    sysEvents = require('events'),
    sysDNS = require('dns'),
    sysPunyCode = require('punycode'),
    sysReadline = require('readline'),
    sysStream = require('stream'),
    sysStringDecoder = require('string_decoder'),
    sysTLS = require('tls'),
    sysDatagram = require('dgram'),
    sysVM = require('vm'),
    sysZlib = require('zlib'),

    sysBuffer = require('buffer'),
    sysCrypto = require('crypto'),
    sysPath = require('path');

var nm_fse = require('fs-extra'); //参见https://github.com/jprichardson/node-fs-extra

var singleton = function singleton() {
    var t$ = this;
    t$.debugHandler = {
        sysOS: sysOS,
        sysPath: sysPath,
        sysFS: sysFS,
        sysBuffer: sysBuffer,
        sysUtil: sysUtil,
        sysCrypto: sysCrypto,
        sysCluster: sysCluster,
        sysChildProcess: sysChildProcess,
        sysNet: sysNet,
        sysHTTP: sysHTTP,
        sysHTTPS: sysHTTPS,
        sysEvents: sysEvents,
        sysDNS: sysDNS,
        sysPunyCode: sysPunyCode,
        sysReadline: sysReadline,
        sysStream: sysStream,
        sysStringDecoder: sysStringDecoder,
        sysTLS: sysTLS,
        sysDatagram: sysDatagram,
        sysVM: sysVM,
        sysZlib: sysZlib,

        nm_fse:nm_fse
    };

    t$.deleteFileOrDirWithPath = function(path, callback, sync){
        var t$ = this;
        var enableSync = sync || false;

        var cb = callback || function (err) {
                console.log(err);
        };
        if(!enableSync){
            nm_fse.remove(path, function (err) {
                cb && cb(err);
            });
        }else{
            var err = nm_fse.removeSync(path);
            cb && cb(err);
        }
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
