<template>
    <section class="page page--aiexifcool-repair">
        <div class="page__toolbar page__toolbar--aiexifcool-repair">
            <ui-icon-button 
                @click="onToolBtnClick(index)"
                :type="item.type"
                :size="item.size" 
                :color="item.color"
                :key="item.id"
                v-if="item.visiable"
                v-for="item, index in actionList"
                >
                    <span :class="item.icon" :title="$t(item.tooltip)"></span>
            </ui-icon-button>
        </div>        

        <div class="page__examples page__examples--aiexifcool-repair">
            <ui-alert @dismiss="onRemoveTaskItem(item, index)" removeIcon :type="item.style.type" v-show="item.style.show" :key="item" v-for="item, index in taskList">
                <div>
                    <div class="ui-toolbar__left">
                        <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" /> 
                        <strong class="ui-toolbar__left__fileName" :title=" $t('pages.repair.task-item.file-name') +  item.name"> 
                            {{ item.name }} 
                            <sup class="ui-toolbar__left__fileSize" :title=" $t('pages.repair.task-item.file-size') +  item.size ">
                            ({{ item.size }})
                            </sup>
                        </strong>

                        <div class="">
                            <ui-icon-button 
                                @click="onOpenParentDir(item.fixOutDir)"
                                type="secondary"
                                color="black"
                                size="small"
                                v-if="item.fixState.state > 0"
                                >
                                <span class="fa fa-folder-open-o fa-lg fa-fw" :title=" $t('pages.repair.task-item.open-parent-dir') "></span>
                            </ui-icon-button>

                            <ui-icon-button 
                                @click="onPreviewFile(item.fixpath)"
                                type="secondary"
                                color="black"
                                size="small"
                                v-if="item.fixState.state > 0"
                                >
                                <span class="fa fa-eye fa-lg fa-fw" :title=" $t('pages.repair.task-item.review-in-file') "></span>
                            </ui-icon-button>
                        </div>


                    </div>
                    <div class="ui-toolbar__body">
                        <span class="ui-toolbar__body__filePath" :title=" $t('pages.repair.task-item.file-path') + item.path">{{ item.path }}</span>
                    </div>
                    <div class="ui-toolbar__right"></div>
                    <ui-progress-linear
                        :color=" item.fixState.state >=0 ? 'primary' : 'accent'"
                        type="determinate"
                        :progress="item.progress"
                        v-show="item.isworking"
                        :title=" $t('pages.repair.task-item.fix-progress') + item.progress"
                    ></ui-progress-linear>
                </div>
                
            </ui-alert>
        </div>

        <div class="page__footbar page__footbar--aiexifcool-repair" v-if="taskList.length > 0">
            <span>{{ $t('pages.repair.footbar.count') }} : {{ taskList.length }} </span>
        </div>
    </section>
</template>    

<script>
import { BS, Util, _ } from 'dovemaxsdk'
import {UiIcon, UiTabs, UiTab, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui';
import {Transfer} from '../../bridge/transfer'


var baseID = "__page__repair__action__"
var baseIDIndex = -1

let taskList = [];
const taskPrefix = 'fixpage-image-id-' + _.now()
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

        /// ----- 修复工作的情况
        this.isworking = false;     // 是否正在修复中
        this.progress = 0;          // 修复进度(100为单位)
        this.fixOutDir = "";        // 指定的修复输出目录
        this.fixpath = "";          // 修复成功的文件路径
        this.fixState = {           // 修复运行状态
            state: 0,               // 修复是否成功 0. 没有修复， 1，修复成功， -1修复失败
            message: ""             // 修复结果的描述，如果是错误，描述错误，如果是成功，描述其定义内容
        }
    }

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default {
    
    data() {
        return {
            taskList: taskList,
            taskID2taskObj: {},
            isFixworking: false,
            progressInterval: null,
            curFixTaskID: null
        }
    },

    beforeDestroy() {
        clearInterval(this.progressInterval);
    },

    computed:{
        actionList() {
            var that = this
            return _.values(that.getActionsMap())
        }
    },

    methods:{
        getActionsMap(){
            var that = this
            return {
                'import': {id:_.uniqueId(baseID), visiable:true, color:"white", icon:"fa fa-folder-open-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.repair.toolbar.import"},
                'remove': {id:_.uniqueId(baseID), visiable:true, color:"white", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.repair.toolbar.remove"},
                'fix': {id:_.uniqueId(baseID), visiable:!that.isFixworking, color:"green", icon:"fa fa-legal fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.repair.toolbar.fix"},
                'stopFix':{id:_.uniqueId(baseID), visiable:that.isFixworking, color:"red", icon:"fa fa-hand-paper-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.repair.toolbar.chancel"}
            }
        },

        onToolBtnClick(index){
            console.log('onToolBtnClick', index)
            
            if (index === 0) this.importFiles()
            if (index === 1) this.removeAll()
            if (index === 2) this.fix()
            if (index === 3) this.stopFix()
        },

        importFiles(){
            var that = this

            console.log("-------------------- call import files")
            // call bs 
            BS.b$.importFiles({
                title: this.$t('pages.repair.dialog-import-images.title'),
                prompt: this.$t('pages.repair.dialog-import-images.prompt'),
                allowMulSelection: true,
                types:[] // Note: too many formats
            }, function(){
                for(let i =0; i < 50; ++i){
                    var taskObj = new Task("images/picture.svg", "Images" + i, "/url/image" + i, i + '.2MB')
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

        removeAll(){
            var that = this
            that.stopFix()
            that.taskList.splice(0, that.taskList.length)
        },

        fix(){
            var that = this
            console.log("---------------------- call export dir")
            BS.b$.selectOutDir({
                title: that.$t('pages.repair.dialog-select-outdir.title'),
                prompt: that.$t('pages.repair.dialog-select-outdir.prompt'),
                canCreateDir: true
            },()=>{
                startFix()
            },(data)=>{
                if(data.success) {
                    var outDir = data.filePath
                    startFix(outDir)
                }
            })

            function startFix(outDir){
                var srcImagesMap = {}
                _.each(that.taskList, (taskObj, index) => {
                    srcImagesMap[taskObj.id] = taskObj.path
                })

                that.curFixTaskID = _.uniqueId(taskPrefix + 'task-')
                Transfer.Tools.Fix.Image.run({
                    taskID: that.curFixTaskID,
                    data:{
                        src: srcImagesMap,
                        outDir: outDir || BS.b$.App.getTempDir()
                    }
                }, (data) =>{
                    if (data.msg_type === 's_task_exec_running') {

                    }else if (data.msg_type === 's_task_exec_feedback') {
                        let dataList = data.content
                        that.isFixworking = (dataList.length > 0)
                        _.each(dataList, (ele) => {
                            let curImageTaskObj = that.taskID2taskObj[ele.id]
                            if (curImageTaskObj) {
                                curImageTaskObj.isworking = true
                                curImageTaskObj.progress = ele.progress >= 100 ? 100: ele.progress
                                curImageTaskObj.fixState.state = ele.state
                                // TODO
                            }
                        })
                    }else if (data.msg_type === 's_task_exec_result') {

                    }
                })
            }
        },

        stopFix(){
            var that = this
            // send stop message to server
            var srcImagesMap = {}
            _.each(that.taskList, (taskObj, index) => {
                // change all item state
                taskObj.isworking = false
                // prepare
                srcImagesMap[taskObj.id] = taskObj.path
            })
            Transfer.Tools.Fix.Image.chancel({
                taskID: that.curFixTaskID,
                data:{
                    src: srcImagesMap
                }
            })
            that.isFixworking = false
        },

        // -----------------------------------------
        // for task item
        __removeTaskItem(item, index) {
            var that = this
            item.isworking = false;
            // TODO：remove it from taskList
            item.progress = 0
            item.fixState = 0
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
                Transfer.Tools.Fix.Image.chancel({
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
        onOpenParentDir(dir){
            var that = this
            BS.b$.revealInFinder(dir)
        },
        onPreviewFile(file){
            BS.b$.previewFile(dir)
        }
    },

    components: {
        UiIcon,
        UiTabs,
        UiTab,
        UiButton,
        UiIconButton,
        UiAlert,
        UiToolbar,
        UiProgressLinear
    }
}

</script>
