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

  t$.MainRTYCLI = function (fnc_cb, command) {
    console.log("Hi I'm here!")
    console.log("Hi I'm here!.....")
    console.log('command: %s', _toStr(command))

    command.forEach((oneCommand) => {
      const action = oneCommand.action
      const data = oneCommand.data

      if (action === 'startFix') {
        setInterval(function () {
          const list = []
          data.src.forEach((fileObj) => {
            const step = Math.random() * 100 + 1
            list.push({
              id: fileObj.id,
              progress: step
            })
          })

          fnc_cb(list)
          list.length = 0
        }, 3000)
      } else if (action === 'stopFix') {

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
