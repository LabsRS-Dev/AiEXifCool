const options = require('./options')
    //处理CSS的兼容性的 Autoprefixer:一个以最好的方式处理浏览器前缀的后处理程序
    //https://npm.taobao.org/package/autoprefixer
const autoprefixer = require('autoprefixer')

const dir_nACommonJS = 'D:/workspace/nACommonJS'
const dir_sdk = dir_nACommonJS + '/sdk'
const dir_vue =  dir_nACommonJS + '/common/vue.js'

module.exports = {
    resolve: {
        modules: [
            options.paths.root
        ],

        alias: {
            // src: 'src',
            // directives: 'src/directives',
            // helpers: 'src/helpers',
            // mixins: 'src/mixins',
            // styles: 'src/styles',
            'dovemaxsdk$': options.paths.resolveEx(dir_sdk, '/dist/dovemax-sdk.js'),

            'keen-ui$': options.paths.resolveEx(dir_vue, '/plugins/Keen-UI/git_source/Keen-UI/dist/keen-ui.js'),
            'keen-ui-css$': options.paths.resolveEx(dir_vue, '/plugins/Keen-UI/git_source/Keen-UI/dist/keen-ui.css'),

            'vue-i18n$': options.paths.resolveEx(dir_vue, '/plugins/vue-i18n/git_source/vue-i18n/dist/vue-i18n.js'),

            'vue$': options.paths.resolveEx(dir_vue, '/git_source/dist/vue.js'),
            'vuex$': options.paths.resolveEx(dir_vue, '/plugins/vuex/git_source/vuex/dist/vuex.js'),
            'vue-router$': options.paths.resolveEx(dir_vue, '/plugins/vue-router.js/git_source/vue-router/dist/vue-router.js')
        },

        extensions: ['.js', '.json', '.vue', '.scss']
    },

    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // configured in the script specific webpack configs
                    },
                    postcss: [
                        autoprefixer({
                            browsers: ['last 2 versions', 'ie > 9', 'Firefox ESR']
                        })
                    ]
                }
            },
            {
                test: /\.js[x]$/,
                exclude: /node_modules/,
                loader: 'babel-loader'

            },

            {
                test: /\.html$/,
                loaders: ['html-loader']
            }

        ]
    },

    // Stats is used to customize Webpack's console output
    // https://webpack.js.org/configuration/stats/
    stats: {
        hash: false,
        colors: true,


        //chunks: false,
        //version: false,
        //children: false,
        //timings: true
    }
};
