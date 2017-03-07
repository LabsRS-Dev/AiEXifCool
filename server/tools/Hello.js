/**
 * Hello
 * Created by Ian on 2016/12/25.
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


function _toStr(obj){
	if(sysUtil.isObject(obj) || sysUtil.isArray(obj)){
		return sysUtil.inspect(obj, {showHidden: true, depth: null});
	}
	
	return obj;
};


var singleton = function singleton() {
    var t$ = this;

	t$.MainRTYCLI = function(fnc_cb, command){
		console.log("Hi I'm here!");
		console.log("Hi I'm here!.....");
		console.log("command: %s", _toStr(command));
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


