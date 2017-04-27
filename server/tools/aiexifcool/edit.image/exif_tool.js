// const helperNefFix = require('./helper_nef_fix')
const sysFS = require('fs')
const sysPath = require('path')
const spawn = require('child_process').spawn
const nm_fse = require('fs-extra')
const nm_temp = require('tmp')
const nm_os_tmpDir = require('os-tmpdir')

/**
 * 配置国际化
 */
const locals = {
  'en': {
    fileNoExist: 'file not exist',
    cannotCreateOutDir: 'can not create output directory',
    cannotCopySource: 'can not copy source file or directory',
    cannotCreateTempDir: 'can not create a temporary output directory'
  },
  'zh-CN': {
    fileNoExist: '文件不存在',
    cannotCreateOutDir: '不能创建输出目录',
    cannotCopySource: '不能正常拷贝源文件到临时目录进行处理',
    cannotCreateTempDir: '不能正常创建临时输出目录'
  }
}
const defaultLanguage = 'en'

/**
 * 模块部分
 */
module.exports = function () {
  return {
    log: (...args) => {
      console.log(args)
    },

    /**
     * 获取图像的Exif信息
     * @param {Object} options 传递过来的参数对象
     * @param {Function} feedback 实时反馈回调函数
     * @param {Function} done 执行完成后的回调
     */
    runGetExifInfo: (options, feedback, done) => {
      getExifInfo(options, feedback, done)
    }
  }
}


/**
 * 获取EXIF信息
 * @param {Object} options  传递过来的参数对象
 * @param {Function} feedback 实时反馈回调函数
 * @param {Function} done 执行完成后的回调
 */
const getExifInfo = (options, feedback, done) => {
  const lang = options.lang
  const localsLng = locals[lang] || locals[defaultLanguage]
  const sourcePath = options.inputPath

  var args = []

  // 检查源文件是否存在
  if (!sysFS.existsSync(sourcePath)) {
    return done(new Error(localsLng.fileNoExist))
  }

  // 配置工具
  let toolPath = ''
  if (process.platform === 'win32') {
    toolPath = sysPath.join(__dirname, '../../../bin/exifTool/win32/exiftool.exe')
  } else {
    toolPath = 'perl'
    args.push(sysPath.join(__dirname, '../../../bin/ex/fix_corrupted_nef.pl'))
  }

  // Call
  args.push('-j')
  args.push(sourcePath)

  streamResults(toolPath, args, feedback, (infoOrErr) => {
    if (infoOrErr instanceof Error) {
      done(infoOrErr)
    } else {
      done(infoOrErr)
    }
  })
}



/**
 * 通用处理调用函数
 * @param {Array} args 扩展参数
 * @param {Function} feedbackCallback 实时反馈回调
 * @param {Function} doneCallback 完成后回调
 */
const streamResults = (toolPath, args = [], feedbackCallback, doneCallback) => {
  var outputString = ''
  var stderrString = ''

  let child = null
  try {
    child = spawn(toolPath, args)
  } catch (error) {
    console.trace(error)
  }

  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', (data) => {
    outputString += data
    feedbackCallback && feedbackCallback(data)
  })
  child.stderr.on('data', (data) => {
    stderrString += data
  })
  child.on('exit', (exitCode) => {
    if (exitCode !== 0 || stderrString.length > 0) {
      return doneCallback(new Error(stderrString))
    }
    doneCallback({
      code: exitCode,
      stdout: outputString,
      stderr: stderrString
    })
  })
}

