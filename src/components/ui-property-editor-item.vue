<template>
    <div
    @click="toggleEditWidget"
    @focus="onFocus"
    >
      <div
        v-show="!showEditWidget"
      >
        {{ itemdata.value }}
      </div>
      <div
        :is="itemdata.uiComponent"
        v-show="showEditWidget"
      >
        12112
      </div>
    </div>
</template>

<script>
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui'
import { PropertyItem, PropertyEditor } from './def-property-editor'

export default {
  name: "dovemxui-property-editor-item",
  props: {
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
    toggleEditWidget() {
      this[this.showEditWidget ? 'closeEditWidget' : 'openEditWidget']()
    },

    openEditWidget() {
      if (this.disabled) {
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