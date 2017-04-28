import { BS, Observable, Util, _ } from 'dove.max.sdk'

// -----------------------------------------------------------------
// 交互处理
const AgentClient = BS.b$.AgentClient
const AgentServer = BS.b$.AgentServer

const __$p$ = {
  // 通用方式来配置单一的服务器模式, 你可以在后端服务覆盖已有的配置信息
  serverConfig: {
    ip: '127.0.0.1', // 127.0.0.1
    port: '8888',
    protocol: 'http://'
  },

  // 获取WWW指定的动态文件的方式
  getWWWAssetsUrlPrefix: function () {
    var that = this
    const sr = that.serverConfig
    // eg. http://127.0.0.1:8888/tmp_assets/f6c4a7ea-0d48-4cbb-9d45-9e452c9fb0cd.jpg
    return sr.protocol + sr.ip + ':' + sr.port + '/tmp_assets/'
  },

  // 针对前端使用者，我要启动后端服务 {启动后，所有数据信息都转向后端服务编码来处理}
  backAgent: new AgentServer(),
  startBackAgent: function () {
    const agent = this.backAgent
    agent.active({})
  },

  // 针对前端使用者，我要启动前端服务，{启动后，可以根据发送信息、接收信息方式与后端服务来交互}
  isRunning: false,
  frontAgent: new AgentClient(),
  startFrontAgent: function () {
    var that = this
    const agent = that.frontAgent
    agent.debug = false

    const wsSocketIO = new agent.Chancel()
    wsSocketIO.build({
      type: agent.ChancelType.websocketForNode,
      ip: that.serverConfig.ip,
      port: that.serverConfig.port,
      protocol: that.serverConfig.protocol,
      reqUrl: '',
      clientIOType: 'Socket.io.client',
      debug: false // 是否开启日志功能
    })
    agent.registerOnFinishBuildChannel(function () {
      console.log('frontAgent is finish build')
      that.isRunning = true
      console.log('__$p$.isRunning = ', that.isRunning)
    })
    agent.appendChancel(wsSocketIO)
  },
  run: function (startBackAgent = false) {
    console.log('start transfer.js ....')
    if (startBackAgent) {
      this.startBackAgent()
    }
    this.startFrontAgent()
    return this
  },

  send: function (message, handler, one = true) {
    handler && this.frontAgent.registerOnReceiveFromServer(handler, one)
    this.frontAgent.noticeToServer(message)
    return this
  }
}

//  绑定工具
__$p$.Tools = {
  Hello: function (handler, one = true) {
    __$p$.send({ data: 'Hello' }, function (data) {
      handler(data)
    }, one)
  },
  Common: {
    getImageThumb: (options = {}, handler, one = false) => {
      const debugMode = false
      if (debugMode === false) {
        const taskInfo = {
          task_id: options.taskID,                    // 任务ID
          cli: 'aiexifcool/common/index',             // 动态调用的模块
          reload: false,                              // 默认是false, 支持热部署, 是否重新加载动态模块
          command: [                                  // 命令
            { action: 'getImageThumbAction', data: options.data, lang: options.lang || 'en' }
          ]
        }

        const info = {
          taskInfo: taskInfo,
          msg_type: 'c_task_exec'
        }

        __$p$.send(info, data => {
          if (data.task_id === options.taskID) { // 只处理本任务的返回数据
            handler && handler(data)
          }
        }, one)
      } else {
        handler && handler()
      }
    }
  },
  Fix: {
    Image: {
      run: (options = {}, handler, one = false) => {
        const debugMode = false
        if (debugMode === false) {
          const taskInfo = {
            task_id: options.taskID,                    // 任务ID
            cli: 'aiexifcool/fix.image/index',          // 动态调用的模块
            reload: false,                              // 默认是false, 支持热部署, 是否重新加载动态模块
            command: [                                  // 命令
              { action: 'startFix', data: options.data, lang: options.lang || 'en' }
            ]
          }

          const info = {
            taskInfo: taskInfo,
            msg_type: 'c_task_exec'
          }

          __$p$.send(info, data => {
            if (data.task_id === options.taskID) { // 只处理本任务的返回数据
              handler && handler(data)
            }
          }, one)
        } else {
          handler && handler()
        }
      },
      chancel: (options = {}) => {
        const taskInfo = {
          task_id: options.taskID,                    // 任务ID
          cli: 'aiexifcool/fix.image/index',          // 动态调用的模块
          reload: false,                              // 默认是false, 支持热部署, 是否重新加载动态模块
          command: [                                  // 命令
            { action: 'stopFix', data: options.data, lang: options.lang || 'en' }
          ]
        }

        const info = {
          taskInfo: taskInfo,
          msg_type: 'c_task_exec'
        }

        __$p$.send(info) // 不需要监视结果
      }
    }
  },
  RemoveExifInfo: {
    run: (options = {}, handler, one = false) => {
      const debugMode = false
      if (debugMode === false) {
        const taskInfo = {
          task_id: options.taskID,                    // 任务ID
          cli: 'aiexifcool/remove.exif/index',         // 动态调用的模块
          reload: false,                              // 默认是false, 支持热部署, 是否重新加载动态模块
          command: [                                  // 命令
            { action: 'startRemoveExifInfoAction', data: options.data, lang: options.lang || 'en' }
          ]
        }

        const info = {
          taskInfo: taskInfo,
          msg_type: 'c_task_exec'
        }

        __$p$.send(info, data => {
          if (data.task_id === options.taskID) { // 只处理本任务的返回数据
            handler && handler(data)
          }
        }, one)
      } else {
        handler && handler()
      }
    },
    stop: (options = {}) => {
      const taskInfo = {
        task_id: options.taskID,                    // 任务ID
        cli: 'aiexifcool/remove.exif/index',         // 动态调用的模块
        reload: false,                              // 默认是false, 支持热部署, 是否重新加载动态模块
        command: [                                  // 命令
          { action: 'stopRemoveExifInfoAction', data: options.data, lang: options.lang || 'en' }
        ]
      }

      const info = {
        taskInfo: taskInfo,
        msg_type: 'c_task_exec'
      }

      __$p$.send(info) // 不需要监视结果
    }
  },
  ModifyExifInfo: {
    getExifInfo: (options = {}, handler, one = false) => {
      const debugMode = false
      if (debugMode === false) {
        const taskInfo = {
          task_id: options.taskID,                    // 任务ID
          cli: 'aiexifcool/edit.image/index',         // 动态调用的模块
          reload: false,                              // 默认是false, 支持热部署, 是否重新加载动态模块
          command: [                                  // 命令
            { action: 'getExifInfoAction', data: options.data, lang: options.lang || 'en' }
          ]
        }

        const info = {
          taskInfo: taskInfo,
          msg_type: 'c_task_exec'
        }

        __$p$.send(info, data => {
          if (data.task_id === options.taskID) { // 只处理本任务的返回数据
            handler && handler(data)
          }
        }, one)
      } else {
        handler && handler()
      }
    }
  }
}

var TransferClass = Observable.extend(__$p$)
var Transfer = new TransferClass()
Transfer.run()

export {
  Transfer
}

