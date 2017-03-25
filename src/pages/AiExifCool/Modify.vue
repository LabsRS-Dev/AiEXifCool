<template>
    <section class="page page-app-doc">
        <div class="page__toolbar page__toolbar-app-doc">
            <ui-icon-button 
                @click="onToolBtnClick(index, item)"
                :type="item.type"
                :size="item.size" 
                :color="item.color"
                :key="item.id"
                v-if="item.visiable"
                v-for="item, index in actionList"
                >
                    <span :class="item.icon" :title="$t(item.tooltip)"></span>
            </ui-icon-button>

            <ui-confirm
                :autofocus="confirmDialog.autofocus"
                :confirm-button-text="confirmDialog.confirmButtonText"
                :deny-button-text="confirmDialog.denyButtonText"
                :ref="confirmDialog.ref"
                :title="confirmDialog.title"

                @confirm="onConfirmDialogConfirm"
                @deny="onConfirmDialogDeny"
            >
                {{ confirmDialog.content }}
            </ui-confirm>
        </div>

        <div class="page__examples page__examples-app-doc">
            <svg 
                :id="welcomeContentID"
                class="page__examples-app-doc__welcome"
                v-show="taskList.length <= 0"
                />
            <ui-alert 
                :class="getItemStyleClass(item)"
                @dismiss="onRemoveTaskItem(item, index)" removeIcon 
                :type="item.style.type" 
                v-show="item.style.show" 
                :key="item" 
                v-for="item, index in taskList">
                <div class="page__examples-app-doc__item">
                    <div class="ui-toolbar__top">
                        <div class="ui-toolbar__top__metainfo">
                            <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" /> 
                            <strong class="ui-toolbar__top__fileName" :title=" $t('pages.modify.task-item.file-name') +  item.name"> 
                                {{ item.name }} 
                                <sup class="ui-toolbar__top__fileSize" :title=" $t('pages.modify.task-item.file-size') +  item.size ">
                                ({{ item.size }})
                                </sup>
                            </strong>
                        </div>
                        <div class="ui-toolbar__top__metainfo__toolbar">
                            <ui-select
                                :placeholder="planPlaceHolder"
                                :options="planList"
                                v-model="item.selectPlanModel"
                            ></ui-select>
                            <ui-icon-button 
                                @click="onSettingPlan(item)"
                                type="secondary"
                                color="black"
                                size="small"
                                >
                                <span class="fa fa-pencil fa-lg fa-fw" :title=" $t('pages.modify.task-item.setting-plan') "></span>
                            </ui-icon-button>
                            <ui-icon-button 
                                @click="onOpenParentDir(item.fixOutDir)"
                                type="secondary"
                                color="white"
                                size="small"
                                v-if="item.stateInfo.state > 0"
                                >
                                <span class="fa fa-folder-open-o fa-lg fa-fw" :title=" $t('pages.modify.task-item.open-parent-dir') "></span>
                            </ui-icon-button>

                            <ui-icon-button 
                                @click="onPreviewFile(item.fixpath)"
                                type="secondary"
                                color="white"
                                size="small"
                                v-if="item.stateInfo.state > 0"
                                >
                                <span class="fa fa-eye fa-lg fa-fw" :title=" $t('pages.modify.task-item.review-in-file') "></span>
                            </ui-icon-button>
                        </div>


                    </div>
                    <div class="ui-toolbar__body">
                        <span
                            :class="['ui-toolbar__top__taskMessage', item.stateInfo.state < 0 ? 'task-item-has-error': '']"
                            :title="item.stateInfo.message"
                            v-show="item.stateInfo.state < 0"
                            >
                            {{ item.stateInfo.message }}
                        </span>
                        <span class="ui-toolbar__body__filePath" :title=" $t('pages.modify.task-item.file-path') + item.path">{{ item.path }}</span>
                    </div>
                    <div class="ui-toolbar__bottom">
                        <ui-progress-linear
                            :color="getItemProgressStyle(item)"
                            type="determinate"
                            :progress="item.progress"
                            v-show="getImageProgressShow(item)"
                            :title=" $t('pages.modify.task-item.progress') + item.progress"
                        ></ui-progress-linear>
                    </div>
                </div>
                
            </ui-alert>
        </div>

        <div :class=" ['page__footbar page__footbar-app-doc', {transferNormal: transferIsNormal}, {working: isModifyWorking}]" v-if="taskList.length >= 0">
            <span>{{ $t('pages.modify.footbar.fileCount') }} : {{ taskList.length }} </span>
            <span>{{ $t('pages.modify.footbar.state') }} : {{ isModifyWorking ? $t('pages.modify.footbar.isModifyWorking') : $t('pages.modify.footbar.isWaiting') }} </span>
            <i :class="[isModifyWorking ? 'fa fa-spinner fa-spin fa-lg fa-fw':'fa fa-lg fa-fw' ]"/></i>
            <span>{{ $t('pages.modify.footbar.transferState') }} : {{ transferIsNormal ? $t('pages.modify.footbar.transferIsNormal') : $t('pages.modify.footbar.transferIsFault') }} </span>
        </div>
    </section>
</template>    

<script>
import { BS, Util, _ } from 'dovemaxsdk'
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui';
import {Transfer} from '../../bridge/transfer'


var baseID = "__page__modify__action__"
var baseIDIndex = -1

let taskList = [];
const taskPrefix = 'modify-page-image-id-' + _.now()
class Task {
    constructor(thumb, name, path, size){
        this.id = _.uniqueId(taskPrefix);
        this.thumb = thumb;   // 缩略图
        this.name = name;     // 图像文件名称
        this.path = path;     // 图像文件的路径
        this.size = size;     // 图像文件的存储大小

        /// ----- 展示样式相关
        this.style = {         
            show: true, 
            type: "success"
        };

        /// ----- 自己的方案选择
        this.selectPlanModel = '';  // 所选的处理方案

        /// ----- 修改工作的情况
        this.isworking = false;     // 是否正在修改中
        this.progress = 0;          // 修改进度(100为单位)
        this.fixOutDir = "";        // 指定的修改输出目录
        this.fixpath = "";          // 修改成功的文件路径
        this.stateInfo = {           // 修改运行状态
            state: 0,               // 修改是否成功 0. 没有修改， 1，修改成功， -1修改失败
            message: ""             // 修改结果的描述，如果是错误，描述错误，如果是成功，描述其定义内容
        }
    }

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default {
    
    data() {
        console.log("Modify.vue call data()")
        return {
            welcomeContentID:'page__modify__welcome__id',
            planSelectModel: '',
            taskList: taskList,
            taskID2taskObj: {},
            isModifyWorking: false,
            transferIsNormal: Transfer.isRunning,  // Is transfer is working normal?
            progressInterval: null,  // 进度条轮询
            confirmDialog:{
                ref: 'default',
                autofocus: 'none',
                confirmButtonText: 'Confirm',
                denyButtonText: 'Deny',
                title: '',
                content: '',
                callbackConfirm: ()=>{},
                callbackDeny: ()=>{}
            }, 
            curFixTaskID: null       // 当前正在执行修改的整体任务ID
        }
    },

    beforeCreate(){
        var that = this
        console.log('Modify.vue beforeCreate')

        Transfer.frontAgent.registerOnChannelFault(function () {
            that.onTransferIsFault()
        })

        Transfer.frontAgent.registerOnFinishBuildChannel(function (){
            that.onTransferIsNoraml()
        })
    },
    mounted(){
        this.drawWelcome()
    },
    beforeDestroy() {
        clearInterval(this.progressInterval);
    },

    computed:{
        actionList() {
           var that = this
           return [
                {id:'action-import', visiable:true, color:"black", icon:"fa fa-file-image-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.modify.toolbar.import"},
                {id:'action-importDir', visiable:true, color:"black", icon:"fa fa-folder-open-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.modify.toolbar.importDir"},
                {id:'action-remove', visiable:true, color:"black", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.modify.toolbar.remove"},
                {id:'action-choicePlan', visiable:true, color:"primary", icon:"fa fa-database fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.modify.toolbar.choicePlan"},
                {id:'action-do', visiable:!that.isModifyWorking, color:"green", icon:"fa fa-legal fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.modify.toolbar.fix"},
                {id:'action-stop', visiable:that.isModifyWorking, color:"red", icon:"fa fa-hand-paper-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.modify.toolbar.chancel"}
           ]
        },

        planPlaceHolder() {
          var that = this
          return that.$t('pages.modify.plans.default')
        },
        planList() {
          var that = this

          var list = []
          list.push({
            label: that.$t('pages.modify.plans.default'),
            value: 0
          })

          for(let i=0; i < 20; ++i){
            list.push({
              label: i + '-修改Exif日期',
              value: i+1
            })
          }

          return list
        }
    },

    methods:{
        // ------------------------- on Transfer Events
        onTransferIsNoraml() {
            var that = this
            that.transferIsNormal = true
        },
        onTransferIsFault(){
            var that = this
            that.transferIsNormal = false
            that.isModifyWorking = false

            // All task list run working
            that.stopDo()

        },

        // ------------------------- Welcome content
        drawWelcome(){
            var that = this
            var SnapRef = Util.util.getSnapSVG$()
            if (SnapRef) {
                var s = SnapRef('#' + that.welcomeContentID)

                // 创建一个盒子
                var rect = s.rect('8%', '8%', '84%', '84%', 16)
                rect.attr({
                    fill: "none",
                    "fill-opacity": 0.5,
                    "stroke-linecap": "round",
                    "stroke-linejoin": "bevel",
                    "stroke-dasharray" : "5,5",
                    stroke: "#adadad",
                    strokeWidth: 1
                })

                // 创建一个文字盒子
                var description = s.text('12%', '16%', that.$t('pages.modify.welcome.description'))
                var step1 = s.text('15%', '26%', that.$t('pages.modify.welcome.step1'))
                var step2 = s.text('15%', '36%', that.$t('pages.modify.welcome.step2'))
                var step3 = s.text('15%', '46%', that.$t('pages.modify.welcome.step3'))
                var step4 = s.text('15%', '56%', that.$t('pages.modify.welcome.step4'))

                // 修饰一下文字
                description.attr({
                    "font-weight": "bold"
                })

            }
        },        

        // ------------------------- Style
        getItemStyleClass(item){
            var _styleClass = ['']
            if (item.stateInfo) {
                
                if (item.stateInfo.state < 0) {
                    _styleClass = ['isFixFailed']
                }
                if (item.stateInfo.state > 0) {
                    _styleClass = ['isFixedSuccess']
                }
            }

            return _styleClass
        },

        getItemProgressStyle(item){
            var that = this
            var progressStyle = 'black' // item.stateInfo.state === 0
            if (item.stateInfo) {
                if (item.stateInfo.state < 0) progressStyle = 'accent'
                if (item.stateInfo.state > 0) progressStyle = 'primary'
            }

            return progressStyle
        },

        getImageProgressShow(item) {
            return item.isworking
        },

        // ------------------------- Confirm dialog
        onConfirmDialogConfirm(){
            var that = this
            const  fn = that.confirmDialog.callbackConfirm
            fn && fn()
        },
        onConfirmDialogDeny(){
            var that = this
            const  fn = that.confirmDialog.callbackDeny
            fn && fn()
        },

        // -------------------------- Tool bar
        onToolBtnClick(index, item){
            console.log('onToolBtnClick', index)

            if(item.id === 'action-import') {
                this.onBtnImportFilesClick()
            }else if (item.id === 'action-importDir') {
                this.onBtnImportDirClick()
            }else if (item.id === 'action-remove') {
                this.onBtnRemoveAllClick()
            }else if (item.id === 'action-do') {
                this.onBtnDoClick()
            }else if (item.id === 'action-stop') {
                this.onBtnStopDoClick()
            }
        },

        onBtnImportFilesClick(){
            var that = this

            console.log("-------------------- call import files")
            // call bs 
            BS.b$.importFiles({
                title: this.$t('pages.modify.dialog-import-images.title'),
                prompt: this.$t('pages.modify.dialog-import-images.prompt'),
                allowMulSelection: true,
                types:[] // Note: too many formats
            }, function(){ // Test code
                // Test[1]: Windows 本地实际数据
                _.each([
                    {fileName: 'RAW_NIKON_D7100.NEF', filePath:'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\RAW_NIKON_D7100.NEF', fileSize: '27.5MB'},
                    {fileName: 'YDSC_0021.NEF', filePath:'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\YDSC_0021.NEF', fileSize: '10.7MB'}
                ], function(ele){
                    let taskObj = new Task("images/picture.svg", ele.fileName, ele.filePath, ele.fileSize)
                    that.taskList.push(taskObj)
                    that.taskID2taskObj[taskObj.id] = taskObj
                })

                return

                // Test[2]: 测试很多的情况下的列表展示
                for(let i =0; i < 50; ++i){
                    let taskObj = new Task("images/picture.svg", "Images" + i, "/url/image" + i, i + '.2MB')
                    that.taskList.push(taskObj)
                    that.taskID2taskObj[taskObj.id] = taskObj
                }  
            }, function(data){ // Normal code
                if(data.success) {
                    var imageFiles = data.filesArray
                    imageFiles.forEach((fileObj, dinx) => {
                        let taskObj = new Task("images/picture.svg", fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr)
                        that.taskList.push(taskObj)
                        that.taskID2taskObj[taskObj.id] = taskObj
                    })
                }
            })
        },

        onBtnImportDirClick(){
            var that = this

            console.log("-------------------- call import dir")
            // call bs 
            BS.b$.selectDir({
                title: this.$t('pages.modify.dialog-import-dir-images.title'),
                prompt: this.$t('pages.modify.dialog-import-dir-images.prompt'),
                allowMulSelection: true
            }, function(){
                for(let i =0; i < 5; ++i){
                    var taskObj = new Task("images/folder.svg", "ImagesDir" + i, "/url/imageDir" + i, i + '22.2MB')
                    that.taskList.push(taskObj)
                    that.taskID2taskObj[taskObj.id] = taskObj
                }  
            }, function(data){
                if(data.success) {
                    var imageFiles = data.filesArray
                    imageFiles.forEach((fileObj, dinx) => {
                        let taskObj = new Task("images/picture.svg", fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr)
                        that.taskList.push(taskObj)
                        that.taskID2taskObj[taskObj.id] = taskObj
                    })
                }
            })
        },

        onBtnRemoveAllClick(){
            var that = this

            if(that.taskList.length > 0) {
                const cdg = that.confirmDialog
                cdg.title = that.$t('pages.modify.dialog-confirm-remove-all.title')
                cdg.content = that.$t('pages.modify.dialog-confirm-remove-all.message')
                cdg.confirmButtonText = that.$t('pages.modify.dialog-confirm-remove-all.btnConfirm')
                cdg.denyButtonText = that.$t('pages.modify.dialog-confirm-remove-all.btnDeny')

                var dialog = that.$refs[cdg.ref]
                cdg.callbackConfirm = () =>{
                    that.stopDo()
                    that.taskList.splice(0, that.taskList.length)
                }
                dialog.open()
            }
        },

        onBtnDoClick(){
            var that = this
            
            if(that.taskList.length === 0) {
                return BS.b$.Notice.alert({
                    message: that.$t('pages.modify.notice-no-items.message')
                })
            }

            console.log("---------------------- call export dir")
            BS.b$.selectOutDir({
                title: that.$t('pages.modify.dialog-select-outdir.title'),
                prompt: that.$t('pages.modify.dialog-select-outdir.prompt'),
                canCreateDir: true
            },()=>{
                that.startDo('D:\\TestResource\\exif_sample_images\\Nikon\\corrupted_output')
            },(data)=>{
                if(data.success) {
                    var outDir = data.filePath
                    that.startDo(outDir)
                }
            })
        },

        onBtnStopDoClick(){
            var that = this

            if(that.isModifyWorking) {
                const cdg = that.confirmDialog
                cdg.title = that.$t('pages.modify.dialog-confirm-stop-fix.title')
                cdg.content = that.$t('pages.modify.dialog-confirm-stop-fix.message')
                cdg.confirmButtonText = that.$t('pages.modify.dialog-confirm-stop-fix.btnConfirm')
                cdg.denyButtonText = that.$t('pages.modify.dialog-confirm-stop-fix.btnDeny')

                var dialog = that.$refs[cdg.ref]
                cdg.callbackConfirm = () =>{
                    that.stopDo()
                }
                dialog.open()
            }            
        },

        startDo(outDir){
            var that = this

            var srcImagesMap = {}
            _.each(that.taskList, (taskObj, index) => {
                srcImagesMap[taskObj.id] = taskObj.path
            })

            that.curFixTaskID = _.uniqueId(taskPrefix + 'task-')
            Transfer.Tools.RemoveExifInfo.run({
                taskID: that.curFixTaskID,
                data:{
                    src: srcImagesMap,
                    outputDir: outDir || BS.b$.App.getTempDir()
                },
                lang: Vue.config.lang
            }, (data) =>{
                if (data.msg_type === 's_task_exec_running') {
                    that.isModifyWorking = true
                }else if (data.msg_type === 's_task_exec_feedback') {
                    let dataList = data.content
                    that.isModifyWorking = (dataList.length > 0)
                    _.each(dataList, (ele) => {
                        let curImageTaskObj = that.taskID2taskObj[ele.id]
                        if (curImageTaskObj) {
                            curImageTaskObj.isworking = ele.progress >= 100 ? false : true
                            curImageTaskObj.progress = ele.progress >= 100 ? 100: ele.progress
                            curImageTaskObj.stateInfo.state = ele.state
                            curImageTaskObj.stateInfo.message = ele.message || ''
                        }
                    })
                }else if (data.msg_type === 's_task_exec_result') {

                }
            })
        },

        stopDo(notice = true){
            var that = this
            // send stop message to server
            var srcImagesMap = {}
            _.each(that.taskList, (taskObj, index) => {
                // change all item state
                taskObj.isworking = false
                // prepare
                srcImagesMap[taskObj.id] = taskObj.path
            })

            if(!notice) return
            if(_.keys(srcImagesMap).length > 0 && that.isModifyWorking) {
                Transfer.Tools.RemoveExifInfo.stop({
                    taskID: that.curFixTaskID,
                    data:{
                        src: srcImagesMap
                    }
                })
            }
        },

        // -----------------------------------------
        // for task item
        __removeTaskItem(item, index) {
            var that = this
            item.isworking = false;
            // TODO：remove it from taskList
            item.progress = 0
            item.stateInfo = 0
            that.taskID2taskObj[item.id] = null

            // remove from taskList
            that.taskList.splice(index, 1)
        },
        onRemoveTaskItem(item, index) {
            console.log('item: ', item, 'index: ', index)
            var that = this
            
            if(item.isworking) {
                // notice to server 
                let srcImagesMap = {}
                srcImagesMap[item.id] = item.path
                Transfer.Tools.RemoveExifInfo.stop({
                    taskID: that.curFixTaskID,
                    data:{
                        src: srcImagesMap
                    }
                })
                that.__removeTaskItem(item, index)
            }else {
                that.__removeTaskItem(item, index)
            }

        },
        onSettingPlan(item){

        },
        onOpenParentDir(dir){
            var that = this
            BS.b$.revealInFinder(dir)
        },
        onPreviewFile(file){
            BS.b$.previewFile(dir)
        }
        // -------------------------------------------
    },

    components: {
        UiIcon,
        UiTabs,
        UiTab,
        UiButton,
        UiIconButton,
        UiAlert,
        UiToolbar,
        UiSelect,
        UiConfirm,
        UiProgressLinear
    }
}

</script>
