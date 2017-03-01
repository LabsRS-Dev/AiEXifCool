'use strict';

const path = require('path');
const appName = require('../config/app.json');
const version = require('../config/app.json');


const banner =
    '/*!\n' +
    ' * ' + appName + ' v' + version + ' (https://github.com/LabsRS-Dev/AiEXifCool)\n' +
    ' * (c) ' + new Date().getFullYear() + ' Romanysoft LAB.\n' +
    ' * Released under the MIT License.\n' +
    ' */';


module.exports = {
    banner,

    isProduction: process.env.NODE_ENV === 'production',

    paths: {
        root: path.join(__dirname, '..'),

        src: {
            main: path.join(__dirname, '..', 'src'),
            docs: path.join(__dirname, '..', 'docs-src')
        },

        output: {
            main: path.join(__dirname, '..', 'dist'),
            lib: path.join(__dirname, '..', 'lib'),
            docs: path.join(__dirname, '..', 'docs')
        },

        resolve(location) {
            return path.join(__dirname, '..', location);
        },

        resolveEx(baseDir, location) {
            return path.join(baseDir, location);
        }
    }
}
