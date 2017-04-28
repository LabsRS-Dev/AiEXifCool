// #!/usr/bin/env node


// 引入需要的模块：http和socket.io
const sysHttp = require('http')
const sysPath = require('path')
const sysUrl = require('url')
const sysFS = require('fs')

// node_module
const nm_io = require('socket.io')
const nm_union = require('union')
const nm_ecstatic = require('ecstatic')
const nm_httpProxy = require('http-proxy')
const nm_corser = require('corser')
const nm_os_tmpDir = require('os-tmpdir')
const nm_mime = require('mime-types')

// local module
const RTYCommon = require('./tools/RTYCommon')

// //////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Constructor function for the HttpServer object
 * which is responsible for serving static files along
 * with other HTTP-related features.
 */
function HttpServer (options) {
  options = options || {}

  if (options.root) {
    this.root = options.root
  } else {
    try {
      sysFS.lstatSync('./public')
      this.root = './public'
    } catch (err) {
      this.root = './'
    }
  }

  this.headers = options.headers || {}

  this.cache = options.cache === undefined ? 3600 : options.cache // in seconds.
  this.showDir = options.showDir !== 'false'
  this.autoIndex = options.autoIndex !== 'false'
  this.gzip = options.gzip === true
  this.contentType = options.contentType || 'application/octet-stream'

  if (options.ext) {
    this.ext = options.ext === true
      ? 'html'
      : options.ext
  }

  var before = options.before ? options.before.slice() : []

  before.push(function (req, res) {
    console.log(req.url)
    if (options.logFn) {
      options.logFn(req, res)
    }

    if (options.getTmpAssetsFilesFn) {
      return options.getTmpAssetsFilesFn(req, res)
    }

    res.emit('next')
  })

  if (options.cors) {
    this.headers['Access-Control-Allow-Origin'] = '*'
    this.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Range'
    if (options.corsHeaders) {
      options.corsHeaders.split(/\s*,\s*/)
          .forEach(function (h) { this.headers['Access-Control-Allow-Headers'] += ', ' + h }, this)
    }
    before.push(nm_corser.create(options.corsHeaders ? {
      requestHeaders: this.headers['Access-Control-Allow-Headers'].split(/\s*,\s*/)
    } : null))
  }

  if (options.robots) {
    before.push(function (req, res) {
      if (req.url === '/robots.txt') {
        res.setHeader('Content-Type', 'text/plain')
        var robots = options.robots === true
          ? 'User-agent: *\nDisallow: /'
          : options.robots.replace(/\\n/, '\n')

        return res.end(robots)
      }

      res.emit('next')
    })
  }

  before.push(nm_ecstatic({
    root: this.root,
    cache: this.cache,
    showDir: this.showDir,
    autoIndex: this.autoIndex,
    defaultExt: this.ext,
    gzip: this.gzip,
    contentType: this.contentType,
    handleError: typeof options.proxy !== 'string'
  }))

  if (typeof options.proxy === 'string') {
    var proxy = nm_httpProxy.createProxyServer({})
    before.push(function (req, res) {
      proxy.web(req, res, {
        target: options.proxy,
        changeOrigin: true
      })
    })
  }

  var serverOptions = {
    before: before,
    headers: this.headers,
    onError: function (err, req, res) {
      if (options.logFn) {
        options.logFn(req, res, err)
      }

      res.end()
    }
  }

  if (options.https) {
    serverOptions.https = options.https
  }

  this.server = nm_union.createServer(serverOptions)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////

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

// -----------------------------------------------------------------------------------------------------------
/**
 * 启动HTTP服务器
 * @param {Object} options 配置选项
 * @returns 返回server实例
 */
function startServer (options) {
  __updateEnvPATH()

  // 创建server
  const httpServerInstance = new HttpServer({
    // root: sysPath.join(__dirname, 'fixtures', 'root')
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    },
    getTmpAssetsFilesFn: function (req, res) {
      var pathname = sysUrl.parse(req.url).pathname
      const specPath = '/tmp_assets/'

      if (pathname.startsWith(specPath)) {
        var partFilePath = pathname.substr(specPath.length)
        console.log(partFilePath)
        const realFilePath = sysPath.join(nm_os_tmpDir(), '/', partFilePath)
        console.log(realFilePath)

        if (!sysFS.existsSync(realFilePath)) {
          res.end()
        }

        const mimeType = nm_mime.lookup(sysPath.extname(realFilePath))
        console.log('mimeType = ', mimeType)

        const useSync = false
        if (useSync) {
          const buffer = sysFS.readFileSync(realFilePath)
          console.log('buffer.length = ', buffer.length)
          res.writeHead(200, {
            'Content-Type': mimeType || 'text/plain'
          })
          res.write(buffer, 'binary')
          res.end()
        } else {
          sysFS.readFile(realFilePath, (err, buffer) => {
            if (err) {
              res.writeHead(500, {
                'content-type': 'text/plain'
              })
              res.write(err)
              res.end()
            } else {
              console.log('buffer.length = ', buffer.length)
              res.writeHead(200, {
                'content-type': mimeType || 'text/plain'
              })
              res.write(buffer, 'binary')
              res.end()
            }
          })
        }
      }
    }
  })
  const server = httpServerInstance.server

  // 端口8000
  const port = options.port || 8888
  server.listen(port)
  console.log('start server ' + port)

  // 创建socket
  const socket = nm_io.listen(server)
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


// //////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = startServer
