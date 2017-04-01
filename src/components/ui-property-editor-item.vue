<template>
    <div class="dovemxui-property-editor-item__container"
      :class="classes"

      @click="toggleEditWidgetOnClick"
      @blur.capture="onBlur"
      @keydown.esc.stop="onKeydownESC($event)"
    >
      <!-- 显示控件(及编辑状态) -->
      <div 
        class="dovemxui-property-editor-item__container__display"
        :class="classes"
        >

        <!-- 文本编辑框 -->
        <ui-textbox 
          :key="itemdata.id"

          :title="formatTip"
          :readonly="isReadOnly"
          :value="vmValue"

          @change="onUiTextBoxValueChange"
          @blur="onUiTextBoxBlur"
          @focus="onUiTextBoxFocus"
          @input="onUiTextBoxUpdateValue"
          @keydown.enter.prevent="onUiTextBoxKeydownEnter"
          @keydown="onUiTextBoxKeydown"

          v-model="vmValue"
          v-if="ifComponentAsUiTextBox || ifComponentUseDefault"
          >
        </ui-textbox>

        <!-- 滑动条 -->
        <ui-slider
          :key="itemdata.id"

          show-marker
          snap-to-steps

          :title="formatTip"
          :value="vmValue"

          @change="onUiSliderChange"

          v-model="vmValue"
          v-if="ifComponentAsUiSlider"
          >
        </ui-slider>

        <!-- Switch开关 -->
        <ui-switch
          :key="itemdata.id"

          :title="formatTip"
          :value="vmValue"

          @change="onUiSwitchChange"

          v-model="vmValue"
          v-if="ifComponentAsUiSwitch"
          >
        </ui-switch>

        <!-- 进度条 -->
        <ui-progress-linear
          :key="itemdata.id"

          color="primary"
          type="determinate"

          :progress="vmValue"

          v-model="vmValue"
          v-if="ifComponentAsUiProgressLinear"
          >
        </ui-progress-linear>

        <!-- UiProgressCircular 圆形进度条 -->
        <!-- UiAutocomplete 自动完成 -->
        <!-- UiCheckbox 复选框 -->
        <!-- UiCheckboxGroup 复选框组 -->
        <!-- UiDatepicker 日期时间选择 -->
        <!-- UiFileupload 文件上传 -->
        <!-- UiIcon 图标 -->
        <!-- UiButton 按钮 -->
        <!-- UiIconButton 带图标的按钮 -->
        <!-- UiMenu 菜单 -->
        <!-- UiPopover 弹出内容 -->
        <!-- UiPreloader 预加载 -->
        <!-- UiRadioGroup 单选组 -->
        <!-- UiSelect 下拉选择  -->
        <!-- UiSnackbar 信息弹窗  -->

      </div>

      <div 
        class="dovemxui-property-editor-item__container__toolbar"

        @blur.capture="onToolbarBlur"

        v-show="showEditWidget && hasToolbar"
        >
        <ui-button
          size="small" 
          type="primary" 
          ref="dropdownButton"

          :has-dropdown="btnHasMenu"

          @click="onToolBarEditBtnClick"
          @dropdown-open="onToolBarEditBtnDropdownOpen"
          @dropdown-close="onToolBarEditBtnDropdownClose"
          >
          <ui-menu
            contain-focus
            has-secondary-text

            slot="dropdown"

            :options="menuOptions"

            @close="$refs.dropdownButton.closeDropdown()"

            v-if="btnHasMenu"
          >
          </ui-menu>
            <span v-if="!btnHasMenu">...</span>
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
    bus:{
      type: Object,
      default: null
    },
    itemdata:{ 
      type: Object,
      default() {
        return new PropertyItem()
      }
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

      isToolBarEditBtnDropdownOpen: false,

      isSaveChange: false,
      initialValue: JSON.stringify(this.itemdata),

      vmValue: this.itemdata.value
    }
  },

  computed: {
    classes(){
        return [
            { 'is-change': this.isValueChange },
            { 'is-active': this.isActive },
            { 'is-not-active': !this.isActive},
            { 'is-touched': this.isTouched }
        ];
    },
    // -------------- 检测显示用什么控件
    ifComponentAsUiTextBox(){
      const hasUiSpec = this.itemdata.extend.uiDisplayComponent === 'ui-textbox'
      return (typeof this.itemdata.value === 'string') && hasUiSpec
    },
    ifComponentAsUiProgressLinear(){
      const hasUiSpec = this.itemdata.extend.uiDisplayComponent === 'ui-progress-linear'
      return (typeof this.itemdata.value === 'number') && hasUiSpec
    },
    ifComponentAsUiSlider(){
      const hasUiSpec = this.itemdata.extend.uiDisplayComponent === 'ui-slider'
      return (typeof this.itemdata.value === 'number') && hasUiSpec
    },
    ifComponentAsUiSwitch(){
      const hasUiSpec = this.itemdata.extend.uiDisplayComponent === 'ui-switch'
      return (typeof this.itemdata.value === 'boolean') && hasUiSpec
    },
    ifComponentUseDefault(){
      const list = [
        this.ifComponentAsUiTextBox,
        this.ifComponentAsUiProgressLinear,
        this.ifComponentAsUiSlider,
        this.ifComponentAsUiSwitch
      ]

      var hasUiSpec = false
      for(let i=0; i< list.length; ++i){
        hasUiSpec = hasUiSpec || list[i]
      }

      return !hasUiSpec
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
      return !!this.itemdata.extend.showToolbar && !!this.itemdata.extend.hasToolBarMenu
    },
    menuOptions(){
      return this.itemdata.extend.toolBarMenus || []
    },
    isValueChange(){
      const change = this.itemdata.value !== this.orgValue
      console.log(change)
      return change
    },
    orgValue(){
      return JSON.parse(this.initialValue).value
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
    this.bindBus()
    document.addEventListener('click', this.onExternalClick)
    document.addEventListener('keydown', this.onExternalKeydown)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onExternalClick)
    document.removeEventListener('keydown', this.onExternalKeydown)
  },

  methods: {

    // {} ------------------------------------------
    bindBus(){
      var that = this
      if (that.bus) {
        that.bus.$on('to-save-item-data', function(in_item){
          console.dir(in_item)
          if(in_item.id === that.itemdata.id){
            that.save(in_item || that.itemdata)
          }
        })

        that.bus.$on('to-check-item-data', function(in_item){
          if(in_item.id === that.itemdata.id){
            that.check(in_item || JSON.parse(that.initialValue))
          }
        })

        that.bus.$on('to-reset-item-data', function(in_item){
          if(in_item.id === that.itemdata.id){
            that.reset(in_item || JSON.parse(that.initialValue))
          }
        })
      }
    },

    save(item){
      this.isSaveChange = true
      this.itemdata.value = item.value

      Vue.set(this, 'vmValue', item.value)
      this.__updateInitialState(item)
    },
    check(item){
      this.__updateInitialState(item)
    },
    reset(item){
      this.itemdata.value = item.value

      Vue.set(this, 'vmValue', item.value)
      this.__updateInitialState(item)
    },

    __updateInitialState(item){
      const curJSON = JSON.stringify(item)
      if (curJSON !== this.initialValue) {
        console.log('update inital value ...')
        this.initialValue = curJSON
      }
    },

    // {} ------------------------------------------

    setValue(value) {
      this.itemdata.value = value

      this.isSaveChange = false
      this.$emit('change', this.itemdata.id, value)
    },

    resetValue(){
        this.itemdata.value = this.orgValue
        Vue.set(this, 'vmValue', this.orgValue)
        this.$emit('reset', this.itemdata.id, this.orgValue)
    },


    // {}------------------------------------------------------ UiTextbox
    onUiTextBoxValueChange(value){
      // TODO: 可以加入验证的处理方法
      this.setValue(value)
    },
    onUiTextBoxBlur(e){
      if(!this.showEditWidget){
        this.isActive = false
      }else {
        this.$emit('blur', e)
      }
    },
    onUiTextBoxFocus(e){
      if (this.isActive) {
        return
      }
      this.isActive = true
      this.$emit('focus', e)
    },
    onUiTextBoxUpdateValue(value) {
      
    },
    onUiTextBoxKeydownEnter(e){
      console.log('onUiTextBoxKeydownEnter')
      this.toggleEditWidget()
      this.$emit('keydown-enter-prevent', e);
    },
    onUiTextBoxKeydown(e){
      this.$emit('keydown', e);
    },

    // {} --------------------------------------------------- UiSlider
    onUiSliderChange(value) {
      this.setValue(value)
    },

    // {} --------------------------------------------------- UiSwitch
    onUiSwitchChange(value){
      console.log('onUiSwitchChange')
      this.setValue(value)
    },


    // {} --------------------------------------------------- __container__toolbar
    onToolbarBlur(e){
      if(this.showEditWidget){
        this.toggleEditWidget()
      }

      this.isActive = false
      this.$emit('blur', e)
    },


    // {} ---------------------------------------------------- UiButton
    onToolBarEditBtnClick(e) {
      // support Key.enter.down and Key.space.down
      console.log('onToolBarEditBtnClick')
    },

    onToolBarEditBtnDropdownOpen(e) {
      this.isToolBarEditBtnDropdownOpen = true
    },
    onToolBarEditBtnDropdownClose(e){
      this.isToolBarEditBtnDropdownOpen = false
    },

    // {} ----------------------------------------------------- Self
    onBlur(e){
      if(!this.showEditWidget){
        this.isActive = false
        this.$emit('blur', e)
      }
    },

    onKeydownESC(e){
      this.resetValue()
    },

    toggleEditWidgetOnClick() {
      if(!this.showEditWidget) {
        this.toggleEditWidget(false)
      }
    },
    toggleEditWidget() {
      this[this.showEditWidget ? 'closeEditWidget' : 'openEditWidget']()
    },
    openEditWidget() {
      if (this.disabled || this.isReadOnly) {
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

    onEdit(){

    },

    onCloseEdit(){

    },

    // {} ---------------------------------------------- External Event
    onExternalClick(e) {
      if (!this.$el.contains(e.target)) {
        if (this.showEditWidget) {
          this.closeEditWidget({ autoBlur: true })
        } else if (this.isActive) {
          this.isActive = false
        }
      }
    },

    onExternalKeydown(e) {
      if (!this.$el.contains(e.target)) {
        if (this.isToolBarEditBtnDropdownOpen && e.keyCode===27) {
          this.$refs.dropdownButton.closeDropdown()
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
$control-height: rem-calc(16px);

// ================================================
// 整体
// ================================================

.dovemxui-property-editor-item__container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  height: 100%;

  &.is-change {
    
  }
}

// ================================================
// 显示非编辑状态
// ================================================

.dovemxui-property-editor-item__container__display {
  width: 100%;

  &.is-not-active, &.is-active {
    .ui-textbox__input, .ui-textbox__textarea {
      border-bottom: none;
    }
  }

  .ui-textbox {
    margin-bottom: auto;
    width: 100%;
    height: 100%;

    .ui-textbox__input, .ui-textbox__textarea {
      font-size: $font-size;
      height: $control-height;
    }
  }

  .ui-switch {
    width: auto;
    height: 100%;
  }
}

// ================================================
// 编辑状态下工具按钮的样式
// ================================================

.dovemxui-property-editor-item__container__toolbar{
    
    margin-left: rem-calc(4px);
    .ui-button{
      margin-right: 0;
      min-width: rem-calc(4px);
      width: rem-calc(4px);
      height: $control-height;
    }
}

.ui-menu-option__content, .ui-menu-option__text, .ui-menu-option__secondary-text{
  font-size: $font-size;
}
</style>