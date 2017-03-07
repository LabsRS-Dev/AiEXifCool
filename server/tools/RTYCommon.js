/**
 * 参照Python模块的实现
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


// 服务器传回到客户端的消息类型
var ServerTaskMsgTypes = {
    'Running': 's_task_exec_running',
    'RealTimeFeedback': 's_task_exec_feedback',
    'Err': 's_err_progress',
    'Complete': 's_task_exec_result'
};


function obj2str(obj){
	if(sysUtil.isObject(obj) || sysUtil.isArray(obj)){
		return sysUtil.inspect(obj, {showHidden: true, depth: null});
	}
	
	return obj;
};



var singleton = function singleton() {
    var t$ = this;
	
	// 服务器传回到客户端的消息类型	
	t$.ServerTaskMsgTypes = ServerTaskMsgTypes;
	
	t$.obj2str = obj2str;

    // 方便调式的处理方式
    t$.debugHandler = {};
    /**
     * app 在ready状态下，必须更新
     * @returns {{}|*}
     */
    t$.updateDebugHandler = function () {
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

            //
            $END: {}
        };

        return t$.debugHandler;
    };

    // 对象Clone
    t$.clone = function (obj) {
        var t$ = this;
        //
        // We only need to clone reference types (Object)
        //
        var copy = {};

        if (obj instanceof Error) {
            // With potential custom Error objects, this might not be exactly correct,
            // but probably close-enough for purposes of this lib.
            copy = new Error(obj.message);
            Object.getOwnPropertyNames(obj).forEach(function (key) {
                copy[key] = obj[key];
            });

            return copy;
        }
        else if (!(obj instanceof Object)) {
            return obj;
        }
        else if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        for (var i in obj) {
            if (Array.isArray(obj[i])) {
                copy[i] = obj[i].slice(0);
            }
            else if (obj[i] instanceof Buffer) {
                copy[i] = obj[i].slice(0);
            }
            else if (typeof obj[i] != 'function') {
                copy[i] = obj[i] instanceof Object ? exports.clone(obj[i]) : obj[i];
            }
            else if (typeof obj[i] === 'function') {
                copy[i] = obj[i];
            }
        }

        return copy;
    };

    //////////////////////////////////////////////////////////////
    // 已经加载Module字典
    t$.gg_RTY_LoadedModulesDic = {};

    // 查找已经加载的Module是否存在
    t$.findLoadedModuleByPath = function (module_path) {
        var t$ = this;
		//console.log("gg_RTY_LoadedModulesDic = %s", t$.obj2str(t$.gg_RTY_LoadedModulesDic));
		return t$.gg_RTY_LoadedModulesDic.hasOwnProperty(module_path);
    }

    // 添加新的Module到字典中
    t$.registerLoadedModule = function (module_path, moduleObj) {
        var t$ = this;
		t$.gg_RTY_LoadedModulesDic[module_path] = moduleObj;
		console.log("register new module, ", module_path);
    }

    // 获取指定的Module
    t$.getLoadedModule = function (module_path, reload) {
        var t$ = this;
        if (t$.findLoadedModuleByPath(module_path)) {
			if(reload == true){
				// 删除缓存，然后重新加载
				var cache_modulePath =  require.resolve(module_path);
				console.log("cache_modulePath = %s", cache_modulePath);
				console.log("require.cache = %s", require.cache);
				
				try{
					delete require.cache[cache_modulePath];
					delete t$.gg_RTY_LoadedModulesDic[module_path];					
				}catch(e){
					console.trace(e);
				}

			}else{
				return t$.gg_RTY_LoadedModulesDic[module_path];
			} 
        }

        return null;
    }

    // 获取JSON字符串
    t$.get_json_message = function (info) {
        try {
            return JSON.stringify(info);
        } catch (e) {
            console.error(e);
            console.trace(e);
        }

        return "";
    }


    // 获取Func
    t$.getFunc = function (moduleName, funcName, reload) {
        var t$ = this;

        var funcObj = null;

        // Check Path is Exist?
        var module_path = './' + moduleName;

        var specModule = t$.getLoadedModule(module_path, reload);
        if (!specModule) {
            try {
                specModule = require(module_path);
                if (specModule) {
                    t$.registerLoadedModule(module_path, specModule);
                }
            } catch (e) {
                console.error(e);
                console.trace(e);
            }
        }

        if (specModule) {
            if (specModule.hasOwnProperty(funcName)) {
                var _func = specModule[funcName];
                if (sysUtil.isFunction(_func)) {
                    funcObj = _func;
                }
            }
        }

        if (!funcObj) {
            console.log('the Module:', moduleName, ' call ' + funcName + ' function faild....');
        }


        return funcObj;
    }


    /**
     * CLI调用Agent
     */
    var CLICallAgent = (function () {
        function CLICallAgent(taskInfo, user_id, cb, service) {
            this.taskInfo = taskInfo;
            this.user_id = user_id;
            this.cb = cb;
            this.service = service;
            this.baseInfo = {'task_id': taskInfo['task_id'], 'task_cli': taskInfo['cli'], 'cb': taskInfo['callback']};
            this.result = null;
        }

        CLICallAgent.prototype.start = function () {
            var self = this;
            self.run();
        };

        CLICallAgent.prototype.run = function () {
            var self = this;

            ///////////////////////////////////////////////
            var fn_sendMessageToClient = self.cb;
            var data = null, cli = null, command = null, reload = false;

            try {
				console.log("taskInfo = %s",  obj2str(self.taskInfo));
				
                if (self.taskInfo.hasOwnProperty("cli")) {
                    cli = self.taskInfo["cli"];
                }
				
				if (self.taskInfo.hasOwnProperty("reload")) {
                    reload = self.taskInfo["reload"];
                }

                if (self.taskInfo.hasOwnProperty("command")) {
                    command = self.taskInfo["command"];
                }
				
				

                console.log("CLICallAgent cli=%s, command=%s, reload=%d", obj2str(cli), obj2str(command), reload);

                /// 开始运行部分
                var info = self.service.clone(self.baseInfo);
                info['msg_type'] = ServerTaskMsgTypes['Running'];

                /// 配置基础信息
                var jsonStr = self.service.get_json_message(info);

                /// 返回调用的信息
                fn_sendMessageToClient(self.user_id, jsonStr);

                /// 定义反馈函数
                function sendFeedback(user_id, baseInfo, content) {
                    var info = self.service.clone(baseInfo);
                    info['msg_type'] = ServerTaskMsgTypes['RealTimeFeedback'];
                    info['content'] = content;
                    var jsonStr = self.service.get_json_message(info);
                    fn_sendMessageToClient(self.user_id, jsonStr);  //返回调用的信息
                }

                function fnc_sendFeedbackMessage(content) {
                    sendFeedback(self.user_id, self.baseInfo, content);
                }

                /**
                 # CLI 执行
                 # 默认修改或者建立模块的化使用MainRTYCLI函数
                 # 1.监测是否存在
                 # 2.MainRTYCLI,加入参数：fnc_sendFeedbackMessage 反馈信息到客户端的函数句柄
                 #
                 **/

                console.log("To find %s.MainRTYCLI", cli);

                var cli_func = self.service.getFunc(cli, "MainRTYCLI", reload);
                if (cli_func) {
                    data = cli_func(fnc_sendFeedbackMessage, command);
                }
                else {
                    console.log("no found cli_func.......");
                }


                if (data) {
                    var info = self.baseInfo;
                    info['msg_type'] = ServerTaskMsgTypes['Complete'];
                    info['result'] = data;

                    var jsonStr = self.service.get_json_message(info);
                    fn_sendMessageToClient(self.user_id, jsonStr);
                }

            } catch (e) {
                console.error("Exception = %s", e);
                console.trace(e);

                var info = self.service.clone(self.baseInfo);
                info['msg_type'] = ServerTaskMsgTypes['Err'];
                info['content'] = e.message || "";
                info['traceback'] = e.stack || "";
                info['tracebackMsg'] = e.stack || "";


                var jsonStr = self.service.get_json_message(info);
                fn_sendMessageToClient(self.user_id, jsonStr);
            }
        };

        return CLICallAgent;
    }());


    //////////////// 通用Call方式
    /**
     * 通过分发方式，调用其他的模块的python，并且可以将信息返回到调用者
     * @param taskInfo 对象，｛task_id, cli, callback｝. 传进来的任务对象
     * @param user_id 标识与谁的连接
     * @param cb  调用方传过来的回调函数
     */
    t$.call_common_cli = function (taskInfo, user_id, cb) {
        var t$ = this;

        console.log("call_common_cli: %s", obj2str(taskInfo));
        var agent = new CLICallAgent(taskInfo, user_id, cb, t$);
        agent.start();
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
        t$.instance.updateDebugHandler();
		console.log("### <singleton.getInstance>");
    }
    return this.instance;
};

exports = module.exports = singleton.getInstance();


