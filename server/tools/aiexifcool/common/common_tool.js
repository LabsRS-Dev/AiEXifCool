// const helperNefFix = require('./helper_nef_fix')
const sysFS = require('fs')
const sysPath = require('path')
const spawn = require('child_process').spawn

const nm_resize_image = require('resize-img')
const nm_tempfile = require('tempfile')

const nm_exiftool_vendored = require('exiftool-vendored')

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
    runGetImageThumb: (options, feedback, done) => {
      getImageThumb(options, feedback, done)
    }
  }
}


/**
 * 获取EXIF图像的缩略图。
 * @param {Object} options  传递过来的参数对象
 * @param {Function} feedback 实时反馈回调函数
 * @param {Function} done 执行完成后的回调
 */
const getImageThumb = (options, feedback, done) => {
  const lang = options.lang
  const localsLng = locals[lang] || locals[defaultLanguage]
  const sourcePath = options.inputPath
  const size = options.resize || { width: 32, height: 32 }

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
  //
  const tmpThumbFilePath = nm_tempfile('.jpg')

  // Call
  args.push('-b')
  args.push('-ThumbnailImage')
  args.push('-JpgFromRaw')
  args.push(sourcePath)
  args.push('-w')
  args.push('%0f' + sysPath.resolve(tmpThumbFilePath))

  // exec
  streamResults(toolPath, args, feedback, (infoOrErr) => {
    if (infoOrErr instanceof Error) {
      done(infoOrErr)
    } else {
      // 检测文件是否存在
      if (!sysFS.existsSync(tmpThumbFilePath)) {
        return done(new Error(localsLng.fileNoExist))
      }
      // resize
      nm_resize_image(sysFS.readFileSync(tmpThumbFilePath), size).then(buf => {
        sysFS.writeFileSync(tmpThumbFilePath, buf)
        done({
          src: sourcePath,
          thumbRealPath: sysPath.resolve(tmpThumbFilePath),
          thumb: sysPath.basename(tmpThumbFilePath),
          thumbSize: size
        })
      })
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

