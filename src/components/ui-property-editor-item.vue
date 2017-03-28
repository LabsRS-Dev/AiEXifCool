<template>
    <div class="dovemxui-property-editor-item__container"
    @dblclick="toggleEditWidgetOnDblClick"
    @focus="onFocus"
    >
      <ui-textbox class="dovemxui-property-editor-item__container__display"
        :title="asFormatTip"
        :readonly="true"
        :value="asText"
        v-show="!showEditWidget"
      >
      </ui-textbox>
      <div class="dovemxui-property-editor-item__container__edit"
        :is="component"
        :value="itemdata.value"
        v-show="showEditWidget"
      >
      </div>
      <ui-button class="dovemxui-property-editor-item__container__edit__btn" 
        size="small" 
        type="primary" 
        ref="dropdownButton"
        :has-dropdown="btnHasMenu"
        @click="onClickEditBtn"
        v-show="showEditWidget" 
        >
        <ui-menu
          contain-focus
          has-secondary-text
          has-icons
          slot="dropdown"
          :options="menuOptions"
          @close="$refs.dropdownButton.closeDropdown()"
          v-if="btnHasMenu"
        >
        </ui-menu>
        ...
        </ui-button>
    </div>
</template>

<script>
import {UiIcon, UiMenu, UiTextbox, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui'
import { PropertyItem, PropertyEditor } from './def-property-editor'

export default {
  name: "dovemxui-property-editor-item",
  props: {
    tip: String,
    itemdata: Object,
    default() {
      return new PropertyItem()
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      query: '',
      isActive: false,
      isTouched: false,
      showEditWidget: false,
      initialValue: JSON.stringify(this.itemdata)
    }
  },

  computed: {
    component(){
      if (this.itemdata.dataType === String){
        return UiTextbox
      }
      return UiTextbox
    },
    asFormatTip(){
      return this.tip + ' : ' + this.asText
    },
    asText(){
      if (this.itemdata.dataType === String){
        return this.itemdata.value
      }
    },
    btnHasMenu(){
      return false
    },
    menuOptions(){
      const menuOptions = [
        {
            id: 'edit',
            label: 'Edit',
            icon: 'edit',
            secondaryText: 'Ctrl+E'
        },
        {
            id: 'duplicate',
            label: 'Duplicate',
            icon: 'content_copy',
            secondaryText: 'Ctrl+D'
        },
        {
            id: 'share',
            label: 'Share',
            icon: 'share',
            secondaryText: 'Ctrl+Shift+S',
            disabled: true
        },
        {
            type: 'divider'
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: 'delete',
            secondaryText: 'Del'
        }
      ]

      return menuOptions
    }
  },

  watch: {
    showEditWidget() {
      if (this.showEditWidget) {
        this.onEdit()
        this.$emit('edit-widget-open')
      } else {
        this.onCloseEdit()
        this.$emit('edit-widget-close')
      }
    }
  },

  created(){

  },

  mounted() {
    document.addEventListener('click', this.onExternalClick)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onExternalClick)
  },

  methods: {
    onClickEditBtn(e) {
      // alert(12)
    },

    toggleEditWidgetOnDblClick(){
      this.toggleEditWidget(true)
    },

    toggleEditWidget(isDblClick = false) {
      if (isDblClick) {
        return this['openEditWidget']()
      }
      this[this.showEditWidget ? 'closeEditWidget' : 'openEditWidget']()
    },

    openEditWidget() {
      if (this.disabled || this.itemdata.readOnly) {
        return
      }

      this.showEditWidget = true
      if(!this.isActive) {
        this.isActive = true
      }
    },

    closeEditWidget(options = { autoBlur: false }) {
      this.showEditWidget = false

      if (!this.isTouched) {
        this.isTouched = true
        this.$emit('touch')
      }

      if (options.autoBlur) {
        this.isActive = false
      } else {
        // this.$refs.label.focus()
      }
    },

    onFocus(e) {
      if (this.isActive) {
        return
      }

      this.isActive = true
      this.$emit('focus', e)
    },

    onEdit(){

    },

    onCloseEdit(){

    },

    onExternalClick(e) {
      if (!this.$el.contains(e.target)) {
        if (this.showEditWidget) {
          this.closeEditWidget({ autoBlur: true })
        } else if (this.isActive) {
          this.isActive = false
        }
      }
    }
  },

  components: {
    UiIcon,
    UiMenu,
    UiTextbox,
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

$font-size: rem-calc(9px);

.dovemxui-property-editor-item__container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  // 显示非编辑状态
  .dovemxui-property-editor-item__container__display {
    margin-bottom: auto;
    width: 100%;

    .ui-textbox__input, .ui-textbox__textarea {
      font-size: $font-size;
      height: auto;
      border-bottom: none;
    }
  }

 // 编辑状态
  .dovemxui-property-editor-item__container__edit{
    margin-bottom: auto;
    width: 100%;

    .ui-textbox__input, .ui-textbox__textarea {
      font-size: $font-size;
      height: auto;
    }
  }

  // 编辑状态下工具按钮的样式
  .dovemxui-property-editor-item__container__edit__btn{
      margin-right: 0;
      margin-left: 2px;
      min-width: rem-calc(4px);
      width: rem-calc(4px);
      height: rem-calc(16px);
  }
}

</style>