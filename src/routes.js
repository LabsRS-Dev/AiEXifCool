import IconsRef from './data/icon.js'
import sysConfigRef from './data/sys-config.js'


///AiExifCool
import RepairPage from './pages/AiExifCool/Repair.vue'


///Recommend
import RecommendDiscoverPage from './pages/Recommend/Discover.vue'
///MyTool
import MyToolLocalPage from './pages/MyTool/Local.vue'
import MyToolDownloadPage from './pages/MyTool/DownloadMgr.vue'


///
import AboutPage from './pages/About.vue'


// Config SystemConfig
const icons = IconsRef.iconSet
const sysConfig = sysConfigRef.sysConfig


const rootPath = '/' + sysConfig.appName

// Config menu
const menu = [{
        title: 'COMMON',
        isExpand: true,
        enableExpand: false,
        visible: true,
        menu: [{
            path: rootPath + '/repair',
            show:true,
            component: RepairPage,
            title: 'Repair',
            tip: 'Fix Image file',
            icon: icons['repair'],
            sourceUrl: ''
        }, {
            path: rootPath +'/adjust',
            show:true,
            component: AboutPage,
            title: 'Adjust',
            tip: 'Adjust image\'s exif information',
            icon: icons['adjust'],
            sourceUrl: ''
        }, {
            path: '/recommend/course',
            show:true,
            component: AboutPage,
            title: 'Remove',
            tip: 'Remove image\'s exif information',
            icon: icons['remove'],
            sourceUrl: ''       
        }, {
            path: '/recommend/course',
            show:true,
            component: AboutPage,
            title: 'Compare',
            tip: 'Compare Image Exif info',
            icon: icons['compare'],
            sourceUrl: ''   
        }, {
            path: '/recommend/course',
            show:true,
            component: AboutPage,
            title: 'Report',
            tip: 'Batch Export Exif info',
            icon: icons['report'],
            sourceUrl: ''                             
        }]
    },
    {
        title: '我的应用',
        isExpand: true,
        enableExpand: false,
        visible: true,
        menu: [{
            path: '/MyTool/local',
            show:true,
            component: MyToolLocalPage,
            title: '本地应用',
            tip: '',
            icon: icons['discover'],
            sourceUrl: ''
        }, {
            path: '/MyTool/download',
            show:true,
            component: MyToolDownloadPage,
            title: '下载管理',
            tip: '',
            icon: icons['discover'],
            sourceUrl: ''
        }, {
            path: '/MyTool/cloud',
            show:false,
            component: AboutPage,
            title: '我的应用云盘',
            tip: '',
            icon: icons['discover'],
            sourceUrl: ''
        }, {
            path: '/MyTool/author',
            show:true,
            component: AboutPage,
            title: '我关注的应用开发者',
            tip: '',
            icon: icons['discover'],
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
            icon: icons['discover'],
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
        };
    });

    return paths.concat(sectionPaths);
}, []);


// export
export default {
    sysConfig,
    icons,
    menu,
    routes
}
