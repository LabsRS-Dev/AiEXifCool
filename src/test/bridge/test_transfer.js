import { BS, Util, _ } from 'dove.max.sdk'
import { Transfer } from '../../bridge/transfer'


window.$TS = {
  getExifInfo: function () {
    var taskList = [
        { id: '001', fileName: 'RAW_NIKON_D7100.NEF', filePath: 'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\RAW_NIKON_D7100.NEF', fileSize: '27.5MB' },
        { id: '002', fileName: 'YDSC_0021.NEF', filePath: 'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\YDSC_0021.NEF', fileSize: '10.7MB' }
    ]

    var srcImagesMap = {}
    _.each(taskList, (taskObj, index) => {
      srcImagesMap[taskObj.id] = taskObj.filePath
    })

    var curFixTaskID = _.uniqueId('test-get-exif-task-')
    Transfer.Tools.ModifyExifInfo.getExifInfo({
      taskID: curFixTaskID,
      data: {
        src: srcImagesMap
      },
      lang: 'en'
    }, (data) => {
      if (data.msg_type === 's_task_exec_running') {
        console.log('test_transfer.js running')
      } else if (data.msg_type === 's_task_exec_feedback') {
        const dataList = data.content
        console.log('test_transfer.js s_task_exec_feedback')
        console.dir(dataList)
      } else if (data.msg_type === 's_task_exec_result') {
        const dataList = data.content
        console.log('test_transfer.js s_task_exec_result')
        console.dir(dataList)

        // 分解获取到的数据
      }
    })
  }
}
