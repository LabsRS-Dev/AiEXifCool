
/**
 * Exif信息单项
 *
 * @class ExifItem
 */
class ExifItem {
  constructor (key = '', options = {}) {
    this.key = key // 关键索引Key
    this.title = options.title || 'title'
    this.description = options.description || 'description'
    this.category = options.category || 'base'
    this.dataType = options.dataType || String
    this.value = options.value || 'value'
    this.readOnly = options.readOnly || false // 是否只读
    this.extendData = options.extendData || {} // 扩展数据信息
  }
}

/**
 * Exif信息归类大类别
 *
 * @class ExifCategory
 */
class ExifCategory {
  constructor (title = '', options = {}) {
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
 * Exif信息
 *
 * @class ExifInformation
 */
class ExifInformation {
  constructor () {
    this.categories = []
  }

  add (category) {
    this.categories.push(category)
  }
}

export { ExifItem }
export { ExifCategory }
export { ExifInformation }
