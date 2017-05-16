<template>
  <section class="page page-app-doc">
    <div class="page__about__title">
      <h3>{{$t('pages.abouts.header.title')}}</h3>
    </div>
    <div class="page__about__body">
      <div class="page__about__feedback">
        <span class="fa fa-stack fa-lg">
          <i class="fa fa-square-o fa-stack-2x"></i>
          <i class="fa fa-flag fa-stack-1x"></i>
        </span>
        <span class="page__about__title__matter">{{appName}}</span>
      </div>
      <div class="page__about__content__button">
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
      <div class="page__about__content__updata">
        <span class="page__about__content__release__new">
          {{$t('pages.abouts.releases.versions')}}{{ version }}<span class="page-about__release__space">({{appReleaseDate}})</span>
        </span>
        <ui-switch
            v-model= "switched"
            >
            {{$t('pages.abouts.updata.remind')}}
        </ui-switch>
      </div>
    </div>
    <div class="page__about__content__licenses">
        <span>{{$t('pages.abouts.licenses.content')}}<span class="page-about__licenses__space">{{companyName}}</span></span>
        <div class="page__about__content__licenses__service">
          <span>{{appName}}
            <span class="page-about__licenses__space"><a class="page-content__terms__service" target="_blank" href="">{{$t('pages.abouts.licenses.service')}}</a></span>
          </span>
        </div>
    </div>
  </section>
</template>

<script>
import {UiButton,UiTextbox,UiRadioGroup,UiSwitch} from 'keen-ui'
import Routes from './../routes.js'

export default {
  data(){
    return {
        switched:false,
        appName:  Routes.SysConfig.appName,
        version:  Routes.SysConfig.version,
        appReleaseDate: Routes.SysConfig.appReleaseDate,
        companyName:Routes.SysConfig.companyName
    }
  },

  components: {
        UiButton,
        UiTextbox,
        UiRadioGroup,
        UiSwitch
  }
}
</script>