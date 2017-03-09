/**
 * Hello
 * Created by Ian on 2016/12/25.
 */
// / 来源于NodejS系统内置的
const sysUtil = require('util')
const sysPath = require('path')


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
  t$.feedbackIntervalSec = 8
  t$.taskMap = {
    '___eg.taskID': {}   // 任务对应数据
  }


  t$.fix = (taskID) => {
    const data = t$.taskMap[taskID]
    const sourceImageMap = data.src
    const outputDir = data.outputDir

    // 以下是模拟数据处理方式
    t$.feedbackIntervalHandler = setInterval(() => {
      const dataList = []
      Object.keys(sourceImageMap).forEach((imgId) => {
        const step = parseInt(Math.random() * 200 + 1)
        const state = Math.random() * 1 > 0.5 ? 1 : -1

        dataList.push({
          id: imgId,
          progress: step,
          state: state
        })
      })

      console.log('processing image data count: ', dataList.length)
      if (dataList.length === 0) {
        clearInterval(t$.feedbackIntervalHandler)
        t$.feedbackIntervalHandler = null
      }
      t$.feedbackCallback(dataList)
    }, t$.feedbackIntervalSec * 1000)
    // -----
  }

  t$.stopFix = (taskID, removeData) => {
    const curData = t$.taskMap[taskID]
    const sourceImageMap = curData.src

    const removeImageMap = removeData.src
    Object.keys(removeImageMap).forEach((imgId) => {
      delete sourceImageMap[imgId]
    })
  }


  t$.MainRTYCLI = function (fnc_cb, command, baseInfo, ...args) {
    t$.feedbackCallback = fnc_cb
    console.log('command: %s', _toStr(command))

    command.forEach((oneCommand) => {
      const action = oneCommand.action
      const data = oneCommand.data

      if (action === 'startFix') {
        const taskID = baseInfo.task_id
        t$.taskMap[taskID] = data

        // 以下可以派发到真正运行的处理程序中，进行轮询汇报
        t$.fix(taskID)
      } else if (action === 'stopFix') {
        const taskID = baseInfo.task_id

        // 以下派发给自己，要清除这些运行的数据
        t$.stopFix(taskID, data)
      }
    })
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
