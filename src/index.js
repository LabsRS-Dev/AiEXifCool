// /----------- Base
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import KeenUI from 'keen-ui';
import Vuex from 'vuex';
import {
  BS,
  Util,
  _
} from 'dovemaxsdk';

// /----------- Extern
import './extern.js';

// /----------- Components
import App from './App.vue';
import Routes from './routes.js';

// Allow inspection, even in production mode
Vue.config.devtools = true;

// Use VueI18n
Vue.use(VueI18n);

const self = this;
const lang = 'zh-CN';
Vue.locale(lang, () => {
  self.loading = true;
  return fetch('./locale/' + lang + '.json', {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => {
    return res.json();
  }).then(json => {
    self.loading = false;
    if (Object.keys(json).length === 0) {
      return Promise.reject(new Error('locale empty !!'));
    }
    return Promise.resolve(json);
  }).catch(err => {
    self.error = err.message;
    return Promise.reject();
  });
}, () => {
  console.log('set lang....');
  Vue.config.lang = lang;
  startApp();
});

function startApp() {
  // Use KeenUI
  Vue.use(KeenUI);

  // Use router
  Vue.use(VueRouter);
  const router = new VueRouter({
    routes: Routes.routes,
    linkActiveClass: 'is-active'
  });

  // App
  const app = new Vue({
    router,
    render(h) {
      console.log('start app render ....');
      return h(App);
    }
  });

  app.$mount('#app');
}

