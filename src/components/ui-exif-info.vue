<template>
  <div class="dovemxui-exif-info">
      <ui-tabs type="text">
          <ui-tab 
            :title="category.title"
            v-for="category, categoryIndex in exif.categories"
          >
              <ul>
                <li
                    v-for="keyItem, keyItemIndex in category.items"
                >
                    {{ keyItem.title }} : {{ keyItem.value }}
                </li>
              </ul>
          </ui-tab>
      </ui-tabs>
  </div>
</template>

<script>
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui'

export default {
  name: 'dovemxui-exif-info',
  props: {
    exif: {
        type: Object,
        default: {
            categories: [
                {
                    title: '基本信息',
                    items: {
                        key$filePath: {
                            title: '文件路径',
                            type: String,
                            value: 'Demo'
                        }
                    }
                },
                {
                    title: '扩展信息',
                    items: {

                    }
                }
           ]
        }
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