import IconsRef from './data/icon.js'
import sysConfigRef from './data/sys-config.js'

// /AiExifCool
import RepairPage from './pages/AiExifCool/Repair.vue'

// /
import AboutPage from './pages/About.vue'

// Config SystemConfig
const icons = IconsRef.iconSet
const sysConfig = sysConfigRef.sysConfig

const rootPath = '/' + sysConfig.appName

// Config menu
const menu = [{
  title: 'routes.common.title',
  isExpand: true,
  enableExpand: false,
  visible: true,
  menu: [{
    path: rootPath + '/repair',
    // path: '',
    show: true,
    component: RepairPage,
    title: 'routes.common.menu.repair.title',
    tip: 'routes.common.menu.repair.tip',
    icon: icons.repair,
    sourceUrl: ''
  }, {
    path: rootPath + '/adjust',
    show: true,
    component: AboutPage,
    title: 'routes.common.menu.adjust.title',
    tip: 'routes.common.menu.adjust.tip',
    icon: icons.adjust,
    sourceUrl: ''
  }, {
    path: rootPath + '/remove',
    show: true,
    component: AboutPage,
    title: 'routes.common.menu.remove.title',
    tip: 'routes.common.menu.remove.tip',
    icon: icons.remove,
    sourceUrl: ''
  }, {
    path: rootPath + '/compare',
    show: true,
    component: AboutPage,
    title: 'routes.common.menu.compare.title',
    tip: 'routes.common.menu.compare.tip',
    icon: icons.compare,
    sourceUrl: ''
  }, {
    path: rootPath + '/report',
    show: true,
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
      component: menuItem.component,
      meta: {
        section: section.title,
        title: menuItem.title,
        tip: menuItem.tip,
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
  sysConfig,
  icons,
  menu,
  routes
}
