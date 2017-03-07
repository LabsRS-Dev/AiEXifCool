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
	
const xml = require('./tsxml/dist/index');	

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};

(() => __awaiter(this, void 0, void 0, function* () {
    const parsedXml = yield xml.Parser.parseStringToAst(`
<!DOCTYPE html>
<html>
	<head>
		<title>Sample HTML</title>
	</head>
	<body>
		<h1>Sample Heading</h1>
	</body>
</html>`);
    const htmlNode = parsedXml.getChildAtIndex(1), bodyNode = htmlNode.getChildAtIndex(1);
    bodyNode.setAttribute('style', 'background: #aaa;');
    const ownTextNode = new xml.ast.TextNode();
    bodyNode.appendChild(ownTextNode);
    ownTextNode.content = `Some sample text.`;
    console.log(htmlNode.toFormattedString());
}))();

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


