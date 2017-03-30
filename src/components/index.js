/**
 * 如果要全局使用，可以导入本文件
 */

import DoveMX_UIDataInfo from './ui-data-info.vue'
import DoveMX_UIPropertyEditor from './ui-property-editor.vue'
import DoveMX_UIPropertyEditorItem from './ui-property-editor-item.vue'

import { DataInformation, DataCategory, DataItem } from './def-data'
import { PropertyItem } from './def-property-editor'

const DoveMXComponents = {
  DoveMX_UIDataInfo,
  DoveMX_UIPropertyEditor,
  DoveMX_UIPropertyEditorItem,

  install (Vue) {
    Vue.component('dovemxui-data-info', DoveMX_UIDataInfo)
    Vue.component('dovemxui-property-editor', DoveMX_UIPropertyEditor)
    Vue.component('dovemxui-property-editor-item', DoveMX_UIPropertyEditorItem)
  }
}

export default DoveMXComponents


// export ui component
export { DoveMX_UIDataInfo }
export { DoveMX_UIPropertyEditor }
export { DoveMX_UIPropertyEditorItem }

// export class
export { DataInformation }
export { DataCategory }
export { DataItem }
export { PropertyItem }


