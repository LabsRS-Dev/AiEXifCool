<template>
  <div class="dovemxui-property-editor__container">
    <ui-select
        class="dovemxui-property-editor__search"
        :placeholder="planPlaceHolder"
        :options="propertyNames"
        hasSearch
        v-model="modelSelectProperty"
    ></ui-select>
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
          {{ keyItem.value }} 
        </td>
      </tr>
    </table>  
  </div>
</template>
<script>
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui'
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
    UiProgressLinear
  }
}

</script>

<style lang="scss">
@import '../styles/define/imports.scss';

.dovemxui-property-editor__container {
  background: #EDEDED;

  
  .dovemxui-property-editor__search{
    font-size: rem-calc(9px);
  }
  .dovemxui-property-editor__container__table {
    width: 100%;
    border: 1px solid $md-grey-400;
    max-height: 80vh;

    .dovemxui-property-editor__container__head {
      background: linear-gradient(rgba(233, 233, 233, 1.0), rgba(178, 178, 178, 1.0));
    }

    .dovemxui-property-editor__container__content {
      .dovemxui-property-editor__container__property{
        width: 60%;
        cursor: default;
      }

      .dovemxui-property-editor__container__propertyValue{
        width: 40%;
      }
    }


  }
}

</style>