// #!/usr/bin/env node


// 引入需要的模块：http和socket.io
const http = require('http')
const io = require('socket.io')
const sysPath = require('path')

const RTYCommon = require('./tools/RTYCommon')

const _gH = RTYCommon.debugHandler //

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var userId2ClientList = {}
function __addToUserId2ClientList (userId, client) {
  var clientList = userId2ClientList[userId] || []
  if (clientList.indexOf(client) === -1) {
    clientList.push(client)
  }
}

function __removeFromUserId2ClientList (userId, client) {
  var clientList = userId2ClientList[userId] || []
  clientList.forEach(function (ele, index, list) {
    if (ele === client) {
      clientList.splice(index, 1)
    }
  })
}

function __updateEnvPATH () {
  const binDir = sysPath.join(__dirname, './bin')
  process.env.PATH = process.env.PATH + ';' + binDir
  console.log(binDir)
}

const userIdKey = '_ass_user_id'
const userClientKey = '_ass_client'

function startServer (options) {
  __updateEnvPATH()
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
          client[userIdKey] = user_id
          client[userClientKey] = client
          __addToUserId2ClientList(user_id, client)
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
      __removeFromUserId2ClientList(client[userIdKey], client)
    })
  })

  return server
}

module.exports = startServer
