'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 有问题，需要参考http://blog.csdn.net/zhangchao19890805/article/details/53150882
const merge = require('deep-assign');

const options = require('./options');
const base = require('./webpack.base.js');

const config = merge(base, {
    watch: true,
    devtool: '#eval-source-map',

    entry: [
        options.paths.resolve('src/index.js')
    ],

    output: {
        filename: 'bundle.js',
        path: options.paths.output.main
    },    

    devServer: {
        contentBase: options.paths.output.main,
        host: '0.0.0.0',
        port: 9000,
        historyApiFallback: true,
        noInfo: true
    }
});

// First item in module.rules array is Vue
config.module.rules[0].options.loaders = {
    scss: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader',
        fallback: 'vue-style-loader'
    }),
    css: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader',
        fallback: 'vue-style-loader'
    })
}

config.module.rules.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
        use: 'css-loader',
        fallback: 'style-loader'
    })
});
module.exports = config;
