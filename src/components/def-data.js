
/**
 * 信息单项
 *
 * @class DataItem
 */
class DataItem {
  static count = 0
  constructor (key = 'key', options = {}) {
    this.id = ++DataItem.count // 唯一ID
    this.key = key // 关键索引Key
    this.title = options.title || options.Title || 'title'
    this.description = options.description || options.Description || 'description'
    this.category = options.category || options.Category || 'base'
    this.value = options.value || options.Value || 'value'
    this.readonly = options.readonly || options.readOnly || false // 是否只读
    this.extend = options.extend || options.Extend || {} // 扩展数据信息
  }
}

/**
 * 信息归类大类别
 *
 * @class DataCategory
 */
class DataCategory {
  static count = 0
  constructor (title = '', options = {}) {
    this.id = ++DataCategory.count // 唯一ID
    this.title = title || ''
    this.items = []
  }

  add (item) {
    this.items.push(item)
  }

  getItemKeyList () {
    var list = []
    for (var i = 0; i < this.items.length; ++i) {
      const item = this.items[i]
      list.push(item.key)
    }
    return list
  }
}

/**
 * 信息
 *
 * @class DataInformation
 */
class DataInformation {
  static count = 0

  /**
   * Creates an instance of DataInformation.
   * @param {String, Number} [owner=null] 信息持有者
   * @memberOf DataInformation
   */
  constructor (owner = null) {
    this.id = ++DataInformation.count // 唯一ID
    this.categories = []
    this.owner = owner
  }

  add (category) {
    this.categories.push(category)
  }
}


export { DataItem }
export { DataCategory }
export { DataInformation }
