import DoveMX_UIExifInfo from './ui-exif-info.vue'
import DoveMX_UIPropertyEditor from './ui-property-editor.vue'

import { ExifInformation, ExifCategory, ExifItem } from './def-exif'
import { PropertyItem } from './def-property-editor'

const DoveMXComponents = {
  DoveMX_UIExifInfo,
  DoveMX_UIPropertyEditor,

  install (Vue) {
    Vue.component('dovemxui-exif-info', DoveMX_UIExifInfo)
    Vue.component('dovemxui-property-editor', DoveMX_UIPropertyEditor)
  }
}

export default DoveMXComponents


// export ui component
export { DoveMX_UIExifInfo }
export { DoveMX_UIPropertyEditor }

// export class
export { ExifInformation }
export { ExifCategory }
export { ExifItem }
export { PropertyItem }


