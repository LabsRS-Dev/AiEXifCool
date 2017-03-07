<template>
    <section class="page page--aiexifcool-repair">
        <div class="page__toolbar page__toolbar--aiexifcool-repair">
            <ui-icon-button 
                @click="onToolBtnClick(index)"
                :type="item.type"
                :size="item.size" 
                :color="item.color"
                :key="item.id"
                v-for="item, index in actionList"
                >
                    <span :class="item.icon" :title="$t(item.tooltip)"></span>
            </ui-icon-button>
        </div>        

        <div class="page__examples page__examples--aiexifcool-repair">
            <ui-alert @dismiss="item.style.show = false" removeIcon :type="item.style.type" v-show="item.style.show" :key="item" v-for="item in taskList">
                <div>
                    <div class="ui-toolbar__left">
                        <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" /> 
                        <strong class="ui-toolbar__left__fileName"> {{ item.name }} <sup class="ui-toolbar__left__fileSize">({{ item.size }})</sup></strong>
                    </div>
                    <div class="ui-toolbar__body">
                        <span class="ui-toolbar__body__filePath">{{ item.path }}</span>                       
                    </div>
                    <div class="ui-toolbar__right"></div>
                    <ui-progress-linear
                        :color=" !item.runState.hasErr? 'primary' : 'accent'"
                        type="determinate"
                        :progress="item.progress"
                        v-show="item.isworking"
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

const actionList = [
    {id:baseID + ++baseIDIndex, color:"white", icon:"fa fa-folder-open-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.repair.toolbar.import"},
    {id:baseID + ++baseIDIndex, color:"white", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.repair.toolbar.remove"},
    {id:baseID + ++baseIDIndex, color:"green", icon:"fa fa-legal fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.repair.toolbar.fix"}
]


let taskList = [];

class Task {
    constructor(thumb, name, path, size){
        this.id = "__ID__" + Date.now() + _.random(1000, 9999) + '__ID__';
        this.thumb = thumb;
        this.name = name;
        this.path = path;
        this.size = size;

        this.style = {
            show: true, 
            type: "success"
        }

        this.isworking = false;
        this.progress = 0;

        this.runState = {
            hasErr: false,
            success: false
        }
    }

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default {
    
    data() {
        return {
            actionList: actionList,
            taskList: taskList,
            progressInterval: null
        }
    },

    beforeDestroy() {
        clearInterval(this.progressInterval);
    },

    methods:{
        onToolBtnClick(index){
            console.log('onToolBtnClick', index)
            
            if (index === 0) this.importFiles()
            if (index === 1) this.removeAll()
            if (index === 2) this.fix()
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
                for(let i =0; i < 100; ++i){
                    var taskObj = new Task("images/picture.svg", "Images" + i, "/url/image" + i, i + '.2MB')
                    that.taskList.push(taskObj)
                }  
            }, function(data){
                if(data.success) {
                    var imageFiles = data.filesArray
                    imageFiles.forEach((fileObj, dinx) => {
                        let taskObj = new Task("images/picture.svg", fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr)
                        that.taskList.push(taskObj)
                    })
                }
            })       
        },

        removeAll(){
            var that = this
            that.taskList.splice(0, that.taskList.length);
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
                _.each(that.taskList, (taskObj, index) => {
                    Transfer.Tools.Fix.Image.run({
                        taskID: taskObj.id,
                        src: taskObj.filePath,
                        outDir: outDir || BS.b$.App.getTempDir()
                    }, () =>{
                        taskObj.isworking = true;
                        taskObj.progress = _.random(30, 100);
                    })
                })
            }
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
