///----------- Base
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import KeenUI from 'keen-ui'
import Vuex from 'vuex'
import { BS, Util, _ } from 'dovemaxsdk'

///----------- Extern
import './extern.js'

///----------- Components
import App from './App.vue'
import Routes from './routes.js'

// Allow inspection, even in production mode
Vue.config.devtools = true;

// Use VueI18n
Vue.use(VueI18n)

// Use KeenUI
Vue.use(KeenUI)

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
        return h(App);
    }
});


app.$mount('#app')
