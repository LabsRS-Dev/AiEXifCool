/**
 * 参照Python模块的实现
 * Created by Ian on 2016/12/25.
 */
// / 来源于NodejS系统内置的
const sysUtil = require('util')
const sysURL = require('url')
const sysFS = require('fs')
const sysOS = require('os')
const sysCluster = require('cluster')
const sysChildProcess = require('child_process')
const sysNet = require('net')
const sysHTTP = require('http')
const sysHTTPS = require('https')
const sysEvents = require('events')
const sysDNS = require('dns')
const sysPunyCode = require('punycode')
const sysReadline = require('readline')
const sysStream = require('stream')
const sysStringDecoder = require('string_decoder')
const sysTLS = require('tls')
const sysDatagram = require('dgram')
const sysVM = require('vm')
const sysZlib = require('zlib')

const sysBuffer = require('buffer')
const sysCrypto = require('crypto')
const sysPath = require('path')

// 服务器传回到客户端的消息类型
const ServerTaskMsgTypes = {
  Running: 's_task_exec_running',
  RealTimeFeedback: 's_task_exec_feedback',
  Err: 's_err_progress',
  Complete: 's_task_exec_result'
}

function obj2str (obj) {
  if (sysUtil.isObject(obj) || sysUtil.isArray(obj)) {
    return sysUtil.inspect(obj, {
      showHidden: true,
      depth: null
    })
  }

  return obj
}

function Singleton () {
  const that = this

  // 服务器传回到客户端的消息类型
  that.ServerTaskMsgTypes = ServerTaskMsgTypes

  that.obj2str = obj2str

  // 方便调式的处理方式
  that.debugHandler = {}
  /**
   * app 在ready状态下，必须更新
   * @returns {{}|*}
   */
  that.updateDebugHandler = function () {
    const that = this

    that.debugHandler = {
      sysOS,
      sysPath,
      sysFS,
      sysBuffer,
      sysUtil,
      sysCrypto,
      sysCluster,
      sysChildProcess,
      sysNet,
      sysHTTP,
      sysHTTPS,
      sysEvents,
      sysDNS,
      sysPunyCode,
      sysReadline,
      sysStream,
      sysStringDecoder,
      sysTLS,
      sysDatagram,
      sysVM,
      sysZlib,

      //
      $END: {}
    }

    return that.debugHandler
  }

  // 对象Clone
  that.clone = function (obj) {
    //
    // We only need to clone reference types (Object)
    //
    let copy = {}

    if (obj instanceof Error) {
      // With potential custom Error objects, this might not be exactly correct,
      // but probably close-enough for purposes of this lib.
      copy = new Error(obj.message)
      Object.getOwnPropertyNames(obj).forEach(key => {
        copy[key] = obj[key]
      })

      return copy
    } else if (!(obj instanceof Object)) {
      return obj
    } else if (obj instanceof Date) {
      return new Date(obj.getTime())
    }

    for (const i in obj) {
      if (Array.isArray(obj[i])) {
        copy[i] = obj[i].slice(0)
      } else if (obj[i] instanceof Buffer) {
        copy[i] = obj[i].slice(0)
      } else if (typeof obj[i] !== 'function') {
        copy[i] = obj[i] instanceof Object ? exports.clone(obj[i]) : obj[i]
      } else if (typeof obj[i] === 'function') {
        copy[i] = obj[i]
      }
    }

    return copy
  }

  // ////////////////////////////////////////////////////////////
  // 已经加载Module字典
  that.globalLoadedModulesMap = {}

  // 查找已经加载的Module是否存在
  that.findLoadedModuleByPath = function (modulePath) {
    const that = this
    // console.log("globalLoadedModulesMap = %s", that.obj2str(that.globalLoadedModulesMap));
    return that.globalLoadedModulesMap.hasOwnProperty(modulePath)
  }

  // 添加新的Module到字典中
  that.registerLoadedModule = function (modulePath, moduleObj) {
    const that = this
    that.globalLoadedModulesMap[modulePath] = moduleObj
    console.log('register new module, ', modulePath)
  }

  // 获取指定的Module
  that.getLoadedModule = function (modulePath, reload) {
    const that = this
    if (that.findLoadedModuleByPath(modulePath)) {
      if (reload === true) {
        // 删除缓存，然后重新加载
        const CachesForModulePath = require.resolve(modulePath)
        console.log('CachesForModulePath = %s', CachesForModulePath)
        console.log('require.cache = %s', require.cache)

        try {
          delete require.cache[CachesForModulePath]
          delete that.globalLoadedModulesMap[modulePath]
        } catch (err) {
          console.trace(err)
        }
      } else {
        return that.globalLoadedModulesMap[modulePath]
      }
    }

    return null
  }

  // 获取JSON字符串
  that.getJSONMessage = function (info) {
    try {
      return JSON.stringify(info)
    } catch (err) {
      console.error(err)
      console.trace(err)
    }

    return ''
  }

  // 获取Func
  that.getFunc = function (moduleName, funcName, reload) {
    const that = this

    let funcObj = null

    // Check Path is Exist?
    const modulePath = './' + moduleName

    let specModule = that.getLoadedModule(modulePath, reload)
    if (!specModule) {
      try {
        specModule = require(modulePath)
        if (specModule) {
          that.registerLoadedModule(modulePath, specModule)
        }
      } catch (err) {
        console.error(err)
        console.trace(err)
      }
    }

    if (specModule) {
      if (specModule.hasOwnProperty(funcName)) {
        const _func = specModule[funcName]
        if (sysUtil.isFunction(_func)) {
          funcObj = _func
        }
      }
    }

    if (!funcObj) {
      console.log('the Module:', moduleName, ' call ' + funcName + ' function faild....')
    }

    return funcObj
  }

  /**
   * CLI调用Agent
   */
  const CLICallAgent = (function () {
    function CLICallAgent (taskInfo, user_id, cb, service) {
      this.taskInfo = taskInfo
      this.user_id = user_id
      this.cb = cb
      this.service = service
      this.baseInfo = {
        task_id: taskInfo.task_id,
        task_cli: taskInfo.cli,
        cb: taskInfo.callback
      }
      this.result = null
    }

    CLICallAgent.prototype.start = function () {
      const self = this
      self.run()
    }

    CLICallAgent.prototype.run = function () {
      const self = this

      // /////////////////////////////////////////////
      const fnSendMessageToClient = self.cb
      let data = null,
        cli = null,
        command = null,
        reload = false

      try {
        console.log('taskInfo = %s', obj2str(self.taskInfo))
        cli = self.taskInfo.cli
        reload = self.taskInfo.reload
        command = self.taskInfo.command

        console.log('CLICallAgent cli=%s, command=%s, reload=%d', obj2str(cli), obj2str(command), reload)

        // / 开始运行部分
        var info = self.service.clone(self.baseInfo)
        info.msg_type = ServerTaskMsgTypes.Running

        // / 配置基础信息
        var jsonStr = self.service.getJSONMessage(info)

        // / 返回调用的信息
        fnSendMessageToClient(self.user_id, jsonStr)

        // / 定义反馈函数
        function sendFeedback (user_id, baseInfo, content) {
          const info = self.service.clone(baseInfo)
          info.msg_type = ServerTaskMsgTypes.RealTimeFeedback
          info.content = content
          const jsonStr = self.service.getJSONMessage(info)
          fnSendMessageToClient(self.user_id, jsonStr) // 返回调用的信息
        }

        function fncSendFeedbackMessage (content) {
          sendFeedback(self.user_id, self.baseInfo, content)
        }

        /**
         # CLI 执行
         # 默认修改或者建立模块的化使用MainRTYCLI函数
         # 1.监测是否存在
         # 2.MainRTYCLI,加入参数：fncSendFeedbackMessage 反馈信息到客户端的函数句柄
         #
         * */

        console.log('To find %s.MainRTYCLI', cli)

        const cliMain = self.service.getFunc(cli, 'MainRTYCLI', reload)
        if (cliMain) {
          data = cliMain(fncSendFeedbackMessage, command)
        } else {
          console.log('no found cliMain.......')
        }

        if (data) {
          const info = self.baseInfo
          info.msg_type = ServerTaskMsgTypes.Complete
          info.result = data

          const jsonStr = self.service.getJSONMessage(info)
          fnSendMessageToClient(self.user_id, jsonStr)
        }
      } catch (err) {
        console.error('Exception = %s', err)
        console.trace(err)

        const info = self.service.clone(self.baseInfo)
        info.msg_type = ServerTaskMsgTypes.Err
        info.content = err.message || ''
        info.traceback = err.stack || ''
        info.tracebackMsg = err.stack || ''

        const jsonStr = self.service.getJSONMessage(info)
        fnSendMessageToClient(self.user_id, jsonStr)
      }
    }

    return CLICallAgent
  })()

  // ////////////// 通用Call方式
  /**
   * 通过分发方式，调用其他的模块的python，并且可以将信息返回到调用者
   * @param taskInfo 对象，｛task_id, cli, callback｝. 传进来的任务对象
   * @param user_id 标识与谁的连接
   * @param cb  调用方传过来的回调函数
   */
  that.callCommonCLI = function (taskInfo, user_id, cb) {
    const that = this

    console.log('callCommonCLI: %s', obj2str(taskInfo))
    const agent = new CLICallAgent(taskInfo, user_id, cb, that)
    agent.start()
  }
}

/* ************************************************************************
 Singleton CLASS DEFINITION
 ************************************************************************ */
Singleton.instance = null

/**
 * Singleton getInstance definition
 * @return Singleton class
 */
Singleton.getInstance = function () {
  const that = this
  if (that.instance === null) {
    that.instance = new Singleton()
    that.instance.updateDebugHandler()
    console.log('### <Singleton.getInstance>')
  }
  return this.instance
}

exports = module.exports = Singleton.getInstance()
