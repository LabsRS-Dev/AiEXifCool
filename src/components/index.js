import UIExifInfo from './ui-exif-info.vue'

const DoveMXComponents = {
  UIExifInfo,

  install (Vue) {
    Vue.component('dovemxui-exif-info', UIExifInfo)
  }
}

export default DoveMXComponents

export { UIExifInfo }

