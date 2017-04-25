// /----------- Extern
import './extern.js'

// /----------- Base
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { BS, Util, _ } from 'dove.max.sdk'

// /----------- Components
import App from './App.vue'
import KeenUI from 'keen-ui'
import Routes from './routes.js'


// Allow inspection, even in production mode
Vue.config.devtools = true

// Use VueI18n
Vue.use(VueI18n, {})

window.Vue = Vue
window.VueI8n = VueI18n

const $ = Util.util.getJQuery$()

const lang = 'zh-CN'
const langJsonFile = './locale/' + lang + '.json'
/**
 * 由于ES6 中的Fetch函数，暂时还不能使用Babel转换成ES5标准的，所以统一使用jQuery来处理
 * 参考：
 * 1. https://www.npmjs.com/package/isomorphic-fetch
 * 2. https://www.npmjs.com/package/fetch-polyfill
 */
function ___useES6Fetch (lang, cb) {
  Vue.locale(lang, () => {
    return fetch(langJsonFile, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(json => {
      if (Object.keys(json).length === 0) {
        return Promise.reject(new Error('locale empty !!'))
      }
      return Promise.resolve(json)
    }).catch(err => {
      console.error(err)
      return Promise.reject()
    })
  }, () => {
    console.log('set lang....')
    Vue.config.lang = lang
    cb()
  })
}

function ___useJQueryGet (lang, cb) {
  $.getJSON(langJsonFile, json => {
    console.log('set lang....')
    Vue.config.lang = lang
    const locales = {}
    locales[lang] = json

    cb(new VueI18n({
      locale: lang,
      messages: locales
    }))
  }).fail(err => {
    console.error(err)
    cb(new VueI18n({
      locale: 'en-us',
      messages: {}
    }))
  })
}

function main () {
  const bUseES6Fetch = false
  if (bUseES6Fetch) {
    ___useES6Fetch(lang, startApp)
  } else {
    ___useJQueryGet(lang, startApp)
  }
}

function startApp (i18nObj) {
  // Use KeenUI
  Vue.use(KeenUI)

  // Use router
  Vue.use(VueRouter)
  const router = new VueRouter({
    routes: Routes.routes,
    linkActiveClass: 'is-active'
  })

  // App
  const app = new Vue({
    i18n: i18nObj,
    router,
    components: {
      App
    },
    render (h) {
      console.log('start app render ....')
      return h(App)
    }
  })

  document.title = Routes.SysConfig.appName
  app.$mount('#app')
}

$(document).ready(() => {
  main()
})
