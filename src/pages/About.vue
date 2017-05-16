<template>
  <section class="page page-app-doc">
    <div class="dove-docs-content__page-content__title">
      <h3 class="dove-docs-content__page__title">{{$t('pages.abouts.header.title')}}</h3>
    </div>
    <div class="dove-docs-content__page-content__body">
      <div class="dove-docs-content__page-content__feedback">
        <span class="dove-docs-content__page__fa fa-stack fa-lg">
          <i class="fa fa-square-o fa-stack-2x"></i>
          <i class="fa fa-flag fa-stack-1x"></i>
        </span>
        <span class="page-content__title__matter">{{appName}}</span>
      </div>
      <div class="dove-docs-content__page-content__button">
        <ui-button
            raised
            size="small"
            type="secondary"
            >
            {{$t('pages.abouts.buttons.title')}}
          </ui-button>
          <ui-button
            raised
            size="small"
            type="secondary"
            >
            {{$t('pages.abouts.buttons.matter')}}
        </ui-button>
      </div>
      <div class="dove-docs-content__page-content__updata">
        <span class="dove-docs-content__page-content__release__new">
          {{$t('pages.abouts.releases.versions')}}{{ version }}<span class="page-content__release__space">({{appReleaseDate}})</span>
        </span>
        <ui-radio-group
            vertical
            :options="dataInfo.options.defaultGroup"
            v-model="group"
            >
        </ui-radio-group>
      </div>
    </div>
    <div class="dove-docs-content__page-content__licenses">
        <span>{{$t('pages.abouts.licenses.content')}}<span class="page-content__licenses__space">{{companyName}}</span></span>
        <div class="dove-docs-content__page-content__licenses__service">
          <span>{{appName}}<a class="page-content__terms__service" target="_blank" href="">{{$t('pages.abouts.licenses.service')}}</a></span>
        </div>
    </div>
  </section>
</template>

<script>
import {UiButton,UiTextbox,UiRadioGroup} from 'keen-ui'
import Routes from './../routes.js'

export default {
        data(){
    return {
        group: 'default',
        appName:  Routes.SysConfig.appName,
        version:  Routes.SysConfig.version,
        appReleaseDate: Routes.SysConfig.appReleaseDate,
        companyName:Routes.SysConfig.companyName
    }
  },
  computed:{
    dataInfo(){
      var that = this
      const defaultGroup = [
          {
              label: that.$t("pages.abouts.updata.auto"),
              value: "default"
          },
          {
              label: that.$t("pages.abouts.updata.remind"),
              value: "others"
          }
      ]
      return {
         options:{
           defaultGroup
          }
      }
    }
  },
  components: {
        UiButton,
        UiTextbox,
        UiRadioGroup
  }
}
</script>