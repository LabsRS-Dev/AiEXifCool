<template>
    <div class="dovemxui-property-editor-item__container"
    @click="toggleEditWidgetOnClick"
    @focus="onFocus"
    @blur="onBlur"
    >
      <!-- 显示控件(及编辑状态) -->
      <div 
        class="dovemxui-property-editor-item__container__display"
        :class="classes"
        >

        <!-- 文本编辑框 -->
        <ui-textbox 
          :title="formatTip"
          :readonly="isReadOnly"
          :value="submittedValue"

          @change="onUiTextBoxValueChange"
          @blur="onUiTextBoxBlur"
          @focus="onUiTextBoxFocus"
          @input="onUiTextBoxUpdateValue"
          @keydown.enter.prevent="onUiTextBoxKeydownEnter"
          @keydown="onUiTextBoxKeydown"

          v-if="ifComponentAsUiTextBox"
          >
        </ui-textbox>

        <!-- 进度条 -->
        <ui-progress-linear
          color="primary"
          type="determinate"

          :progress="vmValue"

          v-model="vmValue"
          v-if="ifComponentAsUiProgressLinear"
          >
        </ui-progress-linear>

        <!-- 滑动条 -->
        <ui-slider
          show-marker
          snap-to-steps

          :title="formatTip"
          :value="vmValue"

          v-model="vmValue"
          v-if="ifComponentAsUiSlider"
          >
        </ui-slider>

        <!-- Switch开关 -->
        <ui-switch
          :title="formatTip"
          :value="vmValue"

          v-model="vmValue"
          v-if="ifComponentAsUiSwitch"
          >
        </ui-switch>

      </div>

      <div 
        class="dovemxui-property-editor-item__container__toolbar"
        v-show="showEditWidget && hasToolbar"
        >
        <ui-button
          size="small" 
          type="primary" 
          ref="dropdownButton"
          :has-dropdown="btnHasMenu"


          @click="onClickByEditBtn"
          @blur="onBlurByEditBtn"

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


    </div>
</template>

<script>
import { 
  UiIcon, 
  UiMenu, 
  UiTextbox, 
  UiSelect, 
  UiTabs, 
  UiTab, 
  UiConfirm, 
  UiButton, 
  UiIconButton, 
  UiAlert, 
  UiToolbar, 
  UiSlider,
  UiSwitch,
  UiProgressLinear
} from 'keen-ui'
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
      initialValue: JSON.stringify(this.itemdata),

      vmValue: this.itemdata.value

    }
  },

  computed: {
    classes(){
        return [
            { 'is-active': this.isActive },
            { 'is-not-active': !this.isActive},
            { 'is-touched': this.isTouched }
        ];
    },
    // -------------- 检测显示用什么控件
    ifComponentAsUiTextBox(){
      const hasUiSpec = this.itemdata.extend.uiDisplayComponent === 'ui-textbox'
      return this.itemdata.dataType === String && hasUiSpec
    },
    ifComponentAsUiProgressLinear(){
      const hasUiSpec = this.itemdata.extend.uiDisplayComponent === 'ui-progress-linear'
      return this.itemdata.dataType === Number && hasUiSpec
    },
    ifComponentAsUiSlider(){
      const hasUiSpec = this.itemdata.extend.uiDisplayComponent === 'ui-slider'
      return this.itemdata.dataType === Number && hasUiSpec
    },
    ifComponentAsUiSwitch(){
      const hasUiSpec = this.itemdata.extend.uiDisplayComponent === 'ui-switch'
      return this.itemdata.dataType === Boolean && hasUiSpec
    },

    // ---------------------------------------
    formatTip(){
      return this.tip + ' : ' + this.vmValue
    },
    isReadOnly(){
      return !!this.itemdata.readonly
    },
    hasToolbar(){
      return !!this.itemdata.extend.showToolbar
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
    },
    submittedValue(){
      return this.itemdata.value
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
    setValue(value) {
      // TODO: format the value
      this.$emit('input', value)
      this.$emit('change', value)
    },

    // ------------------------------------------------------ UiTextbox
    onUiTextBoxValueChange(value){
      //this.setValue(value)
    },

    onUiTextBoxBlur(e){
      if(!this.showEditWidget){
        this.isActive = false
      }
    },

    onUiTextBoxFocus(e){
      this.isActive = true
      this.$emit('focus', e)
    },

    onUiTextBoxUpdateValue(value) {
      this.itemdata.value = value
      this.setValue(value)
    },

    onUiTextBoxKeydownEnter(e){
      console.log('onUiTextBoxKeydownEnter')
      this.toggleEditWidget()
      this.$emit('keydown-enter-prevent', e);
    },

    onUiTextBoxKeydown(e){
      this.$emit('keydown', e);
    },
    // ---------------------------------------------------- UiButton
    onClickByEditBtn(e) {
      
    },

    onBlurByEditBtn(e) {
      this.closeEditWidget()
    },
    // -----------------------------------------------------
    toggleEditWidgetOnClick() {
      if(!this.showEditWidget) {
        this.toggleEditWidget(false)
      }
    },

    toggleEditWidget() {
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
      console.log('onFocus')
      if (this.isActive) {
        return
      }

      this.isActive = true
      this.$emit('focus', e)
    },

    onBlur(e) {
      console.log('onBlur')
      this.closeEditWidget({ autoBlur: true })
      this.$emit('blur', e)
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
    UiSelect, 
    UiTabs, 
    UiTab, 
    UiConfirm, 
    UiButton, 
    UiIconButton, 
    UiAlert, 
    UiToolbar, 
    UiSlider,
    UiSwitch,
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

  width: 100%;

  // 显示非编辑状态
  .dovemxui-property-editor-item__container__display {
    width: 100%;

    &.is-not-active {
      .ui-textbox__input, .ui-textbox__textarea {
        border-bottom: none;
      }
    }

    .ui-textbox {
      margin-bottom: auto;
      width: 100%;

      .ui-textbox__input, .ui-textbox__textarea {
        font-size: $font-size;
        height: auto;
        
      }
    }

  }

  // 编辑状态下工具按钮的样式
  .dovemxui-property-editor-item__container__toolbar{
      
      margin-left: rem-calc(4px);
      .ui-button{
        margin-right: 0;
        min-width: rem-calc(4px);
        width: rem-calc(4px);
        height: rem-calc(16px);
      }
  }
}

</style>