// /
import AboutPage from './pages/About.vue'
import IconsRef from './data/icon.js'
import RemovePage from './pages/AiExifCool/Remove.vue'
import RepairPage from './pages/AiExifCool/Repair.vue'
import { SysConfig } from './data/sys-config.js'
// /AiExifCool
import WelcomePage from './pages/AiExifCool/Welcome.vue'

// Config SystemConfig
const icons = IconsRef.iconSet
const rootPath = '/' + SysConfig.appName

// Config menu
const menu = [{
  title: 'routes.common.title',
  isExpand: true,
  enableExpand: false,
  visible: true,
  menu: [{
    path: '',
    redirect: rootPath + '/welcome',
    show: false
  }, {
    path: rootPath + '/welcome',
    show: true,
    component: WelcomePage,
    title: 'routes.common.menu.welcome.title',
    tip: 'routes.common.menu.welcome.tip',
    tipAsSubTitle: false,
    icon: icons.adjust,
    sourceUrl: ''
  }, {
    path: rootPath + '/adjust',
    show: true,
    component: AboutPage,
    title: 'routes.common.menu.adjust.title',
    tip: 'routes.common.menu.adjust.tip',
    tipAsSubTitle: true,
    icon: icons.adjust,
    sourceUrl: ''
  }, {
    path: rootPath + '/remove',
    show: true,
    component: RemovePage,
    title: 'routes.common.menu.remove.title',
    tip: 'routes.common.menu.remove.tip',
    tipAsSubTitle: false,
    icon: icons.remove,
    sourceUrl: ''
  }, {
    path: rootPath + '/repair',
    show: true,
    component: RepairPage,
    title: 'routes.common.menu.repair.title',
    tip: 'routes.common.menu.repair.tip',
    tipAsSubTitle: false,
    icon: icons.repair,
    sourceUrl: ''
  }, {
    path: rootPath + '/compare',
    show: false,
    component: AboutPage,
    title: 'routes.common.menu.compare.title',
    tip: 'routes.common.menu.compare.tip',
    icon: icons.compare,
    sourceUrl: ''
  }, {
    path: rootPath + '/report',
    show: false,
    component: AboutPage,
    title: 'routes.common.menu.report.title',
    tip: 'routes.common.menu.report.tip',
    icon: icons.report,
    sourceUrl: ''
  }]
},
{
  title: '我的应用',
  isExpand: true,
  enableExpand: false,
  visible: false,
  menu: [{
    path: '/MyTool/local',
    show: true,
    component: AboutPage,
    title: '本地应用',
    tip: '',
    icon: icons.discover,
    sourceUrl: ''
  }, {
    path: '/MyTool/download',
    show: true,
    component: AboutPage,
    title: '下载管理',
    tip: '',
    icon: icons.discover,
    sourceUrl: ''
  }, {
    path: '/MyTool/cloud',
    show: false,
    component: AboutPage,
    title: '我的应用云盘',
    tip: '',
    icon: icons.discover,
    sourceUrl: ''
  }, {
    path: '/MyTool/author',
    show: true,
    component: AboutPage,
    title: '我关注的应用开发者',
    tip: '',
    icon: icons.discover,
    sourceUrl: ''
  }]
},
{
  title: '创建的应用清单',
  isExpand: false,
  enableExpand: true,
  visible: false,
  menu: []
},
{
  title: '收藏的应用清单',
  isExpand: false,
  enableExpand: true,
  visible: false,
  menu: [{
    path: '/ui-about',
    component: AboutPage,
    title: 'About',
    tip: '',
    icon: icons.discover,
    sourceUrl: ''
  }]
}
]

// Generate a Vue Router compatible routes map from the menu
const routes = menu.reduce((paths, section) => {
  const sectionPaths = section.menu.map(menuItem => {
    return {
      path: menuItem.path,
      redirect: menuItem.redirect || '',
      component: menuItem.component,
      meta: {
        section: section.title,
        title: menuItem.title,
        tip: menuItem.tip,
        tipAsSubTitle: menuItem.tipAsSubTitle || false,
        icon: menuItem.icon,
        show: menuItem.show,
        sourceUrl: menuItem.sourceUrl
      }
    }
  })

  return paths.concat(sectionPaths)
}, [])

// export
export default {
  SysConfig,
  icons,
  menu,
  routes
}
