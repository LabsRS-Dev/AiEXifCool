const helperNefFix = require('./helper_nef_fix')



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
      const net_fix_helper = helperNefFix()
      net_fix_helper.run(options, feedback, done)
    }
  }
}
