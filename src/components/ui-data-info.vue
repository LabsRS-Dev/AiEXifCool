<template>
  <div class="dovemxui-data-info__container">
      <ui-tabs 
        type="text"

        v-if="hasDataInformation"
        >
          <ui-tab 
            :title="category.title"
            :key="category.id"

            v-for="(category, categoryIndex) in dataSource.categories"
          >
            <dovemxui-property-editor
              :property-caption="options.propertyCaption"
              :value-caption="options.valueCaption"
              :category-id="category.id"
              :items="category.items"
              :bus="bus"

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
import { DataInformation } from './def-data'


class PropertyEditorConfig {
    constructor(propertyCaption = 'property', valueCaption = 'value'){
        this.propertyCaption = propertyCaption
        this.valueCaption = valueCaption
    }
}

export default {
  name: 'dovemxui-data-info',
  props: {
    options:{
        type: Object,
        default: new PropertyEditorConfig()
    },
    info: {
        type: Object,
        default: new DataInformation()
    },

    // MessageBus
    bus: {
      type: Object,
      default: null
    }
  },

  data(){
    return {
      dataSource: this.info,
      initialValue: JSON.stringify(this.info),
      isSaveChange: false
    }
  },
  computed: {
    classes(){
      return [
        
      ]
    },

    hasDataInformation(){
      var has = false
      try{
        has = this.dataSource.categories.length > 0
      }catch(e){}
      return has
    }
  },

  mounted() {
    this.bindBus()
  },

  methods:{
    bindBus(){
      var that = this
      if (that.bus) {
        that.bus.$on('to-save-data', function(in_data){
          that.save(in_data || that.dataSource)
        })

        that.bus.$on('to-check-data', function(in_data){
          that.check(in_data || JSON.parse(that.initialValue))
        })

        that.bus.$on('to-reset-data', function(in_data){
          that.reset(in_data || JSON.parse(that.initialValue))
        })
      }
    },
    save(data){
      this.isSaveChange = true
      for(let i=0; i < data.categories.length; ++i) {
        var category = data.categories[i]
        this.bus.$emit('to-save-items-data', category.items)
      }      
      this.__updateInitialValueWithData(data)
    },
    check(data){
      for(let i=0; i < data.categories.length; ++i) {
        var category = data.categories[i]
        this.bus.$emit('to-check-items-data', category.items)
      }
      this.__updateInitialValueWithData(data)
    },
    reset(data){
      for(let i=0; i < data.categories.length; ++i) {
        var category = data.categories[i]
        this.bus.$emit('to-reset-items-data', category.items)
      }
      this.__updateInitialValueWithData(data)
    },
    __updateInitialValueWithData(data){
      const curJSON = JSON.stringify(data)
      if (curJSON !== this.initialValue) {
        this.initialValue = curJSON
      }
    },

    // {} -----------------------------------------------------------

    setValue(categoryId, items) {
      for(let i=0; i < this.dataSource.categories.length; ++i) {
        var category = this.dataSource.categories[i]
        if (category.id === categoryId) {
          // category.items == items is true. 原因是数据传输过程中，使用的都是引用，所以，子 组件中修改会影响到父组件
          category.items = items
        }
      }

      this.isSaveChange = false
      this.$emit('change', this.dataSource)
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