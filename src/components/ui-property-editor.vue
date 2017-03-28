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
        :key="'item' + keyItemIndex"
        v-for="(keyItem, keyItemIndex) in items"
        >
          <td class="dovemxui-property-editor__container__property"> 
            <span :title="keyItem.description">
              {{ keyItem.title }} 
            </span>
          </td>
          <td class="dovemxui-property-editor__container__propertyValue"> 
            <dovemxui-property-editor-item
              :tip="keyItem.description"
              :itemdata="keyItem"
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

    // Data
    items: {
      type: Array,
      default: [new PropertyItem()]
    }
  },
  data(){
    return {
      modelSelectProperty: {}
    }
  },
  computed: {
    classes(){
      return [
        
      ]
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

  methods:{
    setValue(value) {
    },
    getPropertyValueStyle(item){

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

$padding-size: rem-calc(4px);
$border: 1px solid $md-grey-400;
$visual-box-height: 48vh;

.dovemxui-property-editor__container {
  background: #EDEDED;

  
  .dovemxui-property-editor__search{
    font-size: rem-calc(9px);
  }

  .dovemxui-property-editor__container__visual__area {
    min-width: 100%;
    width: 100%;
    max-height: $visual-box-height;
    height: $visual-box-height;
    overflow-y: auto;

    .dovemxui-property-editor__container__table {
      min-width: 100%;
      width: 100%;
      border: $border;

      .dovemxui-property-editor__container__head {
        background: linear-gradient(rgba(233, 233, 233, 1.0), rgba(178, 178, 178, 1.0));
        text-align: center;
        padding: $padding-size;
        
      }

      .dovemxui-property-editor__container__content {
        .dovemxui-property-editor__container__property{
          max-width: 24%;
          width: auto;
          cursor: default;
          border: $border;
          padding: $padding-size;
        }

        .dovemxui-property-editor__container__propertyValue{
          width: 76%;
          border: $border;
          background: white;
          padding: $padding-size;
          cursor: pointer;
        }
      }


    }
  }

}

</style>