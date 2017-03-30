<template>
  <div class="dovemxui-exif-info__container">
      <ui-tabs 
        type="text"

        v-if="hasExifInformation"
        >
          <ui-tab 
            :title="category.title"
            :key="'category' + categoryIndex"

            v-for="(category, categoryIndex) in exif.categories"
          >
            <dovemxui-property-editor
              :property-caption="options.propertyCaption"
              :value-caption="options.valueCaption"
              :category-id="category.id"
              :items="category.items"

              @change="onPropertyEditorValueChange"
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
    options:{
        type: Object,
        default: new PropertyEditorConfig()
    },
    exif: {
        type: Object,
        default: new ExifInformation()
    }
  },
  data(){
    return {
      initialValue: JSON.stringify(this.exif)
    }
  },
  computed: {
    classes(){
      return [
        
      ]
    },

    hasExifInformation(){
      let has = false
      try{
        has = this.exif.categories.length > 0
      }catch(e){}
      return has
    }
  },

  methods:{

    setValue(categoryId, items) {
      for(let i=0; i < this.exif.categories.length; ++i) {
        var category = this.exif.categories[i]
        if (category.id === categoryId) {
          // category.items == items is true. 原因是数据传输过程中，使用的都是引用，所以，子 组件中修改会影响到父组件
          category.items = items
        }
      }

      this.$emit('change', this.exif)
    },
    
    onPropertyEditorValueChange(categoryId, items){
      this.setValue(categoryId, items)
    },

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