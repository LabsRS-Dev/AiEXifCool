/**
 * 如果要全局使用，可以导入本文件
 */

import DoveMX_UIExifInfo from './ui-exif-info.vue'
import DoveMX_UIPropertyEditor from './ui-property-editor.vue'
import DoveMX_UIPropertyEditorItem from './ui-property-editor-item.vue'

import { ExifInformation, ExifCategory, ExifItem } from './def-exif'
import { PropertyItem } from './def-property-editor'

const DoveMXComponents = {
  DoveMX_UIExifInfo,
  DoveMX_UIPropertyEditor,
  DoveMX_UIPropertyEditorItem,

  install (Vue) {
    Vue.component('dovemxui-exif-info', DoveMX_UIExifInfo)
    Vue.component('dovemxui-property-editor', DoveMX_UIPropertyEditor)
    Vue.component('dovemxui-property-editor-item', DoveMX_UIPropertyEditorItem)
  }
}

export default DoveMXComponents


// export ui component
export { DoveMX_UIExifInfo }
export { DoveMX_UIPropertyEditor }
export { DoveMX_UIPropertyEditorItem }

// export class
export { ExifInformation }
export { ExifCategory }
export { ExifItem }
export { PropertyItem }


