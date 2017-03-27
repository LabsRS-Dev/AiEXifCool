<template>
  <div class="dovemxui-property-editor____container">
    <ul>
      <li
          v-for="keyItem, keyItemIndex in items"
      >
          {{ keyItem.title }} : {{ keyItem.value }}
      </li>
    </ul>  
  </div>
</template>
<script>
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui'

// 定义属性编辑器
class PropertyEditor {
    constructor() {

    }

    setup(){

    }

    /**
    ** 返回属性的当前值。基本类型被封装成对应的封装类实例
    **/
    getValue(){

    }
    
    /**
    ** 设置属性的值，基本类型以封装类传入
    **/
    setValue(newValue){

    }

    /**
    ** 将属性对象用一个字符串表示，以便外部的属性编辑器能以可视化的方式显示。缺省返回null，表示该属性不能以字符串表示；
    **/
    getAsText() {

    }

    /**
    ** 用一个字符串去更新属性的内部值，这个字符串一般从外部属性编辑器传入
    **/
    setAsText() {

    }

    /**
    ** 返回表示有效属性值的字符串数组（如boolean属性对应的有效Tag为true和false），以便属性编辑器能以下拉框的方式显示出来。缺省返回null，表示属性没有匹配的字符值有限集合
    **/
    getTags() {

    }

    /**
    ** 为属性提供一个表示初始值的字符串，属性编辑器以此值作为属性的默认值。
    **/
    getInitializationString() {

    }
}


export default {
  name: 'dovemxui-property-editor',
  props: {
    items: {
      type: Object,
      default: {}
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
    UiProgressLinear
  }
}


</script>