<template>
  <div class="dovemxui-exif-info">
      <ui-tabs type="text">
          <ui-tab title="Books">
              My books <a href="https://google.com" target="_blank" rel="noopener">Hey</a>
          </ui-tab>

          <ui-tab title="Authors">
              Authors
          </ui-tab>

          <ui-tab title="Collections">
              My collections
          </ui-tab>

          <ui-tab title="Favourites">
              My favourites
          </ui-tab>
      </ui-tabs>
  </div>
</template>

<script>
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui'

export default {
  name: 'dovemxui-exif-info',
  props: {

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