const sysFS = require('fs')
const sysPath = require('path')
const spawn = require('child_process').spawn
const nm_fse = require('fs-extra')
const nm_temp = require('tmp')
const nm_os_tmpDir = require('os-tmpdir')


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
     * 启动接口
     * @param {Object} options 传递过来的参数对象
     * @param {Function} feedback 实时反馈回调函数
     * @param {Function} done 执行完成后的回调
     */
    run: (options, feedback, done) => {
      const useTemp = false
      if (useTemp) {
        runWithTmp(options, feedback, done)
      } else {
        runWithNoTmp(options, feedback, done)
      }
    }
  }
}

/**
 * 执行通过临时目录来处理
 * @param {Object} options 传递过来的参数对象
 * @param {Function} feedback 实时反馈回调函数
 * @param {Function} done 执行完成后的回调
 */
const runWithTmp = (options, feedback, done) => {
  const lang = options.lang
  const localsLng = locals[lang] || locals[defaultLanguage]
  const sourcePath = options.inputPath
  const outDirPath = options.outputDir

  var args = []

  // 检查源文件是否存在
  if (!sysFS.existsSync(sourcePath)) {
    return done(new Error(localsLng.fileNoExist))
  }

  // TODO: 检查输出目录是否存在，不存在需要创建
  if (!sysFS.existsSync(outDirPath)) {
    nm_fse.mkdirpSync(outDirPath)
    if (!sysFS.existsSync(outDirPath)) {
      return done(new Error(localsLng.cannotCreateTempDir))
    }
  }

  // TODO: 思路：当前选择方案（1）
  // 方案(1) 拷贝到临时目录进行处理。处理完成后，再拷贝到输出目录
  // 方案(2) 拷贝到输出目录，进行处理，处理完成后，根据情况是否删除临时文件
  // 配置工具
  let toolPath = ''
  toolPath = 'perl'
  args.push(sysPath.join(__dirname, '../../../bin/fixTool/fix_corrupted_nef.pl'))

  // 检测基本的临时输出目录是否存在
  const baseDir = '/fix_tool'
  const outBaseTmpDir = sysPath.join(nm_os_tmpDir(), baseDir)
  nm_fse.ensureDirSync(outBaseTmpDir)
  if (!sysFS.existsSync(outBaseTmpDir)) {
    return done(new Error(localsLng.fileNoExist))
  }

  nm_temp.dir({ mode: 777, prefix: baseDir + '/_' }, (err, folder) => {
    if (err) {
      return done(err)
    }
    console.log('folder:', folder)
    console.log('sourcePath:', sourcePath)

    // 检测源的类型，是文件还是目录
    let destPath = folder
    if (sysFS.lstatSync(sourcePath).isFile()) {
      const fileName = sysPath.basename(sourcePath)
      destPath = sysPath.join(folder, '/', fileName)
    }

    nm_fse.copy(sourcePath, destPath, err => {
      if (err) {
        nm_fse.remove(folder, err => {
          console.log(err)
        })
        return done(err)
      }
      // 配置处理的文件或者目录
      args.push(destPath)

      args.push('-o')
      args.push('%dfixed/%f.%e')

      // Call
      streamResults(toolPath, args, feedback, (infoOrErr) => {
        if (infoOrErr instanceof Error) {
          // 出错，需要删除临时目录
          nm_fse.remove(folder, err => {
            console.log(err)
          })
          done(infoOrErr)
        } else {
          // 正常处理，需要将处理的文件或者目录转移到输出目录中
          nm_fse.copy(folder, outDirPath, err => {
            if (err) return done(err)
            done(infoOrErr)
          })
        }
      })
    })
  })
}

/**
 * 执行不通过临时目录来处理
 * @param {Object} options 传递过来的参数对象
 * @param {Function} feedback 实时反馈回调函数
 * @param {Function} done 执行完成后的回调
 */
const runWithNoTmp = (options, feedback, done) => {
  const lang = options.lang
  const localsLng = locals[lang] || locals[defaultLanguage]
  var args = []

  const sourcePath = options.inputPath
  const outDirPath = options.outputDir

  // 检查源文件是否存在
  if (!sysFS.existsSync(sourcePath)) {
    return done(new Error(localsLng.fileNoExist))
  }

  // TODO: 检查输出目录是否存在，不存在需要创建
  if (!sysFS.existsSync(outDirPath)) {
    nm_fse.mkdirpSync(outDirPath)
    if (!sysFS.existsSync(outDirPath)) {
      return done(new Error(localsLng.cannotCreateTempDir))
    }
  }

  // TODO: 思路：当前选择方案（2）
  // 方案(1) 拷贝到临时目录进行处理。处理完成后，再拷贝到输出目录
  // 方案(2) 拷贝到输出目录，进行处理，处理完成后，根据情况是否删除临时文件
  // 配置工具
  let toolPath = ''
  toolPath = 'perl'
  args.push(sysPath.join(__dirname, '../../../bin/fixTool/fix_corrupted_nef.pl'))

  // 配置输入目录或者文件
  args.push(sourcePath)

  // 配置输出目录
  const specOutDir = sysPath.normalize(outDirPath) + '/fixed'
  args.push('-o')
  args.push('' + specOutDir + '/%f.%e')

  // Call
  streamResults(toolPath, args, feedback, (infoOrErr) => {
    done(infoOrErr)
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

  // 向执行命令输入参数
  child.stdin.write('14')
  child.stdin.end()
}
