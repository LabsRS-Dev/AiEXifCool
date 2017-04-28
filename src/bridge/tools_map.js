/**
 * @author Ian
 * @created 2017-04-28 16:48:21
 */
const ToolsMap = {
  // common
  'get.image.thumb': { cli: 'aiexifcool/common/index', action: 'getImageThumbAction' },

  // fix
  'start.fix.image': { cli: 'aiexifcool/fix.image/index', action: 'startFix' },
  'stop.fix.image': { cli: 'aiexifcool/fix.image/index', action: 'stopFix' },

  // remove
  'start.remove.exif': { cli: 'aiexifcool/remove.exif/index', action: 'removeExif' },
  'stop.remove.exif': { cli: 'aiexifcool/remove.exif/index', action: 'stopRemove' },

  // modify
  'get.exif': { cli: 'aiexifcool/edit.image/index', action: 'getExifInfo' },
  'start.modify.exif': { cli: 'aiexifcool/edit.image/index', action: 'modifyExifInfo' },
  'stop.modify.exif': { cli: 'aiexifcool/edit.image/index', action: 'stopModify' }
}

// export
export { ToolsMap }
