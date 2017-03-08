// #!/usr/bin/env node


// 引入需要的模块：http和socket.io
const http = require('http')
const io = require('socket.io')

const RTYCommon = require('./tools/RTYCommon')

const _gH = RTYCommon.debugHandler //

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startServer (options) {
  // 创建server
  const server = http.createServer((req, res) => {
    // Send HTML headers and message
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    res.end('<h1>Hello Romanysoft LAB!</h1>')
  })

  // 端口8000
  const port = options.port || 8888
  server.listen(port)
  console.log('start server ' + port)

  // 创建socket
  const socket = io.listen(server)
  // 添加连接监听
  socket.on('connection', client => {
    console.log('socket connected')

    // / 根据ID，发送信息
    function send_updateWithId (userId, event, message) {
      console.log('call send_updateWithId')
      client.send(event, message)
    }

    // 连接成功则执行下面的监听
    client.on('message', (event, dictInfo) => {
      console.log('================================================')
      console.log('\n\nReceived message from client!' + _gH.sysUtil.inspect(dictInfo, {
        showHidden: true,
        depth: null
      }), event)

      if (event === 'sendMsgEvent') {
        if (!_gH.sysUtil.isObject(dictInfo)) {
          return
        }

        // 信息处理{服务器使用s_作为前缀，客户端使用c_作为前缀}
        const msg_type = dictInfo.msg_type
        const user_id = dictInfo.user_id

        if (msg_type === 'c_notice_id_Info') {

        } else if (msg_type === 'c_normal_msg') {

        } else if (msg_type === 'c_task_exec') {
          const taskInfo = dictInfo.taskInfo
          RTYCommon.callCommonCLI(taskInfo, user_id, send_updateWithId, event)
        }
      }
    })

    // 断开连接callback
    client.on('disconnect', () => {
      console.log('Server has disconnected')
    })
  })

  return server
}

module.exports = startServer
