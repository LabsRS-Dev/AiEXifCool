<template>
  <div class="dovemxui-exif-info__container">
      <ui-tabs type="text">
          <ui-tab 
            :title="category.title"
            :key="categoryIndex"
            v-for="(category, categoryIndex) in exifInformation.categories"
          >
            <dovemxui-property-editor
              :propertyCaption="propertyEditorConfig.propertyCaption"
              :valueCaption="propertyEditorConfig.valueCaption"
              :items="category.items"
            >
            </dovemxui-property-editor>
          </ui-tab>
      </ui-tabs>
  </div>
</template>

<script>
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui'
import DoveMX_UIPropertyEditor from './ui-property-editor.vue'
import { ExifInformation } from './def-exif'


class PropertyEditorConfig {
    constructor(propertyCaption = 'property', valueCaption = 'value'){
        this.propertyCaption = propertyCaption
        this.valueCaption = valueCaption
    }
}

export default {
  name: 'dovemxui-exif-info',
  props: {
    propertyEditorConfig:{
        type: Object,
        default: new PropertyEditorConfig()
    },
    exifInformation: {
        type: Object,
        default: new ExifInformation()
    }
  },
  data(){
    return {
      
    }
  },
  computed: {
    classes(){
      return [
        
      ]
    }
  },
  components: {
    UiIcon,
    UiTabs,
    UiTab,
    UiButton,
    UiIconButton,
    UiAlert,
    UiToolbar,
    UiSelect,
    UiConfirm,
    UiProgressLinear,
    'dovemxui-property-editor':DoveMX_UIPropertyEditor
  }
}

</script>

<style lang="scss">
.ui-tabs__body {
    padding: 0;
}
</style>