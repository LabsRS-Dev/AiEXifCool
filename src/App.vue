<template>
  <!-- app -->
  <div id="app" class="dove-docs">
        <Sidebar class="is-desktop"></Sidebar>

        <transition name="transition-fade">
            <div
                class="dove-docs-mobile-sidebar__backdrop"
                @click="showSidebar = false"
                v-show="showSidebar"
            ></div>
        </transition>

        <transition name="transition-slide">
            <sidebar class="is-mobile" v-show="showSidebar"></sidebar>
        </transition>     
        
        <section class="dove-docs-content">
            <div class="dove-docs-content__toolbar">
                <div class="dove-docs-content__toolbar-content">
                    <ui-icon-button
                        class="dove-docs-content__toolbar-menu-button"
                        color="white"
                        icon="≡"
                        type="clear"

                        @click="showSidebar = true"
                    ></ui-icon-button>

                    <h1 class="dove-docs-content__toolbar-title">{{ $t($route.meta.title) }}</h1>
                    <h3 class="dove-docs-content__toolbar-title__sub">{{ $t($route.meta.tip) }}</h3>

                    <a
                        class="dove-docs-content__toolbar-action"
                        rel="noopener"
                        target="_blank"
                        :href="'https://github.com/JosephusPaye/Keen-UI/blob/master/' + $route.meta.sourceUrl"
                        v-if="$route.meta.sourceUrl"
                    >View Source</a>
                </div>
            </div>

            <div class="dove-docs-content__page-content" ref="pageContent">
                <router-view></router-view>
            </div>
        </section>
  </div>
</template>

<script>
    import VueI18n from 'vue-i18n'
    import {UiIcon} from 'keen-ui'
    import Sidebar from './pages/Sidebar.vue'


    export default {
        data() {
            return {
                showSidebar: false,
            }
        },

        components: {
            VueI18n,
            UiIcon,
            Sidebar
        }

    }
</script>

<style lang="scss">
    @import './styles/index.scss'
</style>