import { BS, Observable, Util, _ } from 'dovemaxsdk'

// -----------------------------------------------------------------
// 交互处理
const AgentClient = BS.b$.AgentClient
const AgentServer = BS.b$.AgentServer

const __$p$ = {
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
    const wsSocketIO = new agent.Chancel()
    wsSocketIO.build({
      type: agent.ChancelType.websocketForNode,
      ip: 'localhost',
      port: '8888',
      protocol: 'http://',
      reqUrl: '',
      clientIOType: 'Socket.io.client'
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
              { action: 'startFix', data: options.data }
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
            { action: 'stopFix', data: options.data }
          ]
        }

        const info = {
          taskInfo: taskInfo,
          msg_type: 'c_task_exec'
        }

        __$p$.send(info) // 不需要监视结果
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

