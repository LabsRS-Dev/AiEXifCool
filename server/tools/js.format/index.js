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
	
const jsBeautifyTool = require('./js-beautify/index');	
const js_beautify = jsBeautifyTool.js_beautify;




function obj2str(obj){
	if(sysUtil.isObject(obj) || sysUtil.isArray(obj)){
		return sysUtil.inspect(obj, {showHidden: true, depth: null});
	}
	
	return obj;
};

		
var singleton = function singleton() {
    var t$ = this;

	t$.MainRTYCLI = function(fnc_cb, command){
		try{
			console.log("Hi I'm here!");
			console.log("Hi I'm here!.....");
			console.log("command: %s", obj2str(command));
			fnc_cb("Hi! I'm HelloMsg");
			fnc_cb({message: "Hi! I'm HelloMsg"});
			
			var formatResult = js_beautify(
			`
                    c$.nodeWS.on('event', function(data){
					if (typeof c$.nodeWS_cb === 'undefined') {
					alert(data);
					}
					
					if(c$.Node.debugLog == true){console.log(JSON.stringify(data));}
					c$.nodeWS_cb && c$.nodeWS_cb(data);
                    });			
			`);
				
			console.log(formatResult);
			
		}catch(e){
			console.error("Exception = %s", e);
            console.trace(e);
			throw e;
		}

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


