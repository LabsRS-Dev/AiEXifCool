<template>
    <aside class="dove-docs-sidebar">
        <!--siderbar__header-->
        <div class="dove-docs-sidebar__header">
            <span class="dove-docs-sidebar__header-product-name">{{ appName }}</span>
            <a
                class="dove-docs-sidebar__header-version"
                :href="homepage"
                rel="noopener"
                target="_blank"
                title="View release notes"
            >v{{ version }}</a>

            <a
                class="dove-docs-sidebar__header-github-link"
                :href="homepage"
                rel="noopener"
                target="_blank"
                title="View on HomePage"
            >
                <ui-icon v-show="false">
                    <img src="images/plier.svg" width="24" height="24" viewBox="0 0 24 24" />
                </ui-icon>
            </a>
        </div>

        <!--siderbar__scrollable__content-->
        <div class="dove-docs-sidebar__scrollable">
            <ul class="dove-docs-sidebar__menu">

                <!--from menu-->
                <li class="dove-docs-sidebar__menu-section" v-for="section in menu">
                    <!--<div class="dove-docs-sidebar__menu-section-header">{{ section.title }}</div>-->

                    <ui-collapsible class="dove-docs-sidebar__menu-section-header"
                        v-if="section.visible"
                        :title="$t(section.title)" 
                        :open="section.isExpand"
                        :removeIcon="!section.enableExpand" 
                        :disabled="!section.enableExpand">
                        
                        <ul class="dove-docs-sidebar__menu-section-links">
                            <li 
                                class="dove-docs-sidebar__menu-li" exact
                                v-for="item in section.menu">
                                <router-link
                                    class="dove-docs-sidebar__menu-item" exact
                                    :to="item.path"
                                    v-if="item.show"
                                    :title="$t(item.tip)"
                                >
                                    <ui-icon v-show="false">
                                        <img :src="item.icon" width="16" height="16" viewBox="0 0 16 16" />
                                    </ui-icon>  
                                    <span class="dove-docs-sidebar__menu-item__caption" >{{ $t(item.title) }}</span>  
                                    
                                </router-link>
                            </li>
                        </ul>
                    </ui-collapsible>


                </li>
            </ul>

        </div>

    </aside>
</template>


<script>
import { BS, Util, _ } from 'dovemaxsdk'
import {UiIcon, UiCollapsible} from 'keen-ui'
import Routes from './../routes.js'

export default {
    data() {
        return {
            appName:  Routes.sysConfig.appName,
            version:  Routes.sysConfig.version,
            homepage: Routes.sysConfig.homepage,

            menu: Routes.menu
        }
    },

    components: {
        UiIcon,
        UiCollapsible
    }
}
</script>