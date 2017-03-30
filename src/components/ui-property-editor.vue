<template>
  <div class="dovemxui-property-editor__container">
    <ui-select
        class="dovemxui-property-editor__search"
        :placeholder="planPlaceHolder"
        :options="propertyNames"
        hasSearch

        v-model="modelSelectProperty"
    ></ui-select>
    <div class="dovemxui-property-editor__container__visual__area">
      <table class="dovemxui-property-editor__container__table">
        <tr
          class="dovemxui-property-editor__container__head"
        >
          <td> {{ propertyCaption  }}</td>
          <td> {{ valueCaption }}</td>
        </tr>
        <tr
        class="dovemxui-property-editor__container__content"
        :key="item.id"

        v-for="(item, itemIndex) in items"
        >
          <td class="dovemxui-property-editor__container__property"
            :class="itemClasses(item)"
          > 
            <span :title="item.description">
              {{ item.title }} 
            </span>
          </td>
          <td class="dovemxui-property-editor__container__propertyValue"
            :class="itemClasses(item)"
          > 
            <dovemxui-property-editor-item
              :tip="item.description"
              :itemdata="item"
              :bus="bus"

              @change="onPropertyValueUpdate"
              @reset="onPropertyValueReset"
            >
            </dovemxui-property-editor-item>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui'
import DoveMX_UIPropertyEditorItem from './ui-property-editor-item.vue'
import { PropertyItem, PropertyEditor } from './def-property-editor'


export default {
  name: 'dovemxui-property-editor',
  props: {
    // UI Style
    planPlaceHolder: {
      type: String,
      default: "Search"
    },
    propertyCaption: {
      type: String,
      default: "Property"
    },
    valueCaption: {
      type: String,
      default: "Value"
    },
    // MessageBus
    bus:{
      type: Object,
      default: null
    },

    // Data
    categoryId: {
      type: [String, Number],
      require: true
    },
    items: {
      type: Array,
      default: [new PropertyItem()]
    }
  },
  data(){
    return {
      initialValue: JSON.stringify(this.items),
      isSaveChange: false,

      modelSelectProperty: {}
    }
  },
  computed: {
    classes(){
      return [
        { 'is-change': this.isChange}
      ]
    },
    isChange(){
      return this.items != this.orgItems
    },
    orgItems(){
      return JSON.parse(this.initialValue)
    },
    itemId2OrgValue(){
      var map = new Map()
      const items = this.orgItems
      for(let i = 0; i < items.length; ++i) {
        var item = items[i]
        map.set(item.id, item.value)
      }
      return map
    },

    propertyNames(){
      var that = this
      var keyNameList = [];

      for(let i=0; i <that.items.length; ++i){
        const item = that.items[i]
        keyNameList.push(item.title)
      }

      return keyNameList
    }
  },
  mounted() {
    this.bindBus()
  },

  methods:{
    bindBus(){
      var that = this
      if(that.bus) {
        that.bus.$on('save-data', function(){
          that.save()
        })

        that.bus.$on('check-items-data', function(items){
          that.check(items)
        })
      }
    },
    getPropertyValueStyle(item){

    },

    itemClasses(item){
      var isChange = false

      const orgItemValue = this.itemId2OrgValue.get(item.id)
      if (orgItemValue !== undefined) {
        isChange = ((orgItemValue !== item.value) && !this.isSaveChange)
      }
      return [
        { 'is-item-change':  isChange }
      ]
    },

    save(){
      this.initialValue = JSON.stringify(this.items)
      this.isSaveChange = true
    },
    check(items){
      for(let i=0; i < items.length; ++i){
         var item = items[i]
         this.bus.$emit('check-item-data', item)
      }
      this.initialValue = JSON.stringify(items)
    },

    setValue(id, value) {
      for(let i = 0; i < this.items.length; ++i) {
        var item = this.items[i]
        if (item.id === id) {
          // item.value == value is true. 原因是数据传输过程中，使用的都是引用，所以，子组件中修改会影响到父组件
          item.value = value
        }
      }

      this.isSaveChange = false
      this.$emit('change', this.categoryId, this.items)
    },

    onPropertyValueUpdate(id, value){
      console.log('onPropertyValueUpdate = ', id, value)
      this.setValue(id, value)
    },
    onPropertyValueReset(id, value){
      console.log('onPropertyValueReset = ', id, value)
      this.setValue(id, value)
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
    'dovemxui-property-editor-item': DoveMX_UIPropertyEditorItem
  }
}

</script>

<style lang="scss">
@import '../styles/define/imports.scss';

$padding-size: rem-calc(5px)  rem-calc(15px)  rem-calc(5px)  rem-calc(6px);
$border: 1px solid $md-grey-400;
$visual-box-height: 48vh;
$background: #d5d5d5;
$font-size: rem-calc(9px);

// ================================================
// 容器
// ================================================
.dovemxui-property-editor__container {
  background: #EDEDED;
}

// ================================================
// 过滤
// ================================================
.dovemxui-property-editor__search{
  font-size: $font-size;

  .ui-select__display, .ui-select__search-input, .ui-select-option{
    font-size: $font-size;
  }
}

// ================================================
// 可视化区域
// ================================================
.dovemxui-property-editor__container__visual__area {
  min-width: 100%;
  width: 100%;
  max-height: $visual-box-height;
  height: $visual-box-height;
  overflow-y: auto;
  overflow-x: hidden;
}

// ================================================
// 数据表
// ================================================
.dovemxui-property-editor__container__table {
  min-width: 100%;
  width: 100%;
  border: $border;
  padding: rem-calc($padding-size + 4px);

  .dovemxui-property-editor__container__head {
    // background: linear-gradient(rgba(233, 233, 233, 1.0), rgba(178, 178, 178, 1.0));
    text-align: center;
    padding: $padding-size;

    td{
      padding: $padding-size;
      border: $border;
      background: $background;
    }
    
  }

  .dovemxui-property-editor__container__content {
    .dovemxui-property-editor__container__property{
      max-width: 24%;
      width: auto;
      cursor: default;
      border: $border;
      padding: $padding-size;
      background: $background;
      font-size: rem-calc(10px);

      &.is-item-change {
        border-left: 6px solid #8eb6e4;
        border-radius: 6px;
      }
    }

    .dovemxui-property-editor__container__propertyValue{
      width: 76%;
      border: $border;
      background: white;
      padding: $padding-size;
      cursor: pointer;

      &.is-item-change {
        border: 3px solid #8eb6e4;
        border-radius: 6px;
      }
    }
  }


}

</style>