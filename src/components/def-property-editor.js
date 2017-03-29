/**
 * 属性编辑项
 *
 * @class PropertyItem
 */
class PropertyItem {
  constructor (key = '', title = '', description = '', value = '', options = {}) {
    this.key = key // 关键Key
    this.title = title // 标题
    this.description = description // 描述
    this.value = value // 当前值，任意类型
    this.dataType = options.dataType || String // 数据类型
    this.readOnly = options.readOnly || false  // 是否只读
    this.extend = options.extend || {}         // 扩展信息
  }
}

// 定义属性编辑器
class PropertyEditor {
  constructor () {
    this.name = 'PropertyEditor'
  }

  setup () {

  }

  /**
   ** 返回属性的当前值。基本类型被封装成对应的封装类实例
   **/
  getValue () {

  }

  /**
   ** 设置属性的值，基本类型以封装类传入
   **/
  setValue (newValue) {

  }

  /**
   ** 将属性对象用一个字符串表示，以便外部的属性编辑器能以可视化的方式显示。缺省返回null，表示该属性不能以字符串表示；
   **/
  getAsText () {

  }

  /**
   ** 用一个字符串去更新属性的内部值，这个字符串一般从外部属性编辑器传入
   **/
  setAsText () {

  }

  /**
   ** 返回表示有效属性值的字符串数组（如boolean属性对应的有效Tag为true和false），以便属性编辑器能以下拉框的方式显示出来。缺省返回null，表示属性没有匹配的字符值有限集合
   **/
  getTags () {

  }

  /**
   ** 为属性提供一个表示初始值的字符串，属性编辑器以此值作为属性的默认值。
   **/
  getInitializationString () {

  }
}


export {
  PropertyItem,
  PropertyEditor
}
