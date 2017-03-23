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
      <div class="page__app__welcome">
        <ui-alert 
            :dismissible="false"
            :class="getItemStyleClass(item)"
            :type="item.style.type" 
            v-show="item.style.show" 
            :key="item" 
            v-for="item, index in newsList">
            <div class="page__examples-app-doc__item">
                <div class="ui-toolbar__top">
                    <div class="ui-toolbar__top__metainfo">
                        <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" /> 
                        <strong class="ui-toolbar__top__news__title"> 
                            {{ item.title }} 
                            <sup class="ui-toolbar__top__news__date">
                            ({{ item.date }})
                            </sup>
                        </strong>
                    </div>
                    <div class="ui-toolbar__top__metainfo__toolbar">
                        <ui-icon-button 
                            @click="onOpenParentDir(item.link)"
                            type="secondary"
                            color="black"
                            size="small"
                            >
                            <span class="fa fa-link fa-lg fa-fw" :title=" $t('pages.remove.task-item.open-parent-dir') "></span>
                        </ui-icon-button>
                    </div>
                </div>
                <div class="ui-toolbar__body">
                    <p class="ui-toolbar__body__news__description">{{ item.description }}</p>
                </div>
                <div class="ui-toolbar__bottom">
                </div>
            </div>
        </ui-alert>
      </div>
    </div>
  </section>
</template>

<script>
import { BS, Util, _ } from 'dovemaxsdk'
import {UiIcon, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui';
import {Transfer} from '../../bridge/transfer'
import {SysConfig} from '../../data/sys-config'






class News {
  constructor(thumb, title, date, description, link) {
    this.id = _.uniqueId('welcome-news-id-')
    this.thumb = thumb             // 缩略图
    this.title = title             // 新闻标题
    this.date = date               // 新闻创建的时间
    this.description = description // 新闻描述
    this.link = link               // 新闻的链接地址

    /// ------- 展示样式相关
    this.style = {
      show: true,
      type: "success"
    }
  }
}

////////////////////////////////////////////////////////

export default {
  data(){
    return {
      newsList: []
    }
  },
  beforeCreate(){

  },
  mounted(){
    this.testNewList()
  },
  computed: {
    actionList() {
      var that = this
      return [
        {id:'action-setting', visiable:true, color:"black", icon:"fa fa-cog fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.setting"},
        {id:'action-online-doc', visiable:true, color:"black", icon:"fa fa-book fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.onlineDoc"},
        {id:'action-online-room', visiable:true, color:"black", icon:"fa fa-users fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.onlineRoom"},
        {id:'action-update-news', visiable:true, color:"black", icon:"fa fa-rss fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.updateNews"}
      ]
    },
    pageList() {
      var that = this
      const prefix_i18n = 'pages.welcome.page.'
      return [
        {id:'action-exif-adjust', visiable:true, color:"accent", icon:"fa fa-cog fa-lg fa-fw", size:"normal", type:"primary", title: prefix_i18n + "adjust.title", tooltip: prefix_i18n + "adjust.tip"},
        {id:'action-exif-remove', visiable:true, color:"default", icon:"fa fa-book fa-lg fa-fw", size:"large", type:"primary", title: prefix_i18n + "remove.title", tooltip: prefix_i18n + "remove.tip"}
      ]
    }
  },
  methods:{
    testNewList(){
      // Test code
      var that = this
      var list = []

      for(let i =0; i<20; ++i){
        list.push({
            title: 'AiExifCool Ver 1.0.0 publish...', 
            date:'2017年3月23日', 
            description:`
            AiExifCool 新产品发布，涉及如下功能：
            1. 用户界面改进
            2. 用户产品功能更新
            3. 修复一些影响处理速度的问题
            `, 
            link: 'https://www.baidu.com'
          })
      }

      _.each(list, function(ele){
          let newsObj = new News("images/picture.svg", ele.title, ele.date, ele.description, ele.link)
          that.newsList.push(newsObj)
      })
    },
    // ------------------------- Style
    getItemStyleClass(item){
      var _styleClass = ['']
      return _styleClass
    },
    // -------------------------- Tool bar
    onToolBtnClick(index, item){
        console.log('onToolBtnClick', index)

        if(item.id === 'action-setting') {
            this.onBtnSettingClick()
        }else if (item.id === 'action-online-doc') {
            this.onBtnOnlineDocClick()
        }
    },

    onBtnSettingClick(){

    },

    onBtnOnlineDocClick(){
      console.log(SysConfig.docPage)
      BS.b$.App.open(SysConfig.docPage)
    },

    // -------------------------- Page UiButton
    onPageBtnClick(index, item){
      console.log('onPageBtnClick', index)
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