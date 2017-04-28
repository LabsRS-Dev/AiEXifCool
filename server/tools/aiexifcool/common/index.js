/**
 * Hello
 * Created by Ian on 2016/12/25.
 */
// / 来源于NodejS系统内置的
const sysUtil = require('util')
const sysPath = require('path')

// / 来源于安装的node_module
const Q = require('q')

const nmEditTool = require('./common_tool')


function _toStr (obj) {
  if (sysUtil.isObject(obj) || sysUtil.isArray(obj)) {
    return sysUtil.inspect(obj, {
      showHidden: true,
      depth: null
    })
  }

  return obj
};


function Singleton () {
  var t$ = this

  t$.feedbackCallback = null
  t$.feedbackIntervalHandler = null
  t$.feedbackIntervalSec = 2
  t$.taskMap = {
    '___eg.taskID': {}   // 任务对应数据
  }

  /**
   * 获取EXIF图像的缩略图
   */
  t$.getImageThumbAction = (taskID, data, options = {}) => {
    var deferred = Q.defer()
    var toolHelper = nmEditTool()
    // 获取数据包
    const sourceImageMap = data.src

    // 数据处理的结果的map
    var doing_resultDataMap = {} // 正在处理过程中的数据
    var done_resultDataMap = {}  // 最终处理完成的数据

    // 以下是模拟数据处理方式
    t$.feedbackIntervalHandler = setInterval(() => {
      const dataList = []
      Object.keys(doing_resultDataMap).forEach((imgId) => {
        var obj = doing_resultDataMap[imgId]
        if (obj) {
          dataList.push(obj)
          if (obj.__isProcessOver) {
            doing_resultDataMap[imgId] = undefined
          }
        }
      })

      console.log('processing image data count: ', dataList.length)
      if (dataList.length === 0) {
        clearInterval(t$.feedbackIntervalHandler)
        t$.feedbackIntervalHandler = null

        const done_dataList = []
        Object.keys(done_resultDataMap).forEach((imgId) => {
          var obj = done_resultDataMap[imgId]
          if (obj) {
            done_dataList.push(obj)
          }
        })

        deferred.resolve(done_dataList)
      } else {
        t$.feedbackCallback(dataList)
      }
    }, t$.feedbackIntervalSec * 1000)
    // -----

    // 启动异步工具调用工具开始处理
    Object.keys(sourceImageMap).forEach((imgId) => {
      var imgPath = sourceImageMap[imgId]

      /**
       * doing_resultDataMap[imgId] 对象的结构内容
       * id: 图片ID
       * progress: 处理进度
       * state: 是否修复成功。 0. 正在等待修复或者正在修复， 1， 修复成； -1 修复失败
       * __isProcessOver: 是否该任务处理完成
       * message: 修复出错的错误信息 或者 其他备注信息
       * outDir: 输出目录
       * distPath: 最后生成的修复的文件存放路径
       */
      var curProgress = 1
      doing_resultDataMap[imgId] = {
        id: imgId,
        progress: curProgress,
        state: 0,
        __isProcessOver: false
      }

      toolHelper.runGetImageThumb({
        inputPath: imgPath,
        lang: options.lang || 'en'
      }, (data) => {
        curProgress++
        doing_resultDataMap[imgId] = {
          id: imgId,
          progress: curProgress > 99 ? 99 : curProgress,
          state: 0
        }
      }, (info) => {
        const dataInfo = {
          id: imgId,
          progress: 100,
          state: info instanceof Error ? -1 : 1,
          message: info instanceof Error ? info.message : info,
          __isProcessOver: true
        }
        doing_resultDataMap[imgId] = dataInfo
        done_resultDataMap[imgId] = dataInfo
      })
    })

    return deferred
  }

  t$.MainRTYCLI = function (fnc_cb, command, baseInfo, ...args) {
    t$.feedbackCallback = fnc_cb
    console.log('command: %s', _toStr(command))

    var allQList = []
    command.forEach((oneCommand) => {
      const action = oneCommand.action
      const data = oneCommand.data
      const lang = oneCommand.lang

      // 以下可以派发到真正运行的处理程序中，进行轮询汇报
      const taskID = baseInfo.task_id
      t$.taskMap[taskID] = data
      allQList.push(t$[action](taskID, data, { lang: lang }))
    })

    // 使用promise处理返回全部处理完成的信号
    return Q.all(allQList)
  }
}


/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
Singleton.instance = null

/**
 * Singleton getInstance definition
 * @return Singleton class
 */
Singleton.getInstance = function () {
  var t$ = this
  if (t$.instance === null) {
    t$.instance = new Singleton()
  }
  return this.instance
}

exports = module.exports = Singleton.getInstance()
