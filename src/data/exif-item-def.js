/**
 * @author Ian
 * @created 2017-5-2 13:48:21
 */

/**
 * 信息单项
 *
 * @class Item
 */
class Item {
  static count = 0
  constructor (key = 'key', options = {}) {
    this.id = ++Item.count // 唯一ID
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
 * @class Category
 */
class Category {
  static count = 0
  constructor (title = '', description = '', options = {}) {
    this.id = ++Category.count // 唯一ID
    this.title = title
    this.description = description
    this.locale = {}
    this.items = []
    this.options = options
  }

  getLocalTitle (localeKey) {
    return this.locale['title'][localeKey] || this.title
  }

  getLocaleDescription (localeKey) {
    return this.locale['description'][localeKey] || this.description
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
 * 信息清单
 *
 * @class Manifest
 */
class Manifest {
  static count = 0

  /**
   * Creates an instance of Manifest.
   * @param {String, Number} [owner=null] 信息持有者
   * @memberOf Manifest
   */
  constructor (title = '', description = '', owner = null) {
    this.id = ++Manifest.count // 唯一ID
    this.title = title
    this.description = description
    this.locale = {
      title: {},
      description: {}
    }

    this.categories = []
    this.owner = owner
  }

  getLocalTitle (localeKey) {
    return this.locale['title'][localeKey] || this.title
  }

  getLocaleDescription (localeKey) {
    return this.locale['description'][localeKey] || this.description
  }

  add (category) {
    this.categories.push(category)
  }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const baseManifest = new Manifest('base', '')
baseManifest.locale = {
  title: {
    'en': 'Base',
    'zh-CN': '基础'
  },
  description: {
    'en': 'Base Manifest',
    'zh-CN': '最基础的配置信息'
  }
}

// EXIF General
const category_General = new Category('General', 'General category')
category_General.locale = {
  title: {
    'en': 'General',
    'zh-CN': '一般'
  },
  description: {
    'en': 'General category',
    'zh-CN': '一般类型'
  }
}

// EXIF Camera Settings
const category_EXIFCameraSettings = new Category('EXIF Camera Settings', '')
category_EXIFCameraSettings.locale = {
  title: {
    'en': 'EXIF Camera Settings',
    'zh-CN': '照相机EXIF设置信息'
  },
  description: {
    'en': '',
    'zh-CN': '针对照相机的EXIF设置信息'
  }
}

// IPTC Tags
const category_IPTCTags = new Category('IPTC Tags', '')
category_IPTCTags.locale = {
  title: {
    'en': 'IPTC Tags',
    'zh-CN': '照相机EXIF设置信息'
  },
  description: {
    'en': '',
    'zh-CN': '针对照相机的EXIF设置信息'
  }
}

// GEO Tags
const category_GEOTags = new Category('GEO Tags', '')
category_GEOTags.locale = {
  title: {
    'en': 'GEO Tags',
    'zh-CN': '照相机EXIF设置信息'
  },
  description: {
    'en': '',
    'zh-CN': '针对照相机的EXIF设置信息'
  }
}




// /////////////////////////////////////////////////////////////////////////////////////////////////////

// export
export { Item, Category }
