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
    </div>
    <div class="page__examples page__examples-app-doc">
    </div>
  </section>
</template>

<script>
import { BS, Util, _ } from 'dovemaxsdk'
import {UiIcon, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui';
import {Transfer} from '../../bridge/transfer'

////////////////////////////////////////////////////////

export default {
   computed: {
     actionList() {
       var that = this
       return [
          {id:'action-setting', visiable:true, color:"black", icon:"fa fa-file-image-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.setting"},
          {id:'action-online-doc', visiable:true, color:"black", icon:"fa fa-folder-open-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.onlineDoc"}
       ]
     },
     pageList() {
       var that = this
       return [

       ]
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
        UiConfirm,
        UiProgressLinear
    }
}


</script>