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
                        <img src="Images/picture.svg" width="48" height="48" viewBox="0 0 48 48" /> 
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
    </section>
</template>    

<script>
import { BS, Util, _ } from 'dovemaxsdk'
import {UiIcon, UiTabs, UiTab, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui';


var baseID = "__page__repair__action__"
var baseIDIndex = -1

const actionList = [
    {id:baseID + ++baseIDIndex, color:"white", icon:"fa fa-folder-open-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.repair.toolbar.import"},
    {id:baseID + ++baseIDIndex, color:"white", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.repair.toolbar.remove"},
    {id:baseID + ++baseIDIndex, color:"green", icon:"fa fa-legal fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.repair.toolbar.fix"}
]


let taskList = [];

class Task {
    constructor(name, path, size){
        this.id = "__ID__" + Date.now() + Math.random();
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

            // call bs 
            BS.b$.importFiles({
                title: this.$t('pages.repair.dialog-import-images.title'),
                prompt: this.$t('pages.repair.dialog-import-images.prompt')
            }, function(){
                for(let i =0; i < 100; ++i){
                    var taskObj = new Task("Images" + i, "/url/image" + i, i + '.2MB')
                    that.taskList.push(taskObj)
                }  
            })       
        },

        removeAll(){
            this.taskList.splice(0, this.taskList.length);
        },

        fix(){
            var taskObj = this.taskList[2];
            taskObj.isworking = true;
            this.progressInterval = setInterval(() => {
                if (taskObj.progress >= 100) {
                    taskObj.progress = 0;
                    taskObj.isworking = false;
                } else {
                    taskObj.isworking = true;
                    taskObj.progress += 5;
                }
            }, 600);
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
